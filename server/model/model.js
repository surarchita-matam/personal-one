const mongoose = require('mongoose');
// const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching')




let schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  publishedAt: Date,
  title: String,
  description: String,
  channelTitle: String
})

schema.index({ "title": "text", "description": "text" });

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
      // let result = await Projectone.find({"$text":{"$search":`${input}`}})
      let result = await Projectone.find(regexSearchOptions).sort({ publishedAt: -1 })

      console.log(result)
      resolve(result)
    })
  }

}




module.exports = {
  storeDetails,
  retriveDetails,
}