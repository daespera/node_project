import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useToast } from "./Toast/ToastProvider";

import FilterBuilder from "./Utility/Filter/FilterBuilder";



const Users = () => {
  const { addToast } = useToast(),
    [where,setWhere] = useState({combinator: "and",rules: []}),
    [data, setData] = useState({users: []}),
    [size, setSize] = useState(5),
    [page, setPage] = useState(1),
    [action, setAction] = useState(''),
    [user, setUser] = useState({
      first_name: "",
      last_name: "",
      email: "",
      type: "",
      password: ""
    }),
    [filters,setFilters] = useState([]),
    [textBoxError, setTextBoxError] = useState([]),
    filterFields = {id:"ID",
      last_name:"Last Name",
      first_name:"First Name",
      email:"Email",
      type:"Type"},
    [lastListDate, setLastListDate] = useState('');

  //_where = {...where,...test};
  /* let rule = [{
        "field": "firstName",
        "operator": "null",
        "value": ""
      }];
  setWhere({rules: [...where.rules,rule]});
  rule = [{combinator: "and",rules: []}];
  ///_where.rules = [..._where.rules,...rule];
  console.log(where); */


  let handleChange = e => {
    const value = e.target.value;
    setUser({
      ...user,
      [e.target.name]: value
    });
  },

  Save = async e => {
    var _response;
    var statusCode;
    setTextBoxError([]);
    let _method = action == 'add' ? 'post' : 'put';
    let endpoint = action == 'add' ? 'user' : 'user/'+user.id;
    try {
      const response = await axios({
        method: _method,
        url: '/rest_proxy',
        headers: { 
          'Content-Type': 'application/json',
          'CSRF-Token': csrf_token
        },
        data: {_endpoint: endpoint,...user}
      });
      statusCode = response.status;
      _response = response.data;
      addToast(_response.message);
      if(action == 'edit')
        setData({
          users: data.users.map(el => (el.id === response.data.data.id ? _response.data : el))
        });
      else
        setData({
          users:[...data.users,_response.data]
        });
      Cancel();
      setPage(1);
    } catch (error) {
      statusCode = error.response.status;
      _response = error.response.data;
    }
    if (statusCode > 299) {
      let error = {
        toast_errors: [],
        textbox_error: []
      };
      for(var attributename in _response.details[0]) {
        error.textbox_error.push(attributename);
        error.toast_errors.push(_response.details[0][attributename]);
      }
      setTextBoxError(error.textbox_error);
      if(_response.message == "Invalid credentials."){
        addToast('user is not logged in or session has already expired','danger','unauthenticated');
        document.cookie = "access_token=" + '';
      }else{
        addToast(error.toast_errors,'danger',_response.message);
      }
    }
  },

  Fetch = async (scrolling = false) => {
    console.log('filter');
    console.log(filters.length);
    var statusCode;
    let params = {
      _endpoint: "user",
      size: size,
      page: page
    },
    filter = {filters: [...filters]};
    params = filters.length ? {...params, filter} : params;
    let _where = {where: where};

    if(scrolling){
      console.log(scrolling);
      _where = {where: {combinator: "and",rules: [{"field": "`created_at`","operator": "lt","value": lastListDate}]}};
      _where.where.rules.push(where);
    }
    if(_where.where.rules.length)
      params = {...params, ..._where};
    try {
      const response = await axios({
        method: 'get',
        url: '/rest_proxy',
        headers: { 
          'Content-Type': 'application/json',
        },
        params: params
      }),
      _data = [...data.users,...response.data.data];
      statusCode = response.status;
      console.log(scrolling ? {users: _data} : {users: [...response.data.data]});
      setData(scrolling ? {users: _data} : {users: [...response.data.data]});
      
      setLastListDate(response.data.data.length ? response.data.data[response.data.data.length-1].created_at : 'none');
      //console.log(response.data.data[response.data.data.length-1].created_at);
      if(response.data.message == "no data")
        addToast(response.data.message);
    } catch (error) {
      if(error.response?.data.message == "Invalid credentials."){
        addToast('user is not logged in or session has already expired','danger','unauthenticated');
        document.cookie = "access_token=" + '';
      }
      //statusCode = error.response.status;
      //data = error.response.data;
    }
  },

  Cancel = e => {
    setAction('');
    setUser({
      first_name: "",
      last_name: "",
      email: "",
      type: "",
      password: ""
    });
    setTextBoxError([]);
  },

  Select = (item) => (event) => {
    setAction('edit');
    setUser(item);
    setTextBoxError([]);
  },

  Add = e => {
    setAction('add');
    setUser({
      first_name: "",
      last_name: "",
      email: "",
      type: "",
      password: ""
    });
    setTextBoxError([]);
  };

  useEffect(() => {Fetch()}, [page]);

  return (
    <>
      <div className={`card mb-2 ${action == '' && 'd-none'}`} border="secondary">
        <div className="card-header"><b>{action == 'add' ? 'Create' : 'Update'}</b></div>
        <div className="card-body">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">First name</label>
            <div className="col-sm-10">
              <input 
                type="text"
                value={user.first_name}
                onChange={handleChange}
                name="first_name"
                className={`form-control form-control-sm ${textBoxError.includes('first_name') && 'is-invalid'}`}
                placeholder="First Name" 
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">Last name</label>
            <div className="col-sm-10">
              <input 
              type="text"
              value={user.last_name}
              onChange={handleChange}
              name="last_name"
              className={`form-control form-control-sm ${textBoxError.includes('last_name') && 'is-invalid'}`}
              placeholder="Last Name" 
            />
            </div>            
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">Email address</label>
            <div className="col-sm-10">
              <input 
                type="text"
                value={user.email}
                onChange={handleChange}
                name="email"
                className={`form-control form-control-sm ${textBoxError.includes('email') && 'is-invalid'}`}
                placeholder="Email" 
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">Type</label>
            <div className="col-sm-10">
              <select value={user.type}
                name="type"
                className={`form-control form-control-sm ${textBoxError.includes('type') && 'is-invalid'}`}
                onChange={handleChange}>
                <option value="">Select one</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_USER">Super User</option>
                <option value="USER">User</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">Password</label>
            <div className="col-sm-10">
              <input
                type="password"
                value={user.password}
                onChange={handleChange}
                name="password"
                className={`form-control form-control-sm ${textBoxError.includes('password') && 'is-invalid'}`}
                placeholder="Password" />
            </div>
          </div>
            <button type="button" className="btn btn-sm btn-success  mr-1" onClick={Save}>{action == 'add' ? 'Create' : 'Update'}</button>
          <button type="button" className="btn btn-sm btn-danger" onClick={Cancel}>Cancel</button>
        </div>
      </div>
      <div className="card" border="secondary">
        <div className="card-header d-flex justify-content-between align-items-center">
          <b>Users</b>
          {action != 'add' &&
            <button type="button" className="btn btn-sm btn-primary" onClick={Add}>Add</button>
          }
        </div>
        <div className="card-body">
          <FilterBuilder filterFields={filterFields} where={where} setWhere={setWhere}/>
          <button type="button"  className="btn btn-sm btn-link" onClick={e => Fetch(false)}>reload</button>
          <div className="table">
            <div className="row header blue">
              <div className="cell col-sm">
                ID
              </div>
              <div className="cell col-sm">
                Last Name
              </div>
              <div className="cell col-sm">
                First Name
              </div>
              <div className="cell col-sm">
                Email
              </div>
              <div className="cell col-sm">
                Type
              </div>
            </div>
            { data.users.length ?
              data.users.map((user,key) => (
              <div key={key} className="row">
                <div className="cell col-sm" data-title="ID">
                  <button type="button" className="btn btn-sm btn-link" onClick={Select(user)}>{user.id}</button>
                </div>
                <div className="cell col-sm" data-title="Last Name">
                  {user.last_name}
                </div>
                <div className="cell col-sm" data-title="First Name">
                  {user.first_name}
                </div>
                <div className="cell col-sm" data-title="Email">
                  {user.email}
                </div>
                <div className="cell col-sm" data-title="Email">
                  {user.type}
                </div>
              </div>
            )):<div className="row"><div className="cell col-sm"><center>nodata</center></div></div>}
          </div>
          <div className="text-center">
            <button type="button" className={`btn btn-link ${lastListDate == 'none' && 'd-none'}`} onClick={e => Fetch(true)}>More</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;