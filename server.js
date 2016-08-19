var express = require("express");
var moment = require("moment");
var http = require("http");
var express = require("express");
var moment = require("moment");
var http = require("http");
var app=express();
var mystatus="";

var mongo = require('mongodb').MongoClient;


/******************************
****** URL SHORTENER **********
******************************/


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
         , {_id: 0, original_url: 1, site_number:1})
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

/******************************
****** IMAGE SEARCH **********
******************************/

var imgurClientID = "96eb18eadc6b134";
var imgurClientSecret = "246c6b2d1fd8533d8c6a841e2044aba86428ea13";

app.get('/imagesearch/search/:searchstring', function(req,res){

  //getting offset parameter from URL
  offsetString = "";
  if (parseInt(req.query.offset)>0){
    offsetString = parseInt(req.query.offset);
  }

  //making the request to imgur API
  request({
  url: 'https://api.imgur.com/3/gallery/search/top/'+offsetString+'?q='+req.params.searchstring,
  method: 'GET',
  headers: {
    Authorization: 'Client-ID ' + imgurClientID,
    Accept: 'application/json'
  }
}, 
  //processing what the API returned: print to the user
 function(error, response, body){
    if (JSON.parse(body).data.length > 0){
        myresponse = JSON.parse(body).data.slice(0,JSON.parse(body).data.length);
        yourresponse = [];
        for (i=0; i<JSON.parse(body).data.length; i++){
            if (myresponse[i].hasOwnProperty("cover"))
                { coverid = myresponse[i].cover; }
            else coverid = myresponse[i].id;
            yourresponse.push({url:"http://i.imgur.com/"+coverid+".jpg", 
                               thumbnail:"http://i.imgur.com/"+coverid+"m.jpg", 
                               album: "http://imgur.com/gallery/"+myresponse[i].id,
                               alttext: myresponse[i].title
                           });
        }
        res.json(yourresponse)
    }
    else res.end("Could not complete the search. Try another term or a different offset.")
});
  //add the search string to the database
  //prepare the database
    mongo.connect("mongodb://dickorydock:$iderHouseRul3z@ds145365.mlab.com:45365/urlrosetta", function(err, db) {
        var imagesearch = db.collection("imagesearch");
        var newsearchstring={search_term: req.params.searchstring, search_time: new Date()};
        imagesearch.insert(newsearchstring);
        db.close()
    })
})

/*adding a method for people who want to see all the previous searches*/
app.get('/imagesearch/latest/', function(req,res){
 mongo.connect("mongodb://dickorydock:$iderHouseRul3z@ds145365.mlab.com:45365/urlrosetta", function(err, db) {
    var imagesearch = db.collection("imagesearch");
    imagesearch.find({},{_id: 0, search_term: 1, search_time: 1}).sort({search_time:-1}).toArray(function(err, documents){
        res.end(JSON.stringify(documents.slice(0,10)));
    });
    db.close()
    })
});
app.listen(process.env.PORT, function(){
    console.log("App listening")
});

