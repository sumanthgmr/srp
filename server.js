var express = require('express')
var app = express()
var mongojs = require('mongojs')
var sess = require('sess')
var path = require('path');
const session = require('express-session');
app.use(express.static("public"));
var bodyParser=require("body-parser");
app.set("view engine","ejs"); // setting view engine to ejs


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true })); 

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
    session({
      key: "user_sid", // cookies id 
      secret: "ssshhhhh",
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 1000 * 6000 * 6000 * 1000000, // cookie expiration time in seconds
      },
    })
);

var sess;

app.get('/',(req,res) => {
    res.sendFile(__dirname+'/public/signup.html')
})

app.get('/signup', (req,res) => {
    var cString='mongodb+srv://sumanthgmr:sumanthgmr@2001@cluster0.yflxb.mongodb.net/srp?retryWrites=true&w=majority';
    var db = mongojs(cString,['users'])
    var e = {
        name: req.query.name,
        email: req.query.email,
    }
    db.users.find(e,function(err,docs){
        if(docs.length!=0){
            res.send('Email and username is already registered')
        }else{
            var d = {
                name: req.query.name,
                email: req.query.email,
                password: req.query.password
            }
        
            db.users.insert(d,function(err,docs){
            if(err){
                res.send('Something went wrong')
            }else{
                res.sendFile(__dirname+"/public/attendence.html")
            }
            })
        }
    })
})

app.get('/login',function(req,res){
    sess = req.session;
    var cString='mongodb+srv://sumanthgmr:sumanthgmr@2001@cluster0.yflxb.mongodb.net/srp?retryWrites=true&w=majority';
    var db = mongojs(cString,['users'])
    var d={
        name:req.query.name,
        password:req.query.password
    }
    sess.name = req.query.name;
	sess.password = req.query.password;
    db.users.find(d,function(err,docs){
        if(docs.length==0){
            res.send('No user found')
        }
        else{
            res.sendFile(__dirname+"/public/interior.html")
        }
    })
})

app.get('/login1',function(req,res){
    res.sendFile(__dirname+"/public/attendence.html")
})

app.get("/form", (req,res) => {
    res.sendFile(__dirname+"/public/form.html")
})

app.get("/data", (req,res) => {
    sess = req.session
    var cString='mongodb+srv://sumanthgmr:sumanthgmr@2001@cluster0.yflxb.mongodb.net/srp?retryWrites=true&w=majority';
    var db = mongojs(cString,['data'])
    var a = {
        name:sess.name,
        nam:req.query.lname,
        gender:req.query.gender,
        phone:req.query.phno,
        qualification:req.query.qua,
        age:req.query.age,
        place:req.query.ple
    }
    db.data.insert(a, (err,docs) => {
        if(err){
            res.send("something went wrong")
        }
        else{
            res.send("added")
        }
    })
})

app.get("/dply", (req,res) => {
    sess = req.session
    var cString='mongodb+srv://sumanthgmr:sumanthgmr@2001@cluster0.yflxb.mongodb.net/srp?retryWrites=true&w=majority';
    var db = mongojs(cString,['data'])
    // var d = {
    //     name:sess.name
    // }
    db.data.find({}, (err,docs) => {
        res.render("display",{data:docs})
    })
})

app.get("/only", (req,res) => {
    sess = req.session
    var cString='mongodb+srv://sumanthgmr:sumanthgmr@2001@cluster0.yflxb.mongodb.net/srp?retryWrites=true&w=majority';
    var db = mongojs(cString,['data'])
    var d = {
        name:sess.name
    }
    db.data.find(d, (err,docs) => {
        res.render("display",{data:docs})
    })
})

app.get("/logout", (req,res) => {
    res.redirect("/")
})

app.listen(3000, () => {
    console.log("server running")
})