from django.urls import path
from .views import IndexView, EmployeeEditView


urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('edit_employee/<int:pk>/', EmployeeEditView.as_view(), name='edit_employee'),
]