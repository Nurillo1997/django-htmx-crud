# Django, Oracle JET and HTMX

A full-stack web application built with Django, Oracle JET UI components, and HTMX for dynamic interactions.

## Tech Stack

- **Backend:** Python, Django 6.0
- **Frontend:** Oracle JET, HTMX, Tailwind CSS
- **Database:** SQLite
- **DevOps:** Docker, Docker Compose

## Features

- Employee management system with CRUD operations
- Dynamic data table powered by Oracle JET
- Real-time UI updates with HTMX
- Django Admin panel for data management
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

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Open http://127.0.0.1:8000

## Data Models

- **Employee** — employee records with salary constraints and unique email validation
- **Job** — job titles and salary ranges
- **Department** — company departments

## Reference

- Original project by [Andrej Baranovskij](https://www.youtube.com/@AndrejBaranovskij)
- [GitHub source](https://github.com/katanaml/sample-apps/tree/master/21/django-jet-htmx-sandbox)
