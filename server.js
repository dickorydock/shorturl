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
    //detect if name is a URL
    //if it is not a proper http, return 'could not load' status
    if (req.params.name.substr(0,4).toLowerCase() != "http")
        {
        mystatus = "Could not load";
        res.json({url_part1: req.params.name,
                 url_part2: req.params[0],
                 status: mystatus
            });
        
        }
    http.get(req.params.name+req.params[0], function(thisres){
        var wwwpath = req.params[0].substr(2, req.params[0].length-2);

        //do not look for the site unless it returns a 200 status code
        if (thisres.statusCode != 200){
            loadstatus = "Could not load";
        }

        //otherwise, find the site in the MongoDB list!
        else {
            //indicate that the site is a working URL
            loadstatus = "Loaded!";

            //prepare the database
            mongo.connect("mongodb://dickorydock:$iderHouseRul3z@ds145365.mlab.com:45365/urlrosetta", function(err, db) {
                var shorturl = db.collection("shorturl");
                //find maximum site number
                shorturl.find().sort({site_number:-1}).limit(1).toArray(function(err,documents){
                    max_site_number = documents[0]["site_number"];
                })
                //look for the site in the existing database
                shorturl.find(
                   {original_url: wwwpath}
                 , {_id: 0, original_url: 1,short_url: 1, site_number:1})
                .toArray(function(err,documents){    
                    //if we found it, no need to add it again -- just return the existing site number
                    if (documents.length>0){
                        var sitenumber = documents[0]["site_number"];
                    }
                    //if we didn't find the working URL, add it
                    else {
                        var sitenumber = max_site_number + 3;
                        var newsitejson={original_url: wwwpath, site_number: sitenumber}
                        shorturl.insert(newsitejson)
                    }

                    //return the info about the short link
                    res.json({original_url:  req.params.name+"://"+wwwpath,
                        short_url: "http://dickorydock-shorturl.herokuapp.com/"+sitenumber
                        });
                  db.close()
                })
            })
        }
    
    })
    //if there is an error in finding the site in the URL, return 'could not load' status
    .on('error', function(e){
        console.error(e.code);
        loadstatus = "Could not load";
             res.json({error: "Not a valid URL - try again."})
           
    })
})


app.get('/:shortnum*', function(req,res){
   var sitenumber = parseInt(req.params.shortnum);
   var siteextra = req.params[0];
   if (siteextra.length > 0){
        res.json({error: "Not a valid reference - try again."})
   }
   else {
    mongo.connect("mongodb://dickorydock:$iderHouseRul3z@ds145365.mlab.com:45365/urlrosetta", function(err, db) {
        var shorturl = db.collection("shorturl");
        //look for the site in the existing database, and either redirect or give an error
        shorturl.find(
           {site_number: sitenumber}
         , {_id: 0, original_url: 1,short_url: 1, site_number:1})
        .toArray(function(err,documents){ 
            if (documents.length>0){
            res.redirect("http://"+documents[0]["original_url"])
            }
            else if (documents.length == 0){
                res.json({error: "Not a valid reference - try again."})
            }
          db.close()
         })

    })

    }

})
app.listen(process.env.PORT, function(){
    console.log("App listening")
});

