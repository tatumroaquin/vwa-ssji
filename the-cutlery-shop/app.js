const express = require('express')
const path = require('path')
const app = express()
const { v4: uuid } = require('uuid')

let cutleries = require('./public/data/data.json')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))

// https://stackoverflow.com/a/47232318 (about body-parser)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_, res) => {
  res.render('index', { cutleries })
})

app.get('/new', (_, res) => {
  res.render('pages/create')
})

app.post('/new', (req, res) => {
  let name, price;
  if (req.body.name && req.body.price) {
    try {
      eval('name = "' + req.body.name + '"')
      eval('price = ' + req.body.price)
    } catch (err) {
      name = err.message
      price = "N/A"
    }
  }
  cutleries.data.push({ "id": uuid(), "name": name, "price": price })
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('listening at port 3000')
})
