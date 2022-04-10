/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
var request = require('request');
const token = "<TOKEN_GOES_HERE>"
const caller_repo = "actions-callers"
 
module.exports = (app) => {
  app.on("issues.opened", async (context) => {
    const dispatch_event = "call-01"
    var options = {
      'method': 'POST',
      'url': 'https://api.github.com/repos/'+context.payload.repository.owner.login+'/'+caller_repo+'/dispatches',
      'headers': {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'token '+token,
        'Content-Type': 'application/json',
        'user-agent': 'node.js'
      },
      body: JSON.stringify({"event_type":dispatch_event})
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });
    // END
  });

  app.on("pull_request.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.octokit.issues.createComment(issueComment);
  });
};
