var express = require("express");
var moment = require("moment");
var app=express();
var status;

// app.get('/', function(req, res){
//     jsonoutput = JSON.stringify({unix: null, natural: null});
//     res.send(jsonoutput);
// })
app.get('/new/:name', function(req,res){

    //detect if name is a URL
    //return output
    http.get(req.params.name, function(data){
        if (data.statusCode != 200){
            mystatus = "Could not load";
        }
        else {
            mystatus = "Loaded!";
        }
    });
    var jsonoutput = JSON.stringify({
        original_url: req.params.name,
        short_url: "http://dickorydock-shorturl.herokuapp.com/mememe",
        status: mystatus
    })
	res.send(jsonoutput);
})

app.listen(process.env.PORT, function(){
    console.log("App listening on port "+process.env.PORT)
})