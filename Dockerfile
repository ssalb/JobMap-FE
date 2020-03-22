FROM ubuntu:latest
RUN apt update -y
RUN apt install -y python3-pip
COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt
EXPOSE 80
ENTRYPOINT ["python3"]
CMD ["app.py"]