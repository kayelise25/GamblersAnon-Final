const cors = require("cors")
const mongo = require("mongodb")
const mongoose = require("mongoose")
const fs = require("fs")
const stratModel = require("./models/strategySchema")

const mongoURI = process.env.MONGODB_URL

const express = require("express")
const app = express()
const path = require("path")
const { assert } = require("console")
const router = express.Router()

app.use(express.json())

const uri =
  "mongodb+srv://kayhorton20:Kh00465551@gamblersanon.ykyrx2p.mongodb.net/?retryWrites=true&w=majority"
async function connect() {
  try {
    await mongoose.connect(uri)
    console.log("connected to mongoDB")
  } catch (error) {
    console.error(error)
  }
}

connect()

router.get("/get-data/:playerValue", async function (req, res) {
  var result = req.params.playerValue
  try {
    const data = await stratModel.find({playerId: result})
    if (data) {
      console.log(data);
      res.json(data)
      console.log(result)
    }
  } catch (error) {
    console.log(error);
  }
 /* stratModel.find( (err, items) => {
    if (err) {
      console.log(err)
    } else {
      res.json(items)
      console.log(result)
    }
  })*/
})

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"))
  //__dirname : It will resolve to your project folder.
})

router.get("/app.html", function (req, res) {
  res.sendFile(path.join(__dirname + "/app.html"))
})

router.get("/app-tutorial.html", function (req, res) {
  res.sendFile(path.join(__dirname + "/app-tutorial.html"))
})

// serve your css as static
app.use(express.static(__dirname))

//add the router
app.use("/", router)
app.listen(process.env.port || 3000)

console.log("Running at Port 3000")
