const request = require('request');

const doRequest = (url) => {
  return new Promise(function (resolve, reject) {
    request(url, {
      json: true
    }, (err, res2, body) => {
      if (err) {
        reject(url + ' not found');
      }
      resolve(body);
    });
  });
};

const deleteObj = (myObject) => {
  return new Promise(function (resolve) {
    delete myObject.password;
    resolve(myObject);
  });
};


module.exports = {
  doRequest,
  deleteObj
};