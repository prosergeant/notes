# syntax=docker/dockerfile:1
FROM python:3.8-slim-buster
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY req.txt /code/

RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2

RUN pip install -r req.txt

COPY . /code/

#RUN /code/start

COPY ./start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start