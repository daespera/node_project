const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const { PORT } = require('./infrastructure/config');

require("./infrastructure/db.connection");

const UsersRouter = require('./components/users/users.routes');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(bodyParser.json());

UsersRouter.routesConfig(app);

app.get('/', (request, response) => {
    const User = require('./components/users/User.Model');

    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });

    

    response.send('done');

});

app.listen(PORT, () => console.log(`server started on port ${PORT}`));