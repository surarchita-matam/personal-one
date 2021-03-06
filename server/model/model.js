const { redirect } = require('express/lib/response');
const mongoose = require('mongoose');
// const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching')


let schema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  publishedAt: Date,
  title: String,
  description: String,
  channelTitle: String
})

schema.index({ title: "text", description: "text" });

let Projectone = mongoose.model('projectone', schema)


const storeDetails = (data) => {
  let projectFiles = []
  data.forEach(item => {
    projectFiles.push({
      id: item.id.videoId,
      publishedAt: item.snippet.publishedAt,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle
    })
  });


  Projectone.insertMany(projectFiles)
    .then(data => {
      console.log(data)

    })
    .catch(err => {
      console.log(err)
    })

}

const retriveDetails = (channelid, input = false) => {

  if (!input) {
    return new Promise(async (resolve, reject) => {
      let result = await Projectone.findOne({ id: channelid })

      console.log(result)
      resolve(result)
    })

  }
  else {
    console.log('input', input)
    var searchRegex = new RegExp(input);
    return new Promise(async (resolve, reject) => {
      var regexSearchOptions = {
        "title": {
          "$regex": searchRegex,
          '$options': 'i'
        }
      };
      // let result = await Projectone.find(
      //   {"$text":{"$search":input}},
      // { score: { $meta: "textScore" } }
      // ).sort( { score: { $meta: "textScore" } } )
      let result = await Projectone.find(regexSearchOptions,
        //  {score: { "$meta": "textScore" }}
      ).sort({ publishedAt: -1 })

      console.log(result)
      resolve(result)
    })
  }

}



let userschema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  firstname: String,
  picture: String,
  lastname: String,
  fullname: String,
  email: String,
  access_token: String,
  refresh_token: String
})


let Projectoneusers = mongoose.model('projectoneusers', userschema)

var accesstoken = false;

const storeUsers = async (details, access_token, refresh_token) => {
  let userfound = await Projectoneusers.findOne({ id: details.sub })
  accesstoken = access_token
  if (userfound) {
    let updated = await Projectoneusers.updateOne({ id: details.sub }, { $set: { access_token } })
  }
  else {
    let user = [{
      id: details.sub,
      firstname: details.given_name,
      lastname: details.family_name,
      picture: details.picture,
      email: details.email,
      fullname: details.name,
      access_token
    }]
    if (refresh_token) {
      user[0].refresh_token = refresh_token
    }

    Projectoneusers.create(user).then(data => {
      console.log(data, "in data")
    })
  }



}


module.exports = {
  storeDetails,
  retriveDetails,
  storeUsers
}