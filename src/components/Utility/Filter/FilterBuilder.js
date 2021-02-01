import React, { useState, createContext, useContext } from "react";
import FilterGroup from './FilterGroup';

export const FilterContext = createContext();

const FilterBuilder = ({filterFields, where, setWhere}) => {
	const getFilters = e => {return where};
	return (<FilterContext.Provider value={{ where, setWhere, filterFields }}>
		<FilterGroup filterFields={filterFields} where={where}/>
	</FilterContext.Provider>);
},

useFilter = () => {
  const filterHelpers = useContext(FilterContext);

  return filterHelpers;
};
export { useFilter };
export default FilterBuilder;