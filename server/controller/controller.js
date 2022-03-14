const qs = require('qs');
const axios = require('axios')
const storeModel = require('../model/model')
const oauth = require('../services/auth')
const google = require("googleapis").google;
const tokens = require("../utils/token.json")
const credentials = require('../utils/credentials.json')






exports.fetchDetails = async (req, res) => {


  const requestPayload = {
    method: 'get',
    url: 'https://www.googleapis.com/youtube/v3/search',
    params: {
      'key': credentials.web.API_KEY,
      'type': 'video',
      'publishedAfter': '2022-03-08T00:00:00Z',
      'order': 'date',
      'part': 'snippet',
      'relevanceLanguage': 'en'
    },
    headers: {
      "Authorization": `Bearer ${tokens.access_token}`
    }
  }
  const { data: response } = await axios(requestPayload);

  console.log(response)

  if (response.items.length > 0) {
    storeModel.storeDetails(response.items)
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


