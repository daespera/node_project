const baseRepo = require('../../infrastructure/model.repository')('./../components/users/userAttributes.model.js');

module.exports = {
	...baseRepo,
	initializeAttributes:  async id => {
		console.log("initializeAttributes");
		await baseRepo.model().bulkCreate([
		  { userId : id, attribute: "ACL_USER_ADD", value: "false" },
		  { userId : id, attribute: "ACL_USER_EDIT", value: "false" },
		  { userId : id, attribute: "ACL_USER_RETRIEVE", value: "false" },
		  { userId : id, attribute: "ACL_USER_DELETE", value: "false" },
		],
		{ updateOnDuplicate: ["value", "attribute"] });
	}
};