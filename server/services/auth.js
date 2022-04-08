const express = require("express");
const google = require("googleapis").google;
const path = require('path')
const fs = require('fs')
const controller = require("../controller/controller")
const { storeUsers } = require("../model/model")

// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2



const credentials = require("../utils/credentials.json");
const { nextTick } = require("process");


const SCOPES = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
]


const authorize = (req, res) => {


  // Create an OAuth2 client object from the credentials
  const oauth2Client = new OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
  );

  // Obtain the google login link to which we'll send our users to give us access
  const loginLink = oauth2Client.generateAuthUrl({
    access_type: "offline", // Indicates that we need to be able to access data continously without the user constantly giving us consent
    scope: SCOPES // Using the access scopes 
  });
  return res.render('auth', { link: loginLink });
};

const getAccessToken = async (req, res, next) => {
  // Create an OAuth2 client object from the credentials 
  const oauth2Client = new OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
  );

  if (req.query.error) {
    // The user did not give us permission.
    return res.redirect("/");
  } else {
    let { tokens } = oauth2Client.getToken(req.query.code)

    oauth2Client.setCredentials(tokens);
    // fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
    //   if (err) console.log(`error while writing the token.json file ${err}`)
    // })
    let userdetails;
    let user
    oauth2Client.on('tokens', async (tokens) => {

      //https://www.googleapis.com/oauth2/v3/userinfo
      let refresh_token = tokens.refresh_token ? tokens.refresh_token : false

      // Storing the token in the token.json

      userdetails = await controller.userInfo(tokens.access_token, refresh_token)
      console.log(userdetails, "userdetails11")
      let session = req.session
      session.userid = userdetails.sub
      session.username = userdetails.given_name
      session.picture = userdetails.picture
      session.email = userdetails.email
      session.access_token = tokens.access_token
      req.session.save();

      await storeUsers(userdetails, tokens.access_token, refresh_token)
      next()

    });


  }
};


// const getTokens = async (req, res) => {
//   let session = req.session
//   console.log(session)
//   if (session.userid) {
//     return session.access_token
//   }
//   else {
//     return res.redirect('/')
//   }

// }





module.exports = {
  authorize,
  getAccessToken

}