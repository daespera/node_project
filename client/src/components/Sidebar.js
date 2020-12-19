import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    return (
      <nav id="sidebar" className={`"sidebar" ${this.state.isOpen ? "active" : ""}` }>
        <p className="ml-3">Menu</p>
        <div className="custom-menu">
           <button
              onClick={() => this.setState({ isOpen: !this.state.isOpen })}
              aria-controls="sidebar"
              aria-expanded={this.state.isOpen}
              id="sidebarCollapse" 
              className="btn btn-primary">
              {this.state.isOpen ? ">" : "<"}
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
}