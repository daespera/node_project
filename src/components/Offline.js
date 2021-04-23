import React from "react";

const Offline = () => {
  return (
    <>
      <div className="card" border="secondary">
        <div className="card-header card-header-custom d-flex justify-content-between align-items-center">
          <b>Offline</b>
        </div>
        <div className="card-body">
          Sorry you are offline!
        </div>
      </div>
    </>
  );
};
export default Offline;