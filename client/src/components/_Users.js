import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useToast } from "./Toast/ToastProvider";

const Users = () => {
  const { addToast } = useToast(),
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
    [textBoxError, setTextBoxError] = useState([]);

  let handleChange = e => {
    const value = e.target.value;
    setUser({
      ...user,
      [e.target.name]: value
    });
  },

  handleFilterChange = (e,index,prop) => {
    const _filters = [...filters];
    _filters[index][prop] = e.target.value;
    setFilters(
      _filters
    );
  },

  removeFilter = (index) => {
    const _filters = [...filters];
    _filters.splice(index, 1);
    setFilters(
      _filters
    );
  },

  Save = async () => {
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

  Fetch = async () => {
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
    try {
      const response = await axios({
        method: 'get',
        url: '/rest_proxy',
        headers: { 
          'Content-Type': 'application/json',
        },
        params: params
      });
      statusCode = response.status;
      setData({users: response.data.data});
      if(response.data.message == "no data")
        addToast(response.data.message);
    } catch (error) {
      if(error.response.data.message == "Invalid credentials."){
        addToast('user is not logged in or session has already expired','danger','unauthenticated');
        document.cookie = "access_token=" + '';
      }
      //statusCode = error.response.status;
      //data = error.response.data;
    }
  },

  Cancel = () => {
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

  Add = () => {
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
          <button type="button" className="btn btn-sm btn-link" onClick={e => setFilters([...filters,{criteria:'id',operator:'like',value:'',conjunction:'and'}])}>add filter</button>
          <button type="button"  className={`btn btn-sm btn-link ${filters.length == 0 && 'd-none'}`} onClick={e =>{setFilters([])} }>clear filters</button>
          {filters.map((filter,index) => (
            <div className="input-group mb-1" key={index}>
              <select value={filter.criteria}
                className="form-control form-control-sm"
                onChange={e =>{handleFilterChange(e,index,'criteria')}}>
                  <option value="id">ID</option>
                  <option value="last_name">Last Name</option>
                  <option value="first_name">First Name</option>
                  <option value="email">Email</option>
                  <option value="type">Type</option>
              </select>
              <select value={filter.operator}
                className="form-control form-control-sm"
                onChange={e =>{handleFilterChange(e,index,'operator')}}>
                  <option value="like">Like</option>
                  <option value="eq">Equals</option>
                  <option value="ne">Not Equals</option>
                  <option value="gt">Greater Than</option>
                  <option value="lt">Less Than</option>
              </select>
              <input type="text" className="form-control form-control-sm" onChange={e =>{handleFilterChange(e,index,'value')}} placeholder="value"/>
              <div className="btn-group btn-group-toggle" data-toggle="buttons">
                <label className={`btn btn-sm btn-secondary ${filter.conjunction == 'and' && 'active'}`}>
                  <input type="radio" name="options" id="option1" value="and" onClick={e =>{handleFilterChange(e,index,'conjunction')}}/> And
                </label>
                <label className={`btn btn-sm btn-secondary ${filter.conjunction == 'or' && 'active'}`}>
                  <input type="radio" name="options" id="option2" value="or" onClick={e =>{handleFilterChange(e,index,'conjunction')}}/> Or
                </label>
              </div>
              <div className="input-group-append">
                <button className="btn btn-sm btn-outline-danger" type="button" onClick={e =>{removeFilter(index)}}>Remove</button>
              </div>
            </div>
          ))}
          <button type="button"  className="btn btn-sm btn-link" onClick={Fetch}>reload</button>
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
            {data.users.map((user) => (
              <div key={user.id} className="row">
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
            ))}
          </div>
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
              <li className={`page-item ${page == 1 && 'disabled'}`}>
                <button type="button" className="page-link" onClick={() => (setPage(page - 1))}>Previous</button>
              </li>
              {page > 2 &&
                <li className="page-item"><button type="button" className="page-link" onClick={() => (setPage(page - 2))}>{page-2}</button></li>
              }
              {page > 1 &&
                <li className="page-item"><button type="button" className="page-link" onClick={() => (setPage(page - 1))}>{page-1}</button></li>
              }
              <li className="page-item disabled"><button type="button" className="page-link">{page}</button></li>
              {data.users.length != 0 &&
                <li className="page-item"><button type="button" className="page-link" onClick={() => (setPage(page + 1))}>{page + 1}</button></li>
              }
              {data.users.length != 0 &&
                <li className="page-item"><button type="button" className="page-link" onClick={() => (setPage(page + 2))}>{page + 2}</button></li>
              }
              <li className={`page-item ${data.users.length == 0 && 'disabled'}`}>
                <button type="button" className="page-link" onClick={() => (setPage(page + 1))}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};
export default Users;