default:
	docker-compose build

run:
	docker-compose run --service-ports api

runloc:
	python3 ./main.py

reqs:
	pip install -r requirements.txt

dbup:
	docker-compose up -d mongodb
