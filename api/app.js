const express = require('express'),
  http = require('http'),
  path = require('path'),
  fs = require("fs"),
  reload = require('reload'),
  es6Renderer = require('express-es6-template-engine'),
  serialize = require('serialize-javascript'),
  cookieParser = require('cookie-parser'),
  csrf = require('csurf'),  
  packageJson = require('../package.json'),
  csrfProtection = csrf({ cookie: true }),
  { ValidationError } = require('express-validation'),
  afterResponseHandler = require('./infrastructure/afterResponseHandler'),
  multer = require('multer');

const { PORT, API_BASE_URL } = require('./infrastructure/config'),
  OAuthMiddleware = require('./components/oauth/oAuth.middleware');

const RestAdapterRouter = require('./components/rest_adapter/restAdapter.routes'),
  OAuthRouter = require('./components/oauth/oAuth.routes'),
  UsersRouter = require('./components/users/users.routes'),
  ContentsRouter = require('./components/contents/contents.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(afterResponseHandler.handler);

// Api Routes
OAuthRouter.routesConfig(app);
UsersRouter.routesConfig(app);
ContentsRouter.routesConfig(app);
RestAdapterRouter.routesConfig(app);

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

const handleError = (err, res) => {
  console.log(err);
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
},
upload = multer({
  dest: "./build/uploads"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.post(
  "/upload",
  upload.single("image" /* name attribute of <file> element in your form */),
  [
    OAuthMiddleware.validJWTNeeded,
    (req, res) => {
        const tempPath = req.file.path;
        console.log(req);
        const targetPath = path.join(__dirname, "../build/uploads/image.png");
    
        if (path.extname(req.file.originalname).toLowerCase() === ".png") {
          fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);
    
            res
              .status(200)
              .json({ url: 'http://localhost:3000/uploads/image.png' });
          });
        } else {
          fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);
    
            res
              .status(403)
              .contentType("text/plain")
              .end("Only .png files are allowed!");
          });
        }
      }
    ]
);

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
  console.log("err.code");
  console.log(err);
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
});