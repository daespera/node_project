const RestAdapterController = require('./restAdapter.controller'),
	csrf = require('csurf'),
	csrfProtection = csrf({ cookie: true });

exports.routesConfig = (app) => {
	app.all('/rest_proxy', csrfProtection, RestAdapterController.proxy);
}