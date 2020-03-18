var express = require("express");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var mongoose = require("mongoose");
var methodOverride = require("method-override");



var app  = express();


 app.set("view engine", "ejs");
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(express.static("public"));
 app.use(methodOverride("_method"));



// connectiong to mongoDb
 mongoose.connect("mongodb://localhost/myBlogDB", { useNewUrlParser: true ,  useUnifiedTopology: true });



// blogSchema
var ArticleSchema = new mongoose.Schema({
    Title : {
        type: String,
        required : true
    },
    createdAt : {
        type : Date,
        default : new Date()
    },

    description : String,
});


// // BLOG MODEL

var article = mongoose.model("Article", ArticleSchema);


// user Schema

var userSchema = new mongoose.Schema({
    fname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    opinion : String,
    createdAt : {
        type : Date,
        default : new Date()
    },
});

// USER MODEL
var user = mongoose.model("User", userSchema);

// var user  = new user({
//     fname : "abed khan",
//     email : "ab@gmail.com",
//     opinion : "once upon a time ..."
// });

// user.save();



var firstContent = "this is the content of the first one ! this one goes to home ";
var secondContent = "and this one is for the content of the sedcond paragarpha. this one goes to the about maybe";


app.get("/", (req, res)=>{
    article.find({}, (err, foundArticles)=>{
        if(!err){
            res.render("app", { articles : foundArticles });
        }
    }).sort({createdAt : "desc"});    
   
});

app.get("/about", (req, res)=>{
    res.render("about", {secondContent : secondContent});
});

// USER'S LIST 

app.get("/users", (req, res)=>{
    user.find({}, (err, foundUser)=>{
        if(!err){
            res.render("users/userlist", {users : foundUser});
        }else{
            res.redirect("/");
        }
    }).sort({createdAt : "desc"});
  
});


app.get("/contact", (req, res)=>{
    res.render("contact");
});


// get contacts info of clients
app.post("/contact/submit", (req,res)=>{
      
    var Newuser = new user({
        fname : req.body.fname,
        email : req.body.email,
        opinion : req.body.opinion,
    }) ;

    Newuser.save();
    res.render("users/submitContact");
})





app.get("/create", (req, res)=>{
    res.render("createNew");
});


app.post("/create", (req, res)=>{
       var title = req.body.title;
       var description = req.body.content;
     

       article.create({
           Title : title,
           description : description ,
       }, (err)=>{
           if(err){
               console.log(err);
           }
       });

    res.redirect("/");

});

// specific content page 

app.get("/more/:id/show", (req, res)=>{
    article.findById(req.params.id, (err, foundId)=>{
        if(!err){
            res.render("readMore", {Article : foundId});
        }else{
          
            console.log(err);
        }
    })
});

// edit form

app.get("/article/:id/edit", (req, res)=>{
    article.findById(req.params.id, (err, foundEditId)=>{
        if(!err){
            res.render("edit", {article : foundEditId});
        }
    })
    
})

// update article 
app.put("/article/:id/update", (req, res)=>{
    var title = req.body.title,
         description = req.body.description;

    article.findByIdAndUpdate(req.params.id, {Title : title, description : description}, (err, foundUpdateId)=>{
        if(err){
            res.redirect("/article/" + req.params.id + "/edit");
        }else{
            res.redirect("/more/" + req.params.id + "/show");
            console.log("successfully updated!");
        }
    })
})

// dELETE route
app.delete("/article/:id/delete", (req, res)=>{
    article.findByIdAndDelete(req.params.id, (err)=>{
        if(!err){
            res.redirect("/");
            console.log("successfully deletd !");
        }
    })
});



app.listen(process.env.PORT || 4000 , ()=>{
    console.log("port is ready !");


});