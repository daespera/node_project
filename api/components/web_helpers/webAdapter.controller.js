const  axios = require("axios"),
  path = require('path'),
  fs = require("fs"),
  { API_BASE_URL } = require('../../infrastructure/config'),
  handleError = (err, res) => {
    console.log(err);
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

module.exports = {
  proxy: async (req, res) => {
    const url = req.method == 'GET' || req.method == 'DELETE' ? req.query._endpoint : req.body._endpoint;
    delete req.body._endpoint;
    delete req.query._endpoint;
    let params = req.method == 'GET' || req.method == 'DELETE' ? req.query : req.body,
    status,
    data;
    if (url == "oauth/token"){
      let oAuthCreds = {
        grant_type: "password",
        client_id : "4ff93924-3e44-48cd-a0c6-489542e67e73",
        secret : "test"
      };
      params = {
        ...oAuthCreds,
        ...params
      };
    }
    let _headers = url != "oauth/token"
      ? {'Authorization': 'Bearer ' + (req.headers.cookie.match('(^|; )access_token=([^;]*)')||0)[2]}
      : {};
    try {
      const _params = req.method == 'GET' || req.method == 'DELETE' ? {params: params} : {data: params};
      const payload = {
        method: req.method,
        url: API_BASE_URL + url,
        headers: {
          ..._headers,
          'Content-Type': 'application/json'
        }
      };
      console.log(_params);
      const response = await axios({...payload,..._params});
      status = response.status;
      data = response.data;
    } catch (error) {
      console.log(error);
      status = error.response.status;
      data = error.response.data;
    }
    return res.status(status).send(data);
  },

  imageUpload: async (req, res) => {
    const tempPath = req.file.path,
    file = req.jwt.sub+"-"+Date.now(),
    ext = path.extname(req.file.originalname).toLowerCase(),
    targetPath = path.join(__dirname, "../../../build/uploads/"+file+ext),
    extentions = [".png", ".jpg"];

    if (ext.includes(ext)) {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .json({ url: 'http://localhost:3000/uploads/'+file+ext });
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
};