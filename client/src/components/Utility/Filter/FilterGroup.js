import React, {useContext } from "react";

import RulesGroup from './RulesGroup';


const FilterGroup = ({ filterFields }) => {
  return (<div>
        <RulesGroup indexString="where" filterFields={filterFields}/>
    </div>);
};

export default FilterGroup;