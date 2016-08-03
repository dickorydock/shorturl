var express = require("express");
var moment = require("moment");
var app=express();

// app.get('/', function(req, res){
//     jsonoutput = JSON.stringify({unix: null, natural: null});
//     res.send(jsonoutput);
// })
app.get('/new/:name', function(req,res){

    //detect if name is a URL
    // console.log(name);
    //return output
    var jsonoutput = JSON.stringify({
        original_url: "shortstop",
        short_url: "http://dickorydock-shorturl.herokuapp.com/mememe"
    })
	res.send(jsonoutput);
})

app.listen(process.env.PORT, function(){
    console.log("App listening on port "+process.env.PORT)
})