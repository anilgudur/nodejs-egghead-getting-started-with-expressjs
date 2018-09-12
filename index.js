var express = require('express')
var app = express()

app.get('/', (req, res) => {
  res.send('Hello, world!!')
})

app.get('/yo', (req, res) => {
  res.send('Yo!')
})

var server = app.listen(3000, () => {
  console.log('Server running at http://localhost:' + server.address().port)
})