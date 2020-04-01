var express=require('express');
var mongoose=require('mongoose');
var bodyParser=require("body-parser"); 
  

var passportLocalMongoose=require("passport-local-mongoose");


mongoose.connect('mongodb://localhost:27017/cropdata'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection to first"); 
}) 

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var app=express();

app.set('view engine','ejs');

app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 


app.post('/', function(req,res){ 
    var Name = req.body.Name; 
    var email =req.body.email; 
    var phonenumber = req.body.phonenumber; 
    var text =req.body.text; 
  
    var data = { 
        "Name": Name, 
        "email":email, 
        "phonenumber":phonenumber, 
        "text":text 
    } 
db.collection('details').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
              
    }); 
          
    return res.redirect('/'); 
}) 
  

app.get('/',function(req, res){
    res.render("home");
});

app.post('/search', function(req, res)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cropdata");
        
        dbo.collection("data").find({'State_Name': req.body.State,'District_Name':req.body.district,'Season':req.body.season}).sort({'P_A':-1}).toArray(function(err, result) {
          if (err) throw err;
          console.log("Connected to second")
          // var t;
          // console.log(result);
          // console.log(req.body)
        var userinfo=req.body;
        res.render('result',{result : result,userinfo:userinfo})
          // console.log(req.body.area)
        //   console.log(result[0])
          db.close();
        });
      });
      
})

app.post('/searchbycrop', function(req, res)
{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cropdata");
        dbo.collection("data").find({'State_Name': req.body.StateA,'District_Name':req.body.districtA,'Crop':req.body.cropA}).toArray(function(err, result) {
          if (err) throw err;
          console.log("Connected to third")
          var t;
          console.log("Result is");
          console.log(result);
          console.log("Request starts from here");
          console.log(req.body);
        var userinfo=req.body
        res.render('result1',{result : result,userinfo:userinfo})
           console.log(req.body.area)
        //   console.log(result[0])
          db.close();
        });
      });
      
})

app.get('/result')

app.listen(3000, function()
{
    console.log("Server started at the port 3000...");
})

