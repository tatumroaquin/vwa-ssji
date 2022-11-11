const express = require('express')
const path = require('path')
const app = express()

const cutleries = require('./public/data/data.json').data

//app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { cutleries })
})

app.listen(3000, () => {
  console.log('listening at port 3000')
})
