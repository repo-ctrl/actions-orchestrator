/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
var axios = require('axios');
const token = ""
const caller_repo = "actions-callers"

function doRepoDispatch(context,caller_repo,event_type) {
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
    //console.log(JSON.stringify(response.data));
    return response;
  }).catch(function (error) {
    //console.log(error);
    return error;
  });
}
 
function createCheckRun(context,check_name) {
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
    //console.log(JSON.stringify(response.data));
    return response;
  }).catch(function (error) {
    //console.log(error);
    return error;
  });
}

module.exports = (app) => {

  app.on("issues.edited", async (context) => {
    fx_response=doRepoDispatch(context,caller_repo,"call-01");
    console.log(fx_response.status)
  });

  app.on("pull_request.edited", async (context) => {
    fx_response=createCheckRun(context,caller_repo);
    console.log(fx_response.status)
  });
};
