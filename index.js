var express = require('express')
var app = express()

var fs = require('fs')
var _ = require('lodash')
var engines = require('consolidate')
var path = require('path')
var bodyParser = require('body-parser')
/*var users = []

fs.readFile('users.json', {encoding: 'utf8'}, (err, data) => {
  if (err) throw err

  JSON.parse(data).forEach(user => {
    user.name.full = _.startCase(user.name.first + '  ' + user.name.last)
    users.push(user)
  });
})*/

app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')

//app.use('/images', express.static('images'))
app.use('/profilepics', express.static('images'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  // var buffer = ''
  // users.forEach(user => {
  //   buffer += '<a href="'+ user.username +'">' + user.name.full + '</a><br/>'
  // })
  // res.send(buffer)
  //res.render('index', {users: users})

  var users = []
  fs.readdir('users', (err, files) => {
    files.forEach(file => {

      fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, (err, data) => {
        if (err) throw err

        // JSON.parse(data).forEach(user => {
        //   user.name.full = _.startCase(user.name.first + '  ' + user.name.last)
        //   users.push(user)
        // });
        var user = JSON.parse(data)
        user.name.full = _.startCase(user.name.first + '  ' + user.name.last)
        users.push(user)

        if (users.length === files.length) res.render('index', {users: users})
      })

    })
  })
})

app.get(/big.*/, (req, res, next) => {
  console.log('BIG USER ACCESS')
  next()
})

app.get(/.*dog.*/, (req, res, next) => {
  console.log('DOGS GO WOOF')
  next()
})

app.get('/:username', (req, res) => {
  var username = req.params.username
  ////res.send(username)
  //res.render('user', {username: username})

  var user = getUser(username)
  res.render('user', { user: user, address: user.location })
})

app.put('/:username', (req, res) => {
  var username = req.params.username
  var user = getUser(username)
  user.location = req.body
  saveUser(username, user)
  res.end()
})

app.delete('/:username', (req, res) => {
  var username = req.params.username
  var fp = getUserFilePath(username)
  fs.unlinkSync(fp) // delete the file
  res.sendStatus(200)
})

// Start: Functions
function getUser (username) {
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}))
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
  _.keys(user.location).forEach(function (key) {
    user.location[key] = _.startCase(user.location[key])
  })
  return user
}

function getUserFilePath (username) {
  return path.join(__dirname, 'users', username) + '.json'
}

function saveUser (username, data) {
  var fp = getUserFilePath(username)
  fs.unlinkSync(fp) // delete the file
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'})
}
// End: Functions

var server = app.listen(3000, () => {
  console.log('Server running at http://localhost:' + server.address().port)
})