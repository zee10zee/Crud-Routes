var express = require("express");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var app  = express();

app.get("/", (req, res)=>{
    res.send("<h1>home route</h1>")
})
app.listen(process.env.PORT || 3000 , ()=>{
    console.log("port is ready !");
});