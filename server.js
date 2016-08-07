var express = require("express");
var moment = require("moment");
var http = require("http");
var express = require("express");
var moment = require("moment");
var http = require("http");
var app=express();
var mystatus="";

var mongo = require('mongodb').MongoClient;

app.get('/new/:name*', function(req,res){
    console.log("worked")
    //detect if name is a URL
    //return output
    if (req.params.name.substr(0,4).toLowerCase() != "http")
    {
    mystatus = "Could not load";
    res.json({url_part1: req.params.name,
        url_part2: req.params[0],
        status: mystatus
        });
        
    }
    http.get(req.params.name+req.params[0], function(thisres){
        if (thisres.statusCode != 200){
            mystatus = "Could not load";
        }
        else {
            mystatus = "Loaded!";
        }
    
    res.json({url_part1: req.params.name,
        url_part2: req.params[0],
        status: mystatus
        });
    }).on('error', function(e){
        console.error(e.code);
    mystatus = "Could not load";
    res.json({url_part1: req.params.name,
        url_part2: req.params[0],
        status: mystatus
        });
    

    })
})

app.listen(process.env.PORT, function(){
    console.log("App listening")
});


mongo.connect("mongodb://dickorydock:$iderHouseRul3z@ds01316.mlab.com:1316/urlrosetta", function(err, db) {
  if (err) throw err;
  var thiscollection = db.collection("shorturl");
  var jsonobject = {original_url: "mememe", new_url: "youyouyou"};
  thiscollection.insert(jsonobject, function(err, data){
   console.log(JSON.stringify(jsonobject));
    });
  db.close();
  });


    // mystatus = "no http.get";
    // var jsonoutput = JSON.stringify({
    //     original_url: req.params.name,
    //     short_url: "http://dickorydock-shorturl.herokuapp.com/mememe",
    //     status: mystatus
    // })
//process.env.PORT
    // console.log("App listening on port "+process.env.PORT)
    // http.get(req.params.name, function(data){
        // console.log(data);
    // });
    // http.get("http://"+req.params.name, function(thisreq){
    //     console.log(thisreq.statusCode);
    // });
    // http.get(req.params.name+req.params[0], function(err, data){

/*
app.get('/', function(req, res){
    var myipaddress = req.headers["x-forwarded-for"];
    var mylanguage = req.headers["accept-language"].split(",")[0];
    var mysoftware_pre = req.headers["user-agent"];
    var mysoftware = mysoftware_pre.slice(mysoftware_pre.indexOf('(') +1,mysoftware_pre.indexOf(')'));
    var jsonoutput = JSON.stringify({
                 ipaddress: myipaddress,
                 language: mylanguage,
                 software: mysoftware });
    res.send(jsonoutput);
})



app.listen(8080, function(){
    console.log("Listening on port 8080")
})
*/


// app.get('/', function(req, res){
//     jsonoutput = JSON.stringify({unix: null, natural: null});
//     res.send(jsonoutput);
// })
// app.get('/*', function(req,res){
//     console.log("this");
// })

