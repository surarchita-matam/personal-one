const qs = require('qs');
const axios = require('axios')
const storeModel = require('../model/model')
const oauth = require('../services/auth')
const google = require("googleapis").google;
const credentials = require('../utils/credentials.json')



exports.userInfo = async (access_token, refresh_token) => {

  const requestPayload = {
    method: 'get',
    url: 'https://www.googleapis.com/oauth2/v3/userinfo',
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "Host": "www.googleapis.com"
    }
  }
  const { data: response } = await axios(requestPayload);
  console.log("response", response)
  return response

}


exports.fetchDetails = async (req, res) => {
  console.log(req.session, "infetchdetails")
  if (req.session && req.session.userid) {
    let access_token = req.session.access_token
    let date = new Date()
    const requestPayload = {
      method: 'get',
      url: 'https://www.googleapis.com/youtube/v3/search',
      params: {
        'key': credentials.web.API_KEY,
        'type': 'video',
        'publishedAfter': new Date(date.setDate(date.getDate() - 1)),
        'order': 'date',
        'part': 'snippet',
        'relevanceLanguage': 'en'
      },
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    }
    const { data: response } = await axios(requestPayload);

    console.log(response)

    if (response.items.length > 0) {
      storeModel.storeDetails(response.items)
    }
  }
  else {
    return res.status("400").send("User is not validated")
  }

}

exports.searchChannel = async (req, res) => {
  console.log(req.query.channelid)

  let data = await storeModel.retriveDetails(req.query.channelid)
  console.log(data)
  res.status(200).send({
    success: true,
    data
  })

}


exports.searchQuery = async (req, res) => {
  console.log(req.query.input, "in search query")

  let data = await storeModel.retriveDetails(false, req.query.input)
  console.log(data, "data in search query")
  res.status(200).send({
    success: true,
    data
  })

}


