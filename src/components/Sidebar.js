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
            type="button"
            className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"></path>
            </svg>
        </button>

      </div>
      <ul className="list-unstyled components mb-5">
        <li className="active">
          <Link to={'/'} className="nav-link"> Home </Link>
        </li>
        <li>
            <Link to={'/users'} className="nav-link"> Users </Link>
        </li>
        <li>
            <Link to={'/login'} className="nav-link"> Logout </Link>
        </li>
      </ul>

    </nav>
  );
}
export default Sidebar;