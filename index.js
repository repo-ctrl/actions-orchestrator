/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

// CONFIG: The name of the central repo that stores your caller workflows
const caller_repo = "actions-callers"

 module.exports = (app) => {
  
  // For every PR related event, we run runRequiredTests
  app.on(['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened', 'pull_request.edited'], async(context) => {
    runRequiredTests(context, 'pull_request')
  })

  async function runRequiredTests(context, source) {
    let headSha;
    if (source == "pull_request") {
      headSha = context.payload.pull_request.head.sha
    } 

    // Logic to decide the repo dispatch calls to kick off
    let requiredTests = await getRequiredTests(context)

    for (let i=0;i<requiredTests.length;i++){
      let checkRun = await createCheckRun(context, headSha)

      const check_suite_id = checkRun.data.check_suite.id

      let repoDispatch = await createRepoDispatch(context,caller_repo,requiredTests[i])
      console.log("DEBUG("+i+"): createRepoDispatch Complete")

      let result = await getResult(context,check_suite_id)

      await resolveCheck(context, headSha, checkRun, result)
    }
  }

  async function getRequiredTests(context) {
    let requiredTests = [];
    // read YAML to parse the required  
    requiredTests.push("call-01")
    return requiredTests
  }

  async function makeSuccess(context) {
    return "success"
  }

  async function createCheckRun(context, headSha) {
    const startTime = new Date();

    return await context.octokit.checks.create({
      headers: {
        accept: "application/vnd.github.v3+json"
      },
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      name: "Actions Orchestrator",
      status: "queued",
      started_at: startTime,
      head_sha: headSha,
      output: {
        title: "Queuing Required Tests",
        summary: "Required Tests will begin shortly",
      },
    })
  }

  async function resolveCheck(context, headSha, checkRun, result) {
    
    await context.octokit.checks.update({
      headers: {
        accept: "application/vnd.github.v3+json"
      },
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      name: "Actions Orchestrator",
      check_run_id: checkRun.data.id,
      status: "completed",
      head_sha: headSha,
      conclusion: result,
      output: {
        title: "Required Tests Complete",
        summary: "Result is " + result,
      },
    })
  }

  async function createRepoDispatch(context,caller_repo,event_type) {

    const installIdResponse = await context.octokit.apps.getOrgInstallation({
      org: context.payload.repository.owner.login
    })
    const installId = installIdResponse.data.id
    const installTokenResponse = await context.octokit.apps.createInstallationAccessToken({
      installation_id: installId,
      permissions: {
        metadata: 'read',
        contents: 'write'
      }
    });
    const installToken = installTokenResponse.data.token
    return await context.octokit.repos.createDispatchEvent({
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: 'token '+installToken
      },
      owner: context.payload.repository.owner.login,
      repo: caller_repo,
      event_type: event_type
    })
  }

  async function getResult(context,check_suite_id){
    let wf_runs = await context.octokit.actions.listWorkflowRunsForRepo({
      owner: context.payload.repository.owner.login,
      repo: caller_repo,
      event: "repository_dispatch"    
    });
    //Figure out the actual corresponding run
    // If the run has completed, then return the conclusion
    // else wait 
  }
};