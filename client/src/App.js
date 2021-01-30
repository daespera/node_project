
import React from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import Users from "./components/Users";
import ToastProvider from "./components/Utility/Toast/ToastProvider";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Moblie first
    this.state = {
      isMobile: true,
      list: [],
      showNavigation: true
    };

    this.previousWidth = -1;
  }

  updateWidth() { 
    const width = window.innerWidth;
    const widthLimit = 576;
    const isMobile = width <= widthLimit;
    const wasMobile = this.previousWidth <= widthLimit;

    this.previousWidth = width;
  }

  /**
   * Add event listener
   */
  componentDidMount() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth.bind(this));
  }
     
  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth.bind(this));
  }
  
  render() {
    return (
      <Router>
        <div className="wrapper d-flex align-items-stretch">
          {this.state.showNavigation && <Sidebar/>}
          <div id="content" className="py-4 px-2 py-md-4.5 pt-5">
            <ToastProvider>
              <Switch>
                <Route
                  exact path='/login'
                  render={ (props) => (
                    <Login toogleNavigation={() => this.setState({showNavigation: !this.state.showNavigation})} {...props} />
                  )}
                /> 
                <PrivateRoute exact path='/users' component={Users} />
              </Switch>
            </ToastProvider>
          </div>
          
        </div>
        
      </Router>
    )
  };
}

