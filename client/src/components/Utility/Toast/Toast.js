import React, { useEffect } from "react";
import { useToast } from "./ToastProvider";

const Toast = ({ children, id, title, backgroundColor, confirm }) => {
  const { removeToast, triggerCallback } = useToast();

  useEffect(() => {
    const timer = confirm == undefined && setTimeout(() => {
      removeToast(id);
    }, 4000);
    return () => {
      confirm == undefined && clearTimeout(timer);
    };
  }, [id, removeToast]);

  return (
    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="toast-header">
        <svg className="bd-placeholder-img rounded mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img">
          <rect width="100%" height="100%" fill={backgroundColor}></rect>
        </svg>
        <strong className="mr-auto">{title}&nbsp;</strong>
        <small className="text-muted" style={{display: "none"}}>just now</small>
        <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onClick={() => removeToast(id)}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="toast-body">
        {children}
        <div className={`${confirm == undefined && 'd-none'}`}>
          <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => triggerCallback(id,true)}>Yes</button>
          <button type="button" className="btn btn-sm btn-danger mr-1" onClick={() => triggerCallback(id,false)}>No</button>
        </div>          
      </div>
    </div>
  );
};

export default Toast;
