from django import forms
from .models import EmployeeModel


class DateInput(forms.DateInput):
    input_type = 'date'


class EmployeeForm(forms.ModelForm):

    def clean_email(self):
        email = self.cleaned_data.get('email', '')
        if '@' not in email:
            raise forms.ValidationError('Invalid email')
        return email

    def clean_salary(self):
        salary = self.cleaned_data.get('salary')
        job = self.cleaned_data.get('job_id')

        if salary is None or job is None:
            return salary

        if job.min_salary is not None and salary < job.min_salary:
            raise forms.ValidationError(
                'Invalid salary, must be in range [{}, {}]'.format(job.min_salary, job.max_salary)
            )
        if job.max_salary is not None and salary > job.max_salary:
            raise forms.ValidationError(
                'Invalid salary, must be in range [{}, {}]'.format(job.min_salary, job.max_salary)
            )
        return salary

    class Meta:
        model = EmployeeModel
        fields = ['employee_id',
                  'first_name',
                  'last_name',
                  'email',
                  'phone_number',
                  'hire_date',
                  'job_id',
                  'salary',
                  'commission_pct',
                  'manager_id',
                  'department_id']
        widgets = {
            'hire_date': DateInput()
        }