const http = require('http')
const url = require('url')

const app = http.createServer((req, res) => {
  let route = req.url.split('?')[0];
  let params = url.parse(req.url, true);

  if (route === '/') {
    let year = new Date().getFullYear();

    if (params.query['year'])
      eval(`year = ${params.query['year']}`);

    res.end(`<h1>The Year is ${year}</h1>`);
  }
})

app.listen(3000, () => {
  console.log('listening to port 3000');
});
