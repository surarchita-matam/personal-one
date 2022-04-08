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

router.get('/homepage/search', (req, res, next) => {
  let session = req.session

  if (session.userid) {
    res.render('index', { username: session.username, profilepic: session.picture })
    next()
  }
  else {
    res.redirect("/")
  }


})

router.get('/privacy-policy', (req, res) => {
  res.send("The app is private and only used in my local")
})


router.get('/oauth/googleapi', googleauth.authorize)

router.get('/oauth/callback', googleauth.getAccessToken, async (req, res, next) => {
  return res.redirect('/homepage/search')
})

router.get('/api/data/search-channel', controller.searchChannel)

router.get('/api/data/search', controller.searchQuery)


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})



module.exports = router

