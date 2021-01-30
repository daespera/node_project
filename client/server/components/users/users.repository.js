/*const Repo = require('../../infrastructure/model.repository');


class UserRepo extends Repo {
    constructor() {
        super('/home/ayannahpc/Workspace/node/components/users/users.model.js');
    }
}
*/
//module.exports = UserRepo;
const baseRepo = require('../../infrastructure/model.repository')('./../components/users/users.model.js');

module.exports = {
	...baseRepo
};