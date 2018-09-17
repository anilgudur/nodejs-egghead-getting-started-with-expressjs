var express = require('express')
var app = express()

var fs = require('fs')
var _ = require('lodash')
var path = require('path')
var engines = require('consolidate')
var bodyParser = require('body-parser')
var helpers = require('./helpers')
var JSONStream = require('JSONStream')
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
    if (err) throw err
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
  //console.log('BIG USER ACCESS')
  next()
})


app.get(/.*dog.*/, (req, res, next) => {
  //console.log('DOGS GO WOOF')
  next()
})


app.get('*.json', (req, res) => {
  console.log(req.path);
  //res.download('./users/' + req.path, 'virus.exe')
})


app.get('/data/:username', (req, res) => {
  var username = req.params.username
  // var user = helpers.getUser(username)
  // res.json(user)

  // #Use streams for non blocking io operation i.e. Asynchronously get input and simultaneously write
  var readable = fs.createReadStream(helpers.getUserFilePath(username))
  readable.pipe(res)
})


app.get('/users/by/:gender', (req, res) => {
  var gender = req.params.gender
  var readable = fs.createReadStream('users.json')

  readable
    .pipe(JSONStream.parse('*', (user) => {
      if (user.gender === gender) return user.name
    }))
    .pipe(JSONStream.stringify('[\n  ', ',\n  ', '\n]\n'))
    .pipe(res)
})


var userRouter = require('./username')
app.use('/:username', userRouter)
/*
app.route('/:username')
.all((req, res, next) => {
  console.log(req.method, 'for', req.params.username)
  next()
})
.get(helpers.verifyUser, (req, res) => {
  var username = req.params.username
  ////res.send(username)
  //res.render('user', {username: username})

  var user = helpers.getUser(username)
  res.render('user', { user: user, address: user.location })
})
.put((req, res) => {
  var username = req.params.username
  var user = helpers.getUser(username)
  user.location = req.body
  helpers.saveUser(username, user)
  res.end()
})
.delete((req, res) => {
  var username = req.params.username
  var fp = helpers.getUserFilePath(username)
  fs.unlinkSync(fp) // delete the file
  res.sendStatus(200)
})
*/


// app.get('/:foo', (req, res) => {
//   res.send('WHOOPS')
// })
app.get('/error/:username', (req, res) => {
  res.status(404).send('No user named \'' + req.params.username + '\' found.')
})




var server = app.listen(3000, () => {
  console.log('Server running at http://localhost:' + server.address().port)
})