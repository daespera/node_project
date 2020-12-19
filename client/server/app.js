const express = require('express'),
  http = require('http'),
  path = require('path'),
  reload = require('reload'),
  es6Renderer = require('express-es6-template-engine'),
  serialize = require('serialize-javascript'),
  cookieParser = require('cookie-parser'),
  csrf = require('csurf'),
  axios = require("axios"),
  packageJson = require('../package.json'),
  csrfProtection = csrf({ cookie: true }),
  { ValidationError } = require('express-validation');

require("./infrastructure/db.connection");


const { PORT, API_BASE_URL } = require('./infrastructure/config');

const OAuthRouter = require('./components/oauth/oAuth.routes'),
  UsersRouter = require('./components/users/users.routes');;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Api Routes
OAuthRouter.routesConfig(app);
UsersRouter.routesConfig(app);

// view engine setup
app.engine('html', es6Renderer);
app.set('views', path.resolve(__dirname, '../build/'));
app.set('view engine', 'html');

// Serve static files
app.use(packageJson.homepage, express.static(path.join(__dirname, '..', 'build'), {
  index: false
}));

const server = http.createServer(app);
server.listen(PORT, () => console.log('App is running on localhost:'+PORT));
// Wire up reload behavior if app is not running in production mode
if (process.env.NODE_ENV !== 'production') {
  // Wires up handler for /reload/reload.js route
  reload(app);
}
// reast adaptor
app.all('/rest_proxy', csrfProtection, async (req, res) => {
  const url = req.method == 'GET' ? req.query._endpoint : req.body._endpoint;
  delete req.body._endpoint;
  delete req.query._endpoint;
  let params = req.method == 'GET' ? req.query : req.body;
  var status;
  var data;
  if (url == "oauth/token"){
    let oAuthCreds = {
      grant_type: "password",
      client_id : "4ff93924-3e44-48cd-a0c6-489542e67e73",
      secret : "test"
    };
    params = {
      ...oAuthCreds,
      ...params
    };
  }

  let _headers = url != "oauth/token"
    ? {'Authorization': 'Bearer ' + (req.headers.cookie.match('(^|; )access_token=([^;]*)')||0)[2]}
    : {};
  try {
    console.log({
      method: req.method,
      url: API_BASE_URL + url,
      headers: {
        ..._headers,
        'Content-Type': 'application/json'
      },
      data: params
    });
    const _params = req.method == 'GET' ? {params: params} : {data: params};
    const payload = {
      method: req.method,
      url: API_BASE_URL + url,
      headers: {
        ..._headers,
        'Content-Type': 'application/json'
      }
    };
    const response = await axios({...payload,..._params});
    status = response.status;
    data = response.data;
  } catch (error) {
    console.log(error);
    status = error.response.status;
    data = error.response.data;
  }
  return res.status(status).send(data);
});

// For all requests besides /api, serve the index template based on create-react-app's public/index.html file
app.get('*', csrfProtection, (req, res) => {
  res.render('index', {
    locals: {
      header: '<header class="express-header"></header>',
      footer: '<footer class="express-footer"></footer>',
      csrf_token: serialize(req.csrfToken()),
    },
  });
});

app.use((err, req, res, next) => {
  console.log(err.code);
  if (err.code === 'EBADCSRFTOKEN') res.status(403).json({
      name: "CSRFERROR",
      message: "CSRF Token Mismatch",
      statusCode: 403,
      error: "Bad Request",
      details: [
          {
              csrf: "Invalid csrfToken"
          }
      ]
  });
  if (err instanceof ValidationError) return res.status(err.statusCode).json(err)
 
  return next(err)
})