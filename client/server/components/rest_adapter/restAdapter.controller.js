const  axios = require("axios"),
  { API_BASE_URL } = require('../../infrastructure/config');

module.exports.proxy = async (req, res) => {
  const url = req.method == 'GET' ? req.query._endpoint : req.body._endpoint;
  delete req.body._endpoint;
  delete req.query._endpoint;
  let params = req.method == 'GET' ? req.query : req.body;
  var status;
  var data;
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
    console.log({
      method: req.method,
      url: API_BASE_URL + url,
      headers: {
        ..._headers,
        'Content-Type': 'application/json'
      },
      data: params
    });
    const _params = req.method == 'GET' ? {params: params} : {data: params};
    const payload = {
      method: req.method,
      url: API_BASE_URL + url,
      headers: {
        ..._headers,
        'Content-Type': 'application/json'
      }
    };
    const response = await axios({...payload,..._params});
    status = response.status;
    data = response.data;
  } catch (error) {
    console.log(error);
    status = error.response.status;
    data = error.response.data;
  }
  return res.status(status).send(data);
};