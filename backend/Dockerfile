FROM python:3.9.10-alpine

WORKDIR /app

RUN apk add groff less

RUN pip install --no-cache-dir awscli

# Just to make sure its installed alright
RUN aws --version

RUN pip install chalice boto3 pipenv

RUN aws configure set default.region us-east-1

COPY . .
COPY .chalice .chalice

EXPOSE 8001
CMD chalice local --host=0.0.0.0 --port=8001