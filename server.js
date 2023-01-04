// upload App to the Internet through Render

let express = require("express")
let mongodb = require("mongodb")
let sanitizeHTML = require("sanitize-html")

let ourApp = express()
let db
let port = process.env.PORT
if (port == null || port == "") {
  port = 3000
}

ourApp.use(express.urlencoded({ extended: false }))
ourApp.use(express.static("public"))
ourApp.use(express.json())
ourApp.use(passwordProtected)

connectionString = "mongodb+srv://todoAppUser:9122002!@cluster0.qt0ww.mongodb.net/pracApp?retryWrites=true&w=majority"
mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  db = client.db()
  ourApp.listen(port)
})

function passwordProtected(req, res, next) {
  res.set("WWW-Authenticate", 'Basic realm="Simple To do App"')
  //console.log(req.headers.authorization)
  if (req.headers.authorization == "Basic YWJjZDoxMjM0") {
    next()
  } else {
    res.status(401).send("Authentication required")
  }
}

ourApp.get("/", function (req, res) {
  db.collection("items")
    .find()
    .toArray(function (err, items) {
      res.send(`<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Simple To-Do App</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
            <div class="container">
                <h1 class="display-4 text-center py-1">To-Do App</h1>
                
                <div class="jumbotron p-3 shadow-sm">
                <form id='ourForm' action='/create-item' method='POST'>
                    <div class="d-flex align-items-center">
                    <input id='ourField' name='item' autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                    <button class="btn btn-primary">Add New Item</button>
                    </div>
                </form>
                </div>
                
                <ul id='ourList' class="list-group pb-5">
                                   
                </ul>
                
            </div>
            <script>let items = ${JSON.stringify(items)}</script>
            <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
            <script src='browser.js'></script>        
        </body>
    </html>`)
    })
})

// basic submit method
/*
ourApp.post('/create-item', function(req, res) {
    db.collection('items').insertOne({text: req.body.item}, function() {
        res.redirect('/')
    })
})
*/

//Axios submit method
ourApp.post("/add-item", function (req, res) {
  let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })
  db.collection("items").insertOne({ text: safeText }, function (err, info) {
    res.json(info.ops[0])
  })
})

ourApp.post("/edit-item", function (req, res) {
  let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })
  db.collection("items").findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.id) }, { $set: { text: safeText } }, function () {
    res.send("Success")
  })
})

ourApp.post("/delete-item", function (req, res) {
  db.collection("items").deleteOne({ _id: new mongodb.ObjectId(req.body.id) }, function () {
    res.send("Success")
  })
})
