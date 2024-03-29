FROM python:3.7

# EXPOSE 8080

COPY ./requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

COPY static/ /static
COPY app/ /app

RUN apt-get update
RUN apt-get -y install npm
RUN npm install --global yarn
WORKDIR /static
RUN yarn
RUN yarn build
WORKDIR /

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
