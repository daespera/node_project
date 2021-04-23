import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useToast } from "./Utility/Toast/ToastProvider";

const Sidebar = () => {
  const { addToast } = useToast(),
  history = useHistory(),
  location = useLocation(),
  [open, isOpen] = useState(false),
  logOut =  e => {
    e.preventDefault(); 
    addToast('do you wish to logout?','confirm','Log-out', response => response && history.push('/login')); 
  };

  console.log(location.pathname);

  return (
    <nav id="sidebar" className={`"sidebar" ${open ? "active" : ""}` }>
      <br/>
      <div className="header">
        <p className="ml-3">Menu</p>
      </div>
      <div className="custom-menu">
         <button
            onClick={() => isOpen( !open )}
            type="button"
            className="btn btn-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
        </button>

      </div>
      <ul className="list-unstyled components mb-5">
        <li className={`${location.pathname == '/' ? "active" : ""}` }>
          <Link to={'/'} className="nav-link">
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
                <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
              </svg>
            </span>
            <span style={{verticalAlign: 'middle',  display: 'inline-block'}}>&nbsp;Home</span>
          </Link>
        </li>
        <li className={`${location.pathname == '/users' ? "active" : ""}` }>
          <Link to={'/users'} className="nav-link">
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
            </span>
            <span style={{verticalAlign: 'middle',  display: 'inline-block'}}>&nbsp;Users</span>
          </Link>
        </li>
        <li className={`${location.pathname == '/contents' ? "active" : ""}` }>
          <Link to={'/contents'} className="nav-link">
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
            </span>
            <span style={{verticalAlign: 'middle',  display: 'inline-block'}}>&nbsp;Contents</span>
          </Link>
        </li>
        <li>
          <Link to={'/login'} onClick={logOut} className="nav-link"> 
            <span className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-power" viewBox="0 0 16 16">
                <path d="M7.5 1v7h1V1h-1z"/>
                <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
              </svg>
            </span>
            <span style={{verticalAlign: 'middle',  display: 'inline-block'}}>&nbsp;Logout</span>
          </Link>
        </li>
      </ul>

    </nav>
  );
}
export default Sidebar;