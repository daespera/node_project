import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useToast, setCallBack } from "./Utility/Toast/ToastProvider";
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
      password: "",
      key: ""
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

  handleAttributeToggle = async name => {
    console.log(name);
    let _user_attributes = user.user_attributes;
    console.log(user.user_attributes[name]);
    _user_attributes[name] = user.user_attributes[name] == 'false' || user.user_attributes[name] == undefined ? 'true' : 'false';
    console.log(_user_attributes);
    try {
      const params = {
        _endpoint: "user/"+user.id+"/user_attribute",
        attribute: name,
        value: _user_attributes[name]
      },
      mapping = {
        ['ACL_USER_ADD']: "ACL user add",
        ['ACL_USER_EDIT']: "ACL user edit",
        ['ACL_USER_DELETE']: "ACL user delete",
        ['ACL_USER_RETRIEVE']: "ACL user retrieve"
      },
      response = await axios({
        method: 'put',
        url: '/rest_proxy',
        headers: { 
          'Content-Type': 'application/json',
          'CSRF-Token': csrf_token
        },
        data: params
      });
      addToast(mapping[name]+" "+response.data.message);
    } catch (error) {
      if(error.response?.data.message == "Invalid credentials."){
        addToast('user is not logged in or session has already expired','danger','unauthenticated');
        document.cookie = "access_token=" + '';
         setUser({
          ...user,
          user_attributes: _user_attributes
        });
      }
    }
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
          users:[_response.data,...data.users]
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
    var statusCode;
    let params = {
      _endpoint: "user",
      include: "user_attributes",
      size: size,
      page: page
    },
    filter = {filters: [...filters]};
    params = filters.length ? {...params, filter} : params;
    let _where = {where: where};

    if(scrolling){
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
      console.log ("user response");
      console.log(response);
      statusCode = response.status;
      setData(scrolling ? {users: _data} : {users: [...response.data.data]});
      
      setLastListDate(response.data.data.length ? response.data.data[response.data.data.length-1].created_at : 'none');
      if(response.data.message == "no data")
        addToast(response.data.message);
    } catch (error) {
      if(error.response?.data.message == "Invalid credentials."){
        addToast('user is not logged in or session has already expired','danger','unauthenticated');
        document.cookie = "access_token=" + '';
      }else{
        console.log("here");
        console.log(error.message);
        let msg = error.message === 'Network Error' ? "Connection Lost" : error.response?.data.message;
        addToast(msg,'danger',error.response?.data.message);
      }
    }
  },

  Cancel = e => {
    setAction('');
    setUser({
      first_name: "",
      last_name: "",
      email: "",
      type: "",
      password: "",
      key: ""
    });
    setTextBoxError([]);
  },

  Select = (item,key) => (event) => {
    setAction('edit');
    item.key = key;
    console.log(item);
    setUser(item);
    setTextBoxError([]);
  },

  DeleteRequest = (userID, userKey) => {
    addToast('delete user?','confirm','Delete',response => response && DeleteConfirm(response,userID,userKey));
  },

  DeleteConfirm = async (confirm, userID, userKey) => {
    let params = {
      _endpoint: "user/"+userID
    };
    try {
      const response = await axios({
        method: 'delete',
        url: '/rest_proxy',
        headers: { 
          'Content-Type': 'application/json',
          'CSRF-Token': csrf_token
        },
        params: params
      }),
      _data = data;
      _data.users.splice(userKey, 1);
      setData({..._data});
      Cancel()
    } catch (error) {
      if(error.response?.data.message == "Invalid credentials."){
        addToast('user is not logged in or session has already expired','danger','unauthenticated');
        document.cookie = "access_token=" + '';
      }else{
        addToast(error.response?.data.message,'danger',error.response?.data.message);
      }
    }
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
        <div className="card-header card-header-custom">
          <ul className="nav nav-tabs card-header-tabs card-header-tabs-custom">
            <li className="nav-item">
              <a className="nav-link disabled" href="#"><b>{action == 'add' ? 'Create' : 'Update'}</b></a>
            </li>
            <li className="nav-item">
              <button type="button" className={`btn btn-sm btn-link nav-link ${action == 'edit' && 'active'} ${action == 'add' && 'd-none'}`} onClick={e => setAction('edit')}>Info</button>
            </li>
            <li className="nav-item">
              <button type="button" className={`btn btn-sm btn-link nav-link ${action == 'edit_attributes' && 'active'} ${action == 'add' && 'd-none'}`} onClick={e => setAction('edit_attributes')}>Attributes</button>
            </li>
          </ul>
        </div>
        <div className={`card-body ${(action == 'edit_attributes' ) && 'd-none'}`}>
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
          <div className={`form-group row ${action != 'add' && 'd-none'}`}>
            <label className="col-sm-2 col-form-label col-form-label-sm">Password</label>
            <div className="col-sm-10">
              <input
                type="password"
                value={action == 'add' && user.password}
                onChange={handleChange}
                name="password"
                className={`form-control form-control-sm ${textBoxError.includes('password') && 'is-invalid'}`}
                placeholder="Password" />
            </div>
          </div>
          <button type="button" className="btn btn-sm btn-success mr-1" onClick={Save}>{action == 'add' ? 'Create' : 'Update'}</button>
          <button type="button" className={`btn btn-sm btn-danger mr-1 ${action == 'add' && 'd-none'}`} onClick={e => DeleteRequest(user.id,user.key)}>Delete</button>
          <button type="button" className="btn btn-sm btn-warning" onClick={Cancel}>Cancel</button>
        </div>
        <div className={`card-body ${action != 'edit_attributes' && 'd-none'}`}>
          <div className="card w-50">
            <div className="card-body">
              <h5 className="card-title">ACL - user</h5>
              <div className="custom-control custom-switch">
                <input type="checkbox" className="custom-control-input" defaultChecked={user.user_attributes && user.user_attributes.ACL_USER_ADD == 'true'}/>
                <label className="custom-control-label" onClick={() => handleAttributeToggle("ACL_USER_ADD")} >Add</label>
              </div>
              <div className="custom-control custom-switch">
                <input type="checkbox" className="custom-control-input" defaultChecked={user.user_attributes && user.user_attributes.ACL_USER_RETRIEVE == 'true'}/>
                <label className="custom-control-label" onClick={() => handleAttributeToggle("ACL_USER_RETRIEVE")} >Retrieve</label>
              </div>
              <div className="custom-control custom-switch">
                <input type="checkbox" className="custom-control-input" defaultChecked={user.user_attributes && user.user_attributes.ACL_USER_EDIT == 'true'}/>
                <label className="custom-control-label" onClick={() => handleAttributeToggle("ACL_USER_EDIT")} >Edit</label>
              </div>
              <div className="custom-control custom-switch">
                <input type="checkbox" className="custom-control-input" defaultChecked={user.user_attributes && user.user_attributes.ACL_USER_DELETE == 'true'}/>
                <label className="custom-control-label" onClick={() => handleAttributeToggle("ACL_USER_DELETE")} >Delete</label>
              </div>
            </div>
          </div>
          <br/>
          <button type="button" className="btn btn-sm btn-warning" onClick={Cancel}>Cancel</button>
        </div>
      </div>
      <div className="card" border="secondary">
        <div className="card-header card-header-custom d-flex justify-content-between align-items-center">
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
                  <button type="button" className="btn btn-sm btn-link" onClick={Select(user,key)}>{user.id}</button>
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