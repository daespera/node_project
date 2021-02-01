import React, { useState, useContext, useCallback } from "react";
import ToastContainer from "./ToastContainer";

const ToastContext = React.createContext(null);

let id = 1;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]),
  [confirm, setConfirm] = useState({callback: ""});

  const triggerCallback = useCallback(
    (id, response) => {
      confirm.callback(response);
      removeToast(id)
    }
  );

  const addToast = useCallback(
    (content, type, title, callback) => {
      if(callback != undefined)
        setConfirm({...confirm, callback: callback});
      let data = null;
      switch(type) {
        case 'success':
          data = {
            id: id++,
            title: title,
            content: content,
            backgroundColor: '#5cb85c'
          }
          break;
        case 'danger':
          data = {
            id: id++,
            title: title,
            content: content,
            backgroundColor: '#d9534f'
          }
          break;
        case 'info':
          data = {
            id: id++,
            title: title,
            content: content,
            backgroundColor: '#5bc0de'
          }
          break;
        case 'warning':
          data = {
            id: id++,
            title: title,
            content: content,
            backgroundColor: '#f0ad4e'
          }
          break;

        case 'confirm':
          data = {
            id: id++,
            title: title,
            content: content,
            backgroundColor: '#f0ad4e',
            confirm: 1
          }
          break;

        default:
          data = {
            id: id++,
            title: title,
            content: content,
            backgroundColor: '#5cb85c'
          }
      }
      setToasts(toasts => [
        ...toasts,
        data
      ]);
    },
    [setToasts]
  ),

  removeToast = useCallback(
    id => {
      setToasts(toasts => toasts.filter(t => t.id !== id));
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        triggerCallback
      }}
    >
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const toastHelpers = useContext(ToastContext);

  return toastHelpers;
};

export { ToastContext, useToast };
export default ToastProvider;