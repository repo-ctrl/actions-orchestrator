/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
// var request = require('request');
 
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    //return context.octokit.issues.createComment(issueComment);

    return context.octokit.rest.repos.createDispatchEvent({
      owner: context.payload.repository.owner.login,
      repo: "actions-callers",
      event_type: "call-01",
    });

    // //START
    // var caller_repo ="actions-callers"
    // var token = "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"
    // var options = {
    //   'method': 'POST',
    //   'url': 'https://api.github.com/repos/'+context.payload.repository.owner.login+'/'+caller_repo+'/dispatches',
    //   'headers': {
    //     'Accept': 'application/vnd.github.v3+json',
    //     'Authorization': 'token '+token,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({"event_type":"call-01"})
    // };
    // request(options, function (error, response) {
    //   if (error) throw new Error(error);
    //   console.log(response.body);
    // });
    // // END
  });

  app.on("pull_request.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.octokit.issues.createComment(issueComment);
  });
  

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
