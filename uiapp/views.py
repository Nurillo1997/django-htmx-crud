from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView
from django.core import serializers
from uiapp.models import EmployeeModel
from uiapp.forms import EmployeeForm


class IndexView(ListView):
    template_name = 'index.html'

    def get(self, request):
        employees = EmployeeModel.objects.all()

        data = serializers.serialize('json', employees, use_natural_foreign_keys=True)

        context = {'employees': data}
        return render(request, self.template_name, context)


class EmployeeEditView(ListView):
    """
    Renders and processes the inline edit form for a single employee.
    Loaded into the page via HTMX (GET) and posted back via HTMX (POST).
    """
    template_name = 'edit-form-htmx.html'

    def get(self, request, pk):
        employee = get_object_or_404(EmployeeModel, pk=pk)
        form = EmployeeForm(instance=employee)
        context = {'form': form}
        return render(request, self.template_name, context)

    def post(self, request, pk):
        # The form re-submits the real pk via a hidden "id" field, since the
        # initial GET can be triggered with a placeholder pk in the URL.
        if request.POST.get('id'):
            pk = request.POST.get('id')

        employee = get_object_or_404(EmployeeModel, pk=pk)
        form = EmployeeForm(request.POST, instance=employee)

        if form.is_valid():
            form.save()
            context = {'form': form, 'success': ['Data saved successfully']}
            response = render(request, self.template_name, context)
            # Notify the page so the Oracle JET table can refresh its data.
            response['HX-Trigger'] = 'employeeChanged'
            return response

        context = {'form': form, 'errors': form.errors.values()}
        return render(request, self.template_name, context)