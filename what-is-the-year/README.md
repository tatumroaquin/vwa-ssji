# What is the Year?

![what-is-the-year](../images/simple-ssji.png)

## How to Run
`node app.js` or `npm start`

## Intended Usage
This application simply outputs an `h1` tag with a specified `year` captured from a HTTP GET Query. If there is no specified `year`, the current year is displayed.

```
curl http://localhost:3000/
# outputs "The Year is 2022"

curl http://localhost:3000/?year=1970
# outputs "The Year is 1970"
```
