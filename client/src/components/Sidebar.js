import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [open, isOpen] = useState(false);

  return (
    <nav id="sidebar" className={`"sidebar" ${open ? "active" : ""}` }>
      <p className="ml-3">Menu</p>
      <div className="custom-menu">
         <button
            onClick={() => isOpen( !open )}
            aria-controls="sidebar"
            aria-expanded={open}
            id="sidebarCollapse" 
            className="btn btn-primary">
            {open ? ">" : "<"}
        </button>
      </div>
      <ul className="list-unstyled components mb-5">
        <li className="active">
          <Link to={'/'} className="nav-link"> Home </Link>
        </li>
        <li>
            <Link to={'/users'} className="nav-link"> Users </Link>
        </li>
      </ul>

    </nav>
  );
}
export default Sidebar;