const express = require("express");
const google = require("googleapis").google;
const path = require('path')
const fs = require('fs')

// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2


const credentials = require("../utils/credentials.json")

const TOKEN_PATH = path.resolve(__dirname, "../utils/token.json")

const SCOPES = ["https://www.googleapis.com/auth/youtube"]


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

const getAccessToken = (req, res) => {
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
    oauth2Client.getToken(req.query.code, function (err, token) {
      if (err) return res.redirect("/");
      console.log(token)

      // Storing the token in the token.json
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.log(`error while writing the token.json file ${err}`)

        console.log(`Token has been stored to ${TOKEN_PATH}`)

      })

      return res.redirect("/homepage/search");
    });
  }
};




module.exports = {
  authorize,
  getAccessToken

}