// require packages
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

// create a new server instance
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  // setup constants
  const query = req.body.location;
  const appid = "27b17f86758f8187ff03038d8e8eaf63";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + appid;

  https.get(url, (httpRes) => {
    console.log( httpRes.statusCode );

    httpRes.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temperature = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const iconId = weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + iconId + "@2x.png";

      res.write("<h1>The temperature in " + query + " is " + temperature + "degrees Celcius.</h1>");
      res.write("<h2> The skies are currently " + description + "</h2>");
      res.write("<img src=" + imageUrl + ">");
      res.send();
    })
  })
});

app.listen(3000, function(){
  console.log("Server running on port 3000.");
});
