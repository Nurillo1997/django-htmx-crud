# Django, Oracle JET and HTMX

A full-stack web application built with Django, Oracle JET UI components, and HTMX for dynamic interactions.

## Tech Stack

- **Backend:** Python, Django 6.0
- **Frontend:** Oracle JET, HTMX, Tailwind CSS
- **Database:** SQLite (local), PostgreSQL (production)
- **DevOps:** Docker, Docker Compose

## Features

- Employee management: list, view, and edit records (Create/Read/Update); delete is not implemented yet
- Dynamic data table powered by Oracle JET (`oj-table`), backed by a Django-served JSON data provider
- Inline edit form loaded and saved via fetch/HTMX without a full page reload
- Form validation: email format and salary range (checked against the employee's job)
- Django Admin panel for direct data management
- Database constraints (salary validation, unique email)
- Dockerized for easy deployment

## Project Structure

django-htmx-crud/

├── base/                 # Django project configuration

│   ├── settings.py

│   ├── urls.py

│   └── wsgi.py

├── uiapp/                # Main application

│   ├── migrations/       # Database migrations

│   ├── static/scripts/   # JavaScript files

│   ├── templates/        # HTML templates

│   ├── forms.py          # Form definitions and validation

│   ├── models.py         # Data models

│   ├── views.py          # View logic

│   └── urls.py           # URL routing

├── Dockerfile

├── docker-compose.yml

└── requirements.txt

## Getting Started

### Prerequisites

- Python 3.12+
- Docker and Docker Compose

### Run with Docker

```bash
docker-compose up --build
```

Open http://localhost:8000

### Run locally

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file and adjust as needed
cp .env.example .env

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Open http://127.0.0.1:8000

## Admin Panel

Django's built-in admin is available at `/admin/` (e.g. http://127.0.0.1:8000/admin/). There is no link to it in the app's UI — it's a separate interface for managing data directly.

A superuser account is required to log in. Each environment has its own database, so a superuser created locally will **not** exist in a freshly deployed production database — run `python manage.py createsuperuser` again after deploying (e.g. via `docker exec -it <container_name> python manage.py createsuperuser`).

## Data Models

- **Employee** — employee records with salary constraints and unique email validation
- **Job** — job titles and salary ranges
- **Department** — company departments

## Reference

This project is inspired by and rebuilt from a sample by [Andrej Baranovskij](https://www.youtube.com/@AndrejBaranovskij):

- [Original source (Django + HTMX sandbox)](https://github.com/katanaml/sample-apps/tree/master/20/django-htmx-sandbox)

The original sample uses Alpine.js and a plain HTML table; this version replaces that with Oracle JET's `oj-table` component, which required rebuilding the data flow between the table, the edit form, and HTMX.