import { createContext } from 'react';

const FilterContext = createContext();

export default () => {
  const [where,setWhere] = useState({combinator: "and",rules: []})
  return(
    <SaladContext.Provider value={{ salad, setSalad }}>
      <h1 className={classes.wrapper}>
        <span role="img" aria-label="salad">🥗 </span>
          Build Your Custom Salad!
          <span role="img" aria-label="salad"> 🥗</span>
      </h1>
      <SaladBuilder />
      <SaladSummary />
    </SaladContext.Provider>
  )
};