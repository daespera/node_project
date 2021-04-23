# node_project
initial node project
# docker compose sequence
sudo docker ps --filter status=dead --filter status=exited -aq | sudo xargs -r docker rm -v
sudo docker images --no-trunc | sudo grep '<none>' | sudo awk '{ print $3 }' | sudo xargs -r docker rmi
sudo docker rmi -f $(sudo docker images | grep "^<none>" | awk "{print $3}"); sudo docker-compose kill; yes y |sudo docker-compose rm; sudo docker-compose build --no-cache; sudo docker-compose up;
# migration script
sudo docker exec -it node_project_client_1 npx sequelize-cli db:migrate --url 'mysql://root:root@db:3306/node' --migrations-path 'api/infrastructure/migrations'
# seeder script
sudo docker exec -it node_project_client_1 npx sequelize-cli db:seed:all --url 'mysql://root:root@db:3306/node' --seeders-path 'api/infrastructure/seeders'