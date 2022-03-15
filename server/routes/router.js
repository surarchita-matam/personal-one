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
  res.render('index')
})

router.get('/privacy-policy', (req, res) => {
  res.send("The app is private and only used in my local")
})


router.get('/oauth/googleapi', googleauth.authorize)

router.get('/oauth/callback', googleauth.getAccessToken)

router.get('/api/data/search-channel', controller.searchChannel)

router.get('/api/data/search', controller.searchQuery)



module.exports = router

