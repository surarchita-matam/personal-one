const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const path = require('path')
const controller = require('./server/controller/controller')

const app = express()

const connectDB = require('./server/database/connection')

dotenv.config({ path: 'config.env' })

const PORT = process.env.PORT || 9292


// Allowing ourselves to use cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.use(morgan('tiny'))


//set view engine
app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "views"))


connectDB()


app.use(bodyparser.urlencoded({ extended: true }))

app.use('/', require('./server/routes/router'))


var minutes = 10, the_interval = minutes * 60 * 1000;

setInterval(function () {
  console.log("I am doing my 5 minutes check");
  controller.fetchDetails()
  // do your stuff here
}, the_interval);




app.listen(PORT, () => { console.log(`The server is running on http://localhost:${PORT}`) })