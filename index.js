// Checks API example
// See: https://developer.github.com/v3/checks/ to learn more

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */https://github.com/pedrolacerda/maximo-gmud.git

module.exports = app => {
  app.on(['check_suite.requested', 'check_run.rerequested'], check)

  async function check (context) {
    var fs = require('fs')
    var path = require('path')
    var filePath = path.join(__dirname, 'maximo.config');
    var stringMaximo = fs.readFileSync(filePath,{ encoding: 'utf8' })
    
    var maximoList = stringMaximo.split('|')
    var maximoJson = {}
    maximoList.forEach(element => {
      var thisElementSplited = element.split('=')
      maximoJson[thisElementSplited[0]]= thisElementSplited[1]
    });

    var maximoStatus = maximoJson['STATUS']

    console.log("É 'Aprovado'? " + maximoStatus.localeCompare('APROVADO'))

    const startTime = new Date()

    // Do stuff
    const { head_branch: headBranch, head_sha: headSha } = context.payload.check_suite
    // Probot API note: context.repo() => {username: 'hiimbex', repo: 'testing-things'}
    if(maximoStatus.localeCompare('APROVADO') == 0){
      return context.github.checks.create(context.repo({
        name: 'Valida Item GMUD Máximo',
        head_branch: headBranch,
        head_sha: headSha,
        status: 'completed',
        started_at: startTime,
        conclusion: 'success',
        completed_at: new Date(),
        output: {
          title: 'Validação Máximo',
          summary: 'O Item de GMUD foi aprovado!'
        }
      }))
    } else {
      return context.github.checks.create(context.repo({
        name: 'Valida Item GMUD Máximo',
        head_branch: headBranch,
        head_sha: headSha,
        status: 'completed',
        started_at: startTime,
        conclusion: 'failure',
        completed_at: new Date(),
        output: {
          title: 'Validação Máximo',
          summary: 'O Item de GMUD <b>NÃO</b> está aprovado!'
        }
      }))
    }
    
  }

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
