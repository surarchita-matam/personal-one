const express = require('express')


const router = express.Router()


const controller = require('../controller/controller')
const googleauth = require('../services/auth')


router.get('/', (req, res) => {
  res.redirect('/oauth/googleapi')
})

router.get('/health-check', (req, res) => {
  res.send("Project is working fine. Health check successfull")
})

router.get('/homepage', (req, res) => {
  res.render('homepage')
})

router.get('/homepage/search', (req, res) => {
  let session = req.session
  console.log(session, "in session line 25")
  if (session.userid) {
    res.render('index', { username: session.username, profilepic: session.picture })
  }
  else {
    res.redirect("/")
  }


})

router.get('/privacy-policy', (req, res) => {
  res.send("The app is private and only used in my local")
})


router.get('/oauth/googleapi', googleauth.authorize)

router.get('/oauth/callback', async (req, res, next) => {
  await googleauth.getAccessToken(req, res, next)
  next()
})

router.get('/api/data/search-channel', controller.searchChannel)

router.get('/api/data/search', controller.searchQuery)


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})



module.exports = router

