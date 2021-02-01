import React, { useState, useEffect } from "react";
import axios from 'axios';

import { useToast } from "./Utility/Toast/ToastProvider";

const Login = props => {
  const { addToast } = useToast();
  const [credentials, setCredentials] = useState({
    user: "",
    password: ""
  })

  let handleChange = (e) => {
    const value = e.target.value;
    setCredentials({
      ...credentials,
      [e.target.name]: value
    });
  }

  useEffect(() => {
    document.cookie = "access_token=" + '';
    props.toogleNavigation();
  }, []);

  let logIn = async () => {
    var data;
    var statusCode;
    try {
      const response = await axios({
        method: 'post',
        url: '/rest_proxy',
        headers: { 
          'Content-Type': 'application/json',
          'CSRF-Token': csrf_token
        },
        data: {_endpoint: "oauth/token",...credentials}
      });
      statusCode = response.status;
      data = response.data;
      document.cookie = "access_token=" + data.accessToken;
      props.toogleNavigation();
      props.history.push('/');
    } catch (error) {
      statusCode = error.response.status;
      data = error.response.data;
    }
    if (statusCode != 200) {
      for(var attributename in data.details[0]) {
        addToast(data.details[0][attributename],'danger',data.message);
      }
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="card w-50" border="secondary">
        <div className="card-header">Sign In</div>
        <div className="card-body">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">Email address</label>
            <div className="col-sm-10">
              <input 
                type="user"
                name="user"
                value={credentials.user}
                onChange={handleChange}
                className="form-control form-control-sm" 
                placeholder="Email" 
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">Password</label>
            <div className="col-sm-10">
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="form-control form-control-sm"
                placeholder="Password" />
            </div>
          </div>
          <div className="form-group">
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="customCheck1" />
              <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
            </div>
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick={logIn}>Submit</button>
          <p className="forgot-password text-right">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </div>
    </div>  
  );
}

export default Login;