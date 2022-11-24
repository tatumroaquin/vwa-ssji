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

// CREATE
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

// UPDATE
app.get('/edit/:id', (req, res) => {
  let id = req.params.id;
  let cutlery = cutleries.data.find(c => c.id === id)
  if (cutlery) {
    res.render('pages/update', { cutlery })
  } else {
    res.render('pages/error', { message: "Item not found." })
  }
})

app.post('/edit/:id', (req, res) => {
  let id, name, price;
  if (req.body.name && req.body.price) {
    try {
      eval('id = "' + req.params.id + '"')
      eval('name = "' + req.body.name + '"')
      eval('price = ' + req.body.price)

      let index = cutleries.data.findIndex(c => c.id === id)
      cutleries.data[index] = {
        id,
        name,
        price,
      }
    } catch (err) {
      res.render('/pages/error', { message: "An error occurred while updating the item." })
    }
  }
  res.redirect('/')
})

app.get('/delete/:id', (req, res) => {
  let id = req.params.id
  let cutlery = cutleries.data.find(c => c.id === id)
  if (!cutlery)
    res.render('pages/error', { message: 'Item does not exist' })

  cutleries.data = cutleries.data.filter(c => c.id !== id)
  res.redirect('/')
})

app.get('*', (_, res) => {
  res.render('pages/error', { message: "404 not found" })
})

app.listen(3000, () => {
  console.log('listening at port 3000')
})
