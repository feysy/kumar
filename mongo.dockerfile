FROM mongo

EXPOSE 27017

COPY ./database/initialize.js /data/db/initialize.js

#RUN mongo < /data/db/initialize.js
