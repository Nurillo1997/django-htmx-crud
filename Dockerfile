# Base image
FROM python:3.12-slim

# Working directory
WORKDIR /app

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Run server with gunicorn
CMD ["gunicorn", "base.wsgi:application", "--bind", "0.0.0.0:8000"]