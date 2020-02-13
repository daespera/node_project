var model = {};
const { Op } = require("sequelize");

class Repo {

    constructor(filename){
        model = sequelize['import'](filename);
    }

    op(){
        return Op;
    }

    model(){
        return model;
    }

    create(object){
        console.log(object);
        return this.model().create(object);
    }

    retrieve(id = null,object){   
        var condition = {id: {[this.op().eq]: id}};
        return this.model().findAll({
            where: condition
        });
    }
}

module.exports  = Repo;