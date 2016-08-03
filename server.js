var express = require("express");
var moment = require("moment");
var app=express();

var jsonoutput;



app.get('/', function(req, res){
    jsonoutput = JSON.stringify({unix: null, natural: null});
    res.send(jsonoutput);
})
app.get('/:name', function(req,res){
	//if it's not a valid name, then return null
    ///check if it's an integer aka unixtime
    arg = req.params.name;
    if (String(parseInt(arg)) == arg){
    	momentDate = moment(parseInt(arg, 10)*1000).utc();
		jsonoutput = JSON.stringify({
			         unix:parseInt(arg),
		             natural: momentDate.format('MMMM DD, YYYY')});
    }
	else if (Date.parse(arg)==null){
		jsonoutput = JSON.stringify({unix: null, natural: null});
	}
    else if (Date.parse(arg)!=null){
    	console.log("parsed");
    	var myDate = new Date(Date.parse(req.params.name));
    	console.log(myDate);
    	console.log(new Date(req.params.name));
    	offset = myDate.getTimezoneOffset() ; 
    	unixtime = myDate.getTime()   -  60000 * offset;
    	momentDate = moment(unixtime).utc();
		jsonoutput = JSON.stringify({
			         unix: parseInt(momentDate.format('X')),
		             natural: momentDate.format('MMMM D, YYYY')});
	}

	res.send(jsonoutput);
})

app.listen(process.env.PORT, function(){
    console.log("Example app listening on port 8080!")
})