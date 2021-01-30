const url = require('url'),
userAttributesRepo = require('./../components/users/userAttributes.repository');

module.exports.handler = (req, res, next) => {
	const oldWrite = res.write,
    oldEnd = res.end,
    chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);
    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk)
      chunks.push(chunk);

    var body = Buffer.concat(chunks).toString('utf8');
    const methodURI = (req.method+" "+url.parse(req.url).pathname).toUpperCase()
			.replace(/[^\w ]+/g,'')
      .replace(/ +/g,'_'),
			mapping = {
				['POST_APIV1USER']: () => {
					/* console.log(req.path, JSON.parse(body).data.id);
					console.log("data");
					console.log(res.body);*/
					userAttributesRepo.initializeAttributes(JSON.parse(body).data.id); 
				}
			},
			maped = mapping[methodURI];
			maped && maped();

    oldEnd.apply(res, arguments);
  };

  next();
};
