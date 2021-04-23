import React, { useEffect, useState }  from "react";
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.bubble.css';
import ImageResize from 'quill-image-resize';
import ImageUploader from "quill-image-uploader";
import { useToast, setCallBack } from "./Utility/Toast/ToastProvider";
import FilterBuilder from "./Utility/Filter/FilterBuilder";
import axios from 'axios';

const Contents = () => {
  const handleChange = e => {
    const value = e.target.value;
    setContent({
      ...content,
      [e.target.name]: value
    });
    if (e.target.name === 'title' || e.target.name === 'slug'){
      setSlug(value.toLowerCase()
        .replace(/-+/g,' ')
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
      );
    }
  },
  imageHandler = ({ val, componentProps }) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = () => {
    
      const file = input.files[0];
      console.log(file); // works well
      
      // problems : can't call ref, props, function... etc
      console.log("ref : ", this.reactQuillRef, this.quillRef); // undefine
      
      // this.insertImg(); // not work (insertImg is not a function)

      console.log(this.props); // undefine
      
    };
  },
  theme = 'bubble',
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],

      [{ list: 'ordered'}, { list: 'bullet' }],
      [{ indent: '-1'}, { indent: '+1' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image'],
      [{ color: [] }, { background: [] }],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
    imageResize: {},
    imageUploader: {
      upload: async file => {
        const bodyFormData = new FormData();
        bodyFormData.append("image", file);
        const response = await axios({
          method: "post",
          url:
            "/upload",
          data: bodyFormData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        return response.data.url;
      }
    }
  },
  placeholder = 'write your content here.....',
  formats = [
    'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'indent',
    'size', 'header',
    'link', 'image', 'video',
    'color', 'background',
    'clean',
  ],
  { addToast } = useToast(),
  [where,setWhere] = useState({combinator: "and",rules: []}),
  [data, setData] = useState({contents: []}),
  [size, setSize] = useState(5),
  [page, setPage] = useState(1),
  [lastListDate, setLastListDate] = useState(''),
  [action, setAction] = useState(''),
  [listVisibility, setListVisibility] = useState(true),
  filterFields = {
    slug:"Slug",
    type:"Type",
    title:"Title",
    status:"Status",
  },
  [filters,setFilters] = useState([]),
  [textBoxError, setTextBoxError] = useState([]),
  [content, setContent] = useState({
    type: "",
    title: "",
    slug: "",
    content: "",
    status: ""
  }),
  [slug, setSlug] = useState(''),
  counterRef = React.useRef(),
  { quill, quillRef, Quill } = useQuill({ theme, modules, formats, placeholder }),
  Save = async e => {
    let _response,
    statusCode,
    _method = action == 'add' ? 'post' : 'put',
    endpoint = action == 'add' ? 'content' : 'content/'+content.id,
    _content = {
      ...content,
      content: quill.root?.innerHTML,
      slug: slug
    },
    origDateCreated = _content.created_at;

    delete _content.key;
    delete _content.created_at;
    delete _content.deleted_at;
    delete _content.updated_at;
    setTextBoxError([]);
    try {
      const response = await axios({
        method: _method,
        url: '/rest_proxy',
        headers: { 
          'Content-Type': 'application/json',
          'CSRF-Token': csrf_token
        },
        data: {_endpoint: endpoint,..._content}
      });
      statusCode = response.status;
      _response = response.data;
      addToast(_response.message);
      _content.created_at = origDateCreated
      if(action == 'edit')
        setData({
          contents: data.contents.map(el => (el.id === _content.id ? _content : el))
        });
      else
        setData({
          contents:[...data.contents,_response.data]
        });
      
      setPage(1);
      Cancel();
    } catch (error) {
      statusCode = error.response?.status;
      _response = error.response?.data;
    }
    if (statusCode > 299) {
      let error = {
        toast_errors: [],
        textbox_error: []
      };
      if(_response.hasOwnProperty('details')){
        for(var attributename in _response.details[0]) {
          error.textbox_error.push(attributename);
          error.toast_errors.push(_response.details[0][attributename]);
        }
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
    let statusCode,
    _response,
    params = {
      _endpoint: "content",
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
      _data = [...data.contents,...response.data.data];
      console.log ("user response");
      console.log(response);
      statusCode = response.status;
      setData(scrolling ? {contents: _data} : {contents: [...response.data.data]});
      
      setLastListDate(response.data.data.length ? response.data.data[response.data.data.length-1].created_at : 'none');
      if(response.data.message == "no data")
        addToast(response.data.message);
    } catch (error) {
      statusCode = error.response?.status;
      _response = error.response?.data;
    }
    if (statusCode > 299) {
      let error = {
        toast_errors: [],
        textbox_error: []
      };
      if(_response.hasOwnProperty('details')){
        for(var attributename in _response.details[0]) {
          error.textbox_error.push(attributename);
          error.toast_errors.push(_response.details[0][attributename]);
        }
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

  clear = action => {
    setAction(action);
    setContent({
      type: "",
      title: "",
      slug: "",
      content: "",
      status: ""
    });
    setSlug('');
    setTextBoxError([]);
  },

  Add = e => {
    clear('add');
    setTextBoxError([]);
    quill.clipboard.dangerouslyPasteHTML('<p>double click to activate toolbar...</p>');
  },

  Cancel = e => {
    clear('');
    setListVisibility(true);
  },

  Select = (item,key) => (event) => {
    setAction('edit');
    item.key = key;
    setContent(item);
    setSlug(item.slug);
    quill.clipboard.dangerouslyPasteHTML(item.content);
    setTextBoxError([]);
  };

  if (Quill && !quill) {
    Quill.register('modules/imageResize',ImageResize);
    Quill.register("modules/imageUploader", ImageUploader);
  }

  useEffect(() => {
    Fetch();
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML('<p>double click to activate toolbar...</p>');
      /*quill.on('text-change', () => {
        console.log(quill.root.innerHTML);
      });*/
    }
  }, [quill,page]);

  return (
    <>
      <div className={`card mb-2 ${action == '' && 'd-none'}`} border="secondary">
        <div className="card-header card-header-custom d-flex justify-content-between align-items-center">
          <b>{action == 'add' ? 'Create' : 'Update'}</b>
        </div>
        <div className="card-body">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">Type</label>
            <div className="col-sm-10">
              <select value={content.type}
                name="type"
                className={`form-control form-control-sm ${textBoxError.includes('type') && 'is-invalid'}`}
                onChange={handleChange}>
                <option value="">Select one</option>
                <option value="BLOG">Blog</option>
                <option value="CONTENT">Content</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">Status</label>
            <div className="col-sm-10">
              <select value={content.status}
                name="status"
                className={`form-control form-control-sm ${textBoxError.includes('status') && 'is-invalid'}`}
                onChange={handleChange}>
                <option value="DISABLED">Disabled</option>
                <option value="ACTIVE">Active</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">Title</label>
            <div className="col-sm-10">
              <input 
                type="text"
                value={content.title}
                onChange={handleChange}
                name="title"
                className={`form-control form-control-sm ${textBoxError.includes('title') && 'is-invalid'}`}
                placeholder="Title" 
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">Slug</label>
            <div className="col-sm-10">
               <input 
                type="text"
                value={slug}
                onChange={handleChange}
                name="slug"
                className={`form-control form-control-sm ${textBoxError.includes('title') && 'is-invalid'}`}
                placeholder="Slug" 
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label col-form-label-sm">Content</label>
            <div className="col-sm-10">
              <div ref={quillRef} />
            </div>
          </div>
          <button type="button" className="btn btn-sm btn-success mr-1" onClick={Save}>{action == 'add' ? 'Create' : 'Update'}</button>
          <button type="button" className="btn btn-sm btn-warning" onClick={Cancel}>Cancel</button>
        </div>
      </div>
      <div className="card" border="secondary">
        <div className="card-header card-header-custom d-flex justify-content-between align-items-center">
          <b>Contents</b>
          <div>
            {action != 'add' &&
              <button type="button" className="btn btn-sm btn-primary" onClick={Add}>Add</button>
            }
            &nbsp;
            {action != '' &&
              <button type="button" className="btn btn-sm btn-info" onClick={() => setListVisibility(!listVisibility)}>{listVisibility ? 'Hide' : 'Show'}</button>
            }
          </div>
        </div>
        <div className={`card-body ${listVisibility == '' && 'd-none'}`}>
          <FilterBuilder filterFields={filterFields} where={where} setWhere={setWhere}/>
          <button type="button"  className="btn btn-sm btn-link" onClick={e => Fetch(false)}>reload</button>
          <div className="table">
            <div className="row header blue">
              <div className="cell col-sm">
                ID
              </div>
              <div className="cell col-sm">
                Type
              </div>
              <div className="cell col-sm">
                Status
              </div>
              <div className="cell col-sm">
                Title
              </div>
              <div className="cell col-sm">
                Date Created
              </div>
            </div>
            { data.contents.length ?
              data.contents.map((content,key) => (
              <div key={key} className="row">
                <div className="cell col-sm" data-title="ID">
                  <button type="button" className="btn btn-sm btn-link" onClick={Select(content,key)}>{content.slug}</button>
                </div>
                <div className="cell col-sm" data-title="Type">
                  {content.type}
                </div>
                <div className="cell col-sm" data-title="Status">
                  {content.status}
                </div>
                <div className="cell col-sm" data-title="Title">
                  {content.title}
                </div>
                <div className="cell col-sm" data-title="Date Created">
                  {content.created_at}
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
export default Contents;