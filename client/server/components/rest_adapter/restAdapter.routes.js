const RestAdapterController = require('./restAdapter.controller'),
	csrf = require('csurf'),
	csrfProtection = csrf({ cookie: true });


exports.routesConfig = function (app) {
	app.all('/rest_proxy', csrfProtection, RestAdapterController.proxy);
}