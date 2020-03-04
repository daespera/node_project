# node_project
initial node project
# migration script
npx sequelize-cli db:migrate --url 'mysql://root:root@0.0.0.0:3309/node' --migrations-path 'infrastructure/migrations'
# seeder script
npx sequelize-cli db:seed:all --url 'mysql://root:root@0.0.0.0:3309/node' --seeders-path 'api/infrastructure/seeders'
