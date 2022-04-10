/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
var axios = require('axios');
const token = ""
const caller_repo = "actions-callers"

function createRepoDispatch(context,caller_repo,event_type,callback) {
  var data = JSON.stringify({"event_type":event_type});
  var config = {
    method: 'post',
    url: 'https://api.github.com/repos/'+context.payload.repository.owner.login+'/'+caller_repo+'/dispatches',
    headers: { 
      'Accept': 'application/vnd.github.v3+json', 
      'Authorization': 'token '+token, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  axios(config).then(function (response) {
    callback(response);
  }).catch(function (error) {
    callback(error);
  });
}
 
function createCheckRun(context,check_name,callback) {
  var data = JSON.stringify({"name":check_name, "head_sha":context.payload.pull_request.head.sha});
  var config = {
    method: 'post',
    url: 'https://api.github.com/repos/'+context.payload.repository.full_name+'/check-runs',
    headers: { 
      'Accept': 'application/vnd.github.v3+json', 
      'Authorization': 'token '+token, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  axios(config).then(function (response) {
    callback(response);
  }).catch(function (error) {
    callback(error)
  });
}

module.exports = (app) => {
  app.on("pull_request.edited", async (context) => {
    createCheckRun(context,"This is a test", function (fx_response){
      if(fx_response.status == 201){
        createRepoDispatch(context,caller_repo,"call-01",function (fx_response){
          if(fx_response.status == 204){
            console.log("Repo Dispatch Successful")
          } else {
            //ERRLOG
            console.log("ERROR: Creating Repo Dispatch failed")
            console.log(fx_response.response.status)
            console.log(fx_response.response.data)
          }
        });
      } else {
        //ERRLOG
        console.log("ERROR: Creating Check Run failed")
        console.log(fx_response.response.status)
        console.log(fx_response.response.data)
      }
    }); 
  });
};
