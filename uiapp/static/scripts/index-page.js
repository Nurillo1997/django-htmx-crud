require(['knockout',
    'ojs/ojarraydataprovider',
    'ojs/ojvalidation-base',
    'ojs/ojknockout',
    'ojs/ojtable',
    'ojs/ojvalidation-datetime',
    'ojs/ojvalidation-number'
], function (ko, ArrayDataProvider, ValidationBase) {
    'use strict';

    let ViewModel = function () {

        // for salary fields
        const salOptions = {
            style: 'currency',
            currency: 'USD'
        };
        const salaryConverter = ValidationBase.Validation.converterFactory("number").createConverter(salOptions);

        // for date fields
        const dateOptions = {
            formatStyle: 'date',
            dateFormat: 'medium'
        };
        const dateConverter = ValidationBase.Validation.converterFactory("datetime").createConverter(dateOptions);

        // the use of arrow functions works just fine
        this.formatSal = data => salaryConverter.format(data);
        this.formatDate = data => dateConverter.format(data);

        const self = this;

        function buildEmployeesArray(employeesArray) {
            var empsArray = [];
            employeesArray.forEach(function (employee) {
                var emp = {empno: employee.pk,
                           fname: employee.fields.first_name,
                           lname: employee.fields.last_name,
                           email: employee.fields.email,
                           phone: employee.fields.phone_number,
                           job: employee.fields.job_id,
                           hiredate: employee.fields.hire_date,
                           sal: employee.fields.salary,
                           comm: employee.fields.commission_pct,
                           manager: employee.fields.manager_id,
                           dept: employee.fields.department_id};

                empsArray.push(emp);
            });
            return empsArray;
        }

        var employeesArray = JSON.parse(JSON.parse(document.getElementById('employees').textContent));
        var empsArray = buildEmployeesArray(employeesArray);

        this.dataProvider = new ArrayDataProvider(empsArray, {
            keyAttributes: "empno"
        });

        // Re-fetch the employee list from the server and refresh the
        // JET table's data provider without a full page reload.
        this.refreshEmployees = function () {
            fetch(window.location.pathname, {
                headers: {'X-Requested-With': 'XMLHttpRequest'}
            })
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const scriptTag = doc.getElementById('employees');
                    if (!scriptTag) {
                        return;
                    }
                    const freshEmployees = JSON.parse(JSON.parse(scriptTag.textContent));
                    const freshArray = buildEmployeesArray(freshEmployees);
                    self.dataProvider = new ArrayDataProvider(freshArray, {
                        keyAttributes: "empno"
                    });
                    document.getElementById('table').data = self.dataProvider;
                });
        };
    };

    const viewModel = new ViewModel();
    ko.applyBindings(viewModel, document.getElementById('table'));

    // --- Edit button + form loading wiring (plain JS, outside Knockout) ---

    const editFormSection = document.getElementById('edit-form-section');
    const editFormContainer = document.getElementById('edit-form-container');

    function openEditForm(employeeId) {
        fetch('/edit_employee/' + employeeId + '/', {
            headers: {'X-Requested-With': 'XMLHttpRequest'}
        })
            .then(response => response.text())
            .then(html => {
                editFormContainer.innerHTML = html;
                editFormSection.style.display = 'block';
                editFormSection.scrollIntoView({behavior: 'smooth'});
            });
    }

    function closeEditForm() {
        editFormSection.style.display = 'none';
        editFormContainer.innerHTML = '';
    }

    // Delegate clicks on dynamically-rendered "Edit" buttons inside the table.
    // The employee id is read from a hidden oj-bind-text span inside the
    // button, since JET table column templates don't support binding
    // arbitrary data-* attributes directly.
    document.getElementById('table').addEventListener('click', function (event) {
        const btn = event.target.closest('.edit-employee-btn');
        if (!btn) {
            return;
        }
        const idHolder = btn.querySelector('.emp-id-holder');
        const employeeId = idHolder ? idHolder.textContent.trim() : null;
        if (!employeeId) {
            return;
        }
        openEditForm(employeeId);
    });

    // Delegate clicks on the "Close" button inside the dynamically-loaded form.
    editFormContainer.addEventListener('click', function (event) {
        if (event.target.id === 'close-edit-form') {
            closeEditForm();
        }
    });

    // Intercept the edit form's submit so we can POST it via fetch
    // (htmx is loaded globally, but this form is injected after htmx's
    // initial scan, so we handle the submit manually instead of relying
    // on htmx auto-processing dynamically injected content).
    editFormContainer.addEventListener('submit', function (event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const employeeId = formData.get('id');

        fetch('/edit_employee/' + employeeId + '/', {
            method: 'POST',
            body: formData,
            headers: {'X-Requested-With': 'XMLHttpRequest'}
        })
            .then(response => {
                if (response.headers.get('HX-Trigger') === 'employeeChanged') {
                    viewModel.refreshEmployees();
                }
                return response.text();
            })
            .then(html => {
                editFormContainer.innerHTML = html;
            });
    });
});