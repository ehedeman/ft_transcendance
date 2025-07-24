USER=ehedeman

all:
	docker compose -f ./docker-compose.yaml up --build

#from scratch
build:
	docker volume create srcs_node_db
	mkdir /goinfre/$(USER)/docker/volumes/srcs_node_db/_data/frontend
	mkdir /goinfre/$(USER)/docker/volumes/srcs_node_db/_data/backend
	mkdir /goinfre/$(USER)/docker/volumes/srcs_node_db/_data/public

down:
	docker compose -f ./docker-compose.yaml down

