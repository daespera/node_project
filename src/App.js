
import React from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import Users from "./components/Users";
import Contents from "./components/Contents";
import Offline from "./components/Offline";
import ToastProvider from "./components/Utility/Toast/ToastProvider";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Moblie first
    this.state = {
      showNavigation: true
    };

  }

  render() {
    return (
      <Router>
        <div className="wrapper d-flex align-items-stretch">
          <ToastProvider>
          {this.state.showNavigation && <Sidebar/>}
          <div id="content" className="py-4 px-2 py-md-4.5 pt-5">
              <Switch>
                <Route
                  exact path='/login'
                  render={ (props) => (
                    <Login toogleNavigation={() => this.setState({showNavigation: !this.state.showNavigation})} {...props} />
                  )}
                />
                <Route exact path='/offline' component={Offline} />
                <PrivateRoute exact path='/users' component={Users} />
                <PrivateRoute exact path='/contents' component={Contents} />
              </Switch>
            
          </div>
          </ToastProvider>
        </div>
      </Router>
    )
  };
}

