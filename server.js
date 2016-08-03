var express = require("express");
var moment = require("moment");
var http = require("http");
var app=express();
var status;

// app.get('/', function(req, res){
//     jsonoutput = JSON.stringify({unix: null, natural: null});
//     res.send(jsonoutput);
// })
app.get('/new/http://:name', function(req,res){

    //detect if name is a URL
    //return output
    console.log(typeof(req.params.name))
    // http.get(req.params.name, function(data){
        // console.log(data);
    // });
    http.get("http://"+req.params.name, function(thisreq){
        console.log(thisreq.statusCode);
    });
    // http.get(req.params.name, function(data){
    //     if (data.statusCode != 200){
    //         mystatus = "Could not load";
    //     }
    //     else {
    //         mystatus = "Loaded!";
    //     }
    // });
    var jsonoutput = JSON.stringify({
        original_url: req.params.name,
        short_url: "http://dickorydock-shorturl.herokuapp.com/mememe",
        status: "there it is"
    })
	res.send(jsonoutput);
})

app.listen(process.env.PORT, function(){
    console.log("App listening on port "+process.env.PORT)
})