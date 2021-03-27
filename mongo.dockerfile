FROM mongo

EXPOSE 27017

COPY ./initialize.js /data/db/initialize.js

#RUN mongo < /data/db/initialize.js
