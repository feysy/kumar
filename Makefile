default:
	docker-compose build

run:
	docker-compose run api

runloc:
	python ./main.py

reqs:
	pip install -r requirements.txt

dbup:
	docker-compose up -d mongodb
