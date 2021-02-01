import React, {useContext } from "react";

import RulesGroup from './RulesGroup';


const FilterGroup = ({ filterFields }) => {
  return (<div style={{margin:"0px -15px"}}>
        <RulesGroup indexString="where" filterFields={filterFields}/>
    </div>);
};

export default FilterGroup;