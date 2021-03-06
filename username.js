var express = require('express')
var helpers = require('./helpers')
var fs = require('fs')

var router = express.Router({ mergeParams: true })

router.use((req, res, next) => {
  console.log(req.method, 'for', req.params.username + ' at ' + req.path)
  next()
})


// router.all('/', (req, res, next) => {
//   console.log(req.method, 'for', req.params.username)
//   next()
// })

//router.get('/', helpers.verifyUser, (req, res) => {
router.get('/', (req, res) => {
  var username = req.params.username
  ////res.send(username)
  //res.render('user', {username: username})

  var user = helpers.getUser(username)
  res.render('user', { user: user, address: user.location })
})


//#Middleware for error handling
router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


router.put('/', (req, res) => {
  var username = req.params.username
  var user = helpers.getUser(username)
  user.location = req.body
  helpers.saveUser(username, user)
  res.end()
})

router.delete('/', (req, res) => {
  var username = req.params.username
  var fp = helpers.getUserFilePath(username)
  fs.unlinkSync(fp) // delete the file
  res.sendStatus(200)
})

router.get('/edit', (req, res) => {
  res.send('You want to edit ' + req.params.username + '???')
})

module.exports = router