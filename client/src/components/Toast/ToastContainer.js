import React from "react";
import { createPortal } from "react-dom";

import Toast from "./Toast";

const ToastContainer = ({ toasts }) => {
  return (
    <>
      <div aria-live="polite" aria-atomic="true">
        <div style={{overflowX: 'hidden',position: 'absolute', top: 0, right: 0}}>
          {
            toasts.map((toast, i) =>(
              <Toast key={i} id={toast.id} title={toast.title} backgroundColor={toast.backgroundColor}>
                {typeof toast.content == 'object' ? toast.content.map((item,i) => <li key={i}>{item}</li>) : toast.content}
              </Toast>
            ))
          }
        </div>
      </div>
    </>
   );
};

export default ToastContainer;