module.exports = (filename) => {
    var module = {};

    const model =  sequelize['import'](filename),
        { Op } = require("sequelize");

    module.create = async (params) => {
        return await model.create(params);
    }

    module.retrieve = async (id = null,params) => {   
        var condition = {};
        var filter = [];

        if (id != null)
            condition.id = {[Op.eq]: id};

        console.log(params.filter);

        if (params.filter != undefined){
            console.log(1);
            filter = params.filter.split(",");
        }

        for(var i = 0; i < filter.length; i++){
            console.log(filter[i]);
        }

        return await model.findAll({
            where: condition
        });
    }

    return module;
};