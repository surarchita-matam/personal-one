const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const path = require('path')
const controller = require('./server/controller/controller')
const moment = require('moment')


const app = express()

const connectDB = require('./server/database/connection')

dotenv.config({ path: 'config.env' })

const PORT = process.env.PORT || 9292


// Allowing ourselves to use cookies
const cookieParser = require("cookie-parser");
const session = require('express-session')
app.use(cookieParser());

let onehour = 1000 * 60 * 60;

app.use(session({
  secret: "mysecretkeyforprojectone",
  saveUninitialized: true,
  cookie: { maxAge: onehour },
  resave: true
}))


app.use(morgan('tiny'))


//set view engine
app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "views"))


connectDB()


app.use(bodyparser.urlencoded({ extended: true }))

app.use('/', require('./server/routes/router'))
app.use('/homepage/search', (req, res) => {

  var minutes = 20, the_interval = minutes * 60 * 1000;

  setInterval(function (req, res) {
    console.log("I am doing my 5 minutes check");
    controller.fetchDetails(req, res)
    // do your stuff here
  }, the_interval, req, res);
})





app.listen(PORT, () => { console.log(`The server is running on http://localhost:${PORT}`) })