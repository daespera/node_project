import React, {useState } from "react";
import { useFilter } from "./FilterBuilder";

const RulesGroup = ({indexString, index, filterFields}) => {
  const { where, setWhere } = useFilter();
  const[toggleFilterAction, setToggleFilterAction] = useState(false),
  changeCombinator = (value) => {
    let _where = where;
    eval('_'+indexString)["combinator"] = value;
    setWhere({..._where});
  },
  addRule = (rule) => {
    let _where = where;
    eval('_'+indexString+".rules").push(rule);
    setWhere({..._where});
  },
  handleRuleChange = (e,index,prop) => {
    let _where = where;
    eval('_'+indexString+".rules")[index][prop] = e.target.value;
    setWhere({..._where});
  },
  removeRule = (index) => {
    let _where = where;
    eval('_'+indexString+".rules").splice(index, 1);
    setWhere({..._where});
  },
  removeRuleGroup = (index) => {
    let _where = where,
    _indexString = indexString.split('.');
    _indexString.pop();
    _indexString = _indexString.join('.');
    eval('_'+_indexString+".rules").splice(index, 1);
    setWhere({..._where});
  };

  return (
    <div className="border border-secondary rounded p-1">
      <div className="btn-group btn-group-toggle mb-1" data-toggle="buttons">
        <label className={`btn btn-sm btn-light ${eval(indexString).combinator== 'and' && 'active'}`}>
          <input type="radio" name="options" id="option1" onClick={() => changeCombinator("and")}/> And
        </label>
        <label className={`btn btn-sm btn-light ${eval(indexString).combinator == 'or' && 'active'}`}>
          <input type="radio" name="options" id="option2" onClick={() => changeCombinator("or")}/> Or
        </label>
        <div className={`btn-group ${toggleFilterAction && 'show'}`} role="group">
        <button type="button" className="btn btn-sm btn-info dropdown-toggle" onClick={e => setToggleFilterAction(!toggleFilterAction)} aria-haspopup="true" aria-expanded="false">
          Add
        </button>
        <div className={`dropdown-menu ${toggleFilterAction && 'show'}`} aria-labelledby="btnGroupDrop1">
          <button type="button" className="dropdown-item btn btn-sm btn-link mb-1" onClick={e => {addRule({"field": "id","operator": "like","value": ""}); setToggleFilterAction(!toggleFilterAction);}}>Add Filter</button>
          <button type="button" className="dropdown-item btn btn-sm btn-link mb-1" onClick={e => {addRule({combinator: "and",rules: []}); setToggleFilterAction(!toggleFilterAction);}}>Add Group</button>
        </div>
      </div>
      <button className={`btn btn-sm btn-outline-danger ${typeof index == 'undefined' && 'd-none'}`} type="button" onClick={e =>{removeRuleGroup(index)}}>Remove Group</button>
      </div>
      
      {eval(indexString).rules.map((filter,index) => (
        (filter.hasOwnProperty('rules')
            ? <div className="mb-1 p-1" key={index}> <RulesGroup index={index} indexString={indexString+".rules["+index+"]"} filterFields={filterFields}/> </div>
            : <div className="input-group mb-1" key={index}>
              <select value={filter.field}
                className="form-control form-control-sm"
                onChange={e =>{handleRuleChange(e,index,'field')}}>
                  {Object.keys(filterFields).map((value,index) => (<option key={index} value={value}>{filterFields[value]}</option>))}
              </select>
              <select value={filter.operator}
                className="form-control form-control-sm"
                onChange={e =>{handleRuleChange(e,index,'operator')}}>
                  <option value="like">Like</option>
                  <option value="eq">Equals</option>
                  <option value="ne">Not Equals</option>
                  <option value="gt">Greater Than</option>
                  <option value="lt">Less Than</option>
              </select>
              <input type="text" className="form-control form-control-sm" onChange={e =>{handleRuleChange(e,index,'value')}} placeholder="value"/>
              <div className="input-group-append">
                <button className="btn btn-sm btn-outline-danger" type="button" onClick={e =>{removeRule(index)}}>Remove</button>
              </div>
            </div>
        )        
      ))}
    </div>
  );
};

export default RulesGroup;