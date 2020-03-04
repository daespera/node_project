const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const { PORT } = require('./api/infrastructure/config');

require("./api/infrastructure/db.connection");

const UsersRouter = require('./api/components/users/users.routes');

const OAuthRouter = require('./api/components/oauth/oAuth.routes');

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
OAuthRouter.routesConfig(app);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));