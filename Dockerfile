FROM python:3.11-slim-buster

WORKDIR /flask-app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY ./static ./static
COPY ./templates ./templates
COPY app.py .

CMD ["python", "app.py"]