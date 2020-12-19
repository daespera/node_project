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
        let condition = params.filter != undefined ? {where : [{[Op.or]:[]}]} : {where : []};
        let filter = [];
        let order = [['created_at', 'DESC']];

        const limit = params.size != undefined ? parseInt(params.size) : 5;

        const offset = (params.page != undefined ? parseInt(params.page) : 1) * limit;

        if (id != null)
            condition.where.push({ id : {[Op.eq]: id} });

        if (params.filter != undefined){
            filter = params.filter.split(",");
        }

        for(let i = 0; i < filter.length; i++){
            let constraints = filter[i].split(":");
            let operation = constraints[2] != 'umdefined' ? constraints[2] : 'eq';
            if (constraints[3]=='OR')
                condition.where[0][Op.or].push({ [constraints[0]] : {[Op[operation]]: constraints[1]} });
            else
                condition.where.push({ [constraints[0]] : {[Op[operation]]: constraints[1]} });
        }

        condition.offset = offset - limit;
        condition.limit = limit;
        condition.order = order;
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