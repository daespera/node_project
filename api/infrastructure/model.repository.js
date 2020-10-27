module.exports = (filename) => {
    var module = {};

    const model =  sequelize['import'](filename),
        { Op } = require("sequelize");

    module.model = () => {
        return model;
    }

    module.create = async (params) => {
        return await model.create(params);
    }

    module.retrieve = async (id = null,params) => {   
        var condition = params.filter != undefined ? {where : [{[Op.or]:[]}]} : {where : []};
        var filter = [];

        const limit = params.size != undefined ? parseInt(params.size) : 5;

        const offset = (params.page != undefined ? parseInt(params.page) : 1) * limit;

        if (id != null)
            condition.where.push({ id : {[Op.eq]: id} });

        if (params.filter != undefined){
            filter = params.filter.split(",");
        }

        for(var i = 0; i < filter.length; i++){
            var constraints = filter[i].split(":");
            var operation = constraints[2] != 'umdefined' ? constraints[2] : 'eq';
            if (constraints[3]=='OR')
                condition.where[0][Op.or].push({ [constraints[0]] : {[Op[operation]]: constraints[1]} });
            else
                condition.where.push({ [constraints[0]] : {[Op[operation]]: constraints[1]} });
        }

        condition.offset = offset - limit;
        condition.limit = limit;
        return await model.findAll(
            condition 
        );
    }

    module.update = async (id = null,params) => {   
        var obj = await model.findByPk(id);
        return await obj.update(params);
    }

    module.delete = async (id = null,params) => {   
        return await model.destroy({
            where: {
                id: id
            }
        });
    }

    return module;
};