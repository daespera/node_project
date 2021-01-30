const usersRepo = require('./users.repository');
const userAttributesRepo = require('./userAttributes.repository');

module.exports = {
  ...require('../../infrastructure/base.controller')(usersRepo),
  createAttribute : async (req, res) => {
  	const model ={
  		id: req.params._id+"-"+req.body.attribute,
  		userId: req.params._id,
  		attribute: req.body.attribute,
  		value: req.body.value
  	},
  	response = await userAttributesRepo.model().upsert(model);
  	return res.status(200).send({
        message: "updated",
        data: model
    });
  }
};

