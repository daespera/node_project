const WebAdapterController = require('./webAdapter.controller'),
	OAuthMiddleware = require('./../oauth/oAuth.middleware'),
	csrf = require('csurf'),
	csrfProtection = csrf({ cookie: true }),
  multer = require('multer'),
  upload = multer({
    dest: "./build/uploads"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  });

exports.routesConfig = (app) => {
	app.all('/rest_proxy', csrfProtection, WebAdapterController.proxy);

	app.post(
	  "/upload",
	  upload.single("image" /* name attribute of <file> element in your form */),
	  OAuthMiddleware.validJWTNeeded,
	  WebAdapterController.imageUpload
	);
}