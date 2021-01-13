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
    try{
      let limit = params.size != undefined ? parseInt(params.size) : 5,
      offset = (params.page != undefined ? parseInt(params.page) : 1) * limit,
      filters = params.filter != undefined && JSON.parse( params.filter).filters,
      orWhere = {[Op.or] : []},
      andWhere = {[Op.and] : []},
      condition = {where : {}},
      order = [['created_at', 'DESC']];

      if (id != null)
        condition.where.push({ id : {[Op.eq]: id} });      
      const recurse = (ruleGroup,pointer="where") => {
        var _where = {};
        let _group = {[Op[ruleGroup.combinator]]: []};
        eval("_"+pointer+" = {..._"+pointer+",..._group};")
        ruleGroup.rules.forEach((filter,index) => {
          let rule;
          if (filter.hasOwnProperty('rules')){
            let _rule = recurse(filter);
            rule = [_rule];
          }else{
            rule = [{ [filter.field] : {[Op[filter.operator]]: filter.value} }];
          }
          console.log("rules");
          console.log(rule);
          eval("_"+pointer+"[Op[ruleGroup.combinator]] = [..._"+pointer+"[Op[ruleGroup.combinator]],...rule]");

        });
        console.log("_test");
        console.log(_where);
        return _where;
      };
      let _where = {};
      if(params.where)
        _where = recurse(JSON.parse(params.where));
      condition.where = {...condition.where,..._where};
      
      /* if (filters){
        filters.forEach(filter => {
          let operation = filter.operator != undefined ? filter.operator : 'eq',
          conjunction = filter.conjunction != undefined ? filter.conjunction : 'and',
          concat = [{ [filter.criteria] : {[Op[filter.operator]]: filter.value} }];
          if (conjunction=='or')
            orWhere[Op.or] = [...orWhere[Op.or],...concat];
          else
            andWhere[Op.and] = [...andWhere[Op.and],...concat];
          if (andWhere[Op.and].length)
            condition.where = {...condition.where,...andWhere};
          if (orWhere[Op.or].length)
            condition.where = {...condition.where,...orWhere};
        });
      } */
      condition.offset = offset - limit;
      condition.limit = limit;
      condition.order = order;
      return await model.findAll(
          condition 
      );
    }catch(e){
      console.log(e);
    }
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