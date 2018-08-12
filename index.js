"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/webhook", function(req, res) {
    let fname = req.body.result.parameters['fname'];
    let typeofleave = req.body.result.parameters['typesofleave'];
    // Get the date (if present)
    let date = '';
    if (req.body.result.parameters['date']) {
      date = req.body.result.parameters['date'];
      console.log('Date: ' + date);
    }
    callWeatherApi(typeofleave, date, fname).then((output) => {
      // Return the results of the weather API to Dialogflow
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
      res.status(200).end();
    }).catch((error) => {
      // If there is an error let the user know
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
      res.status(500).end()
    });
  });
  function callWeatherApi (typeofleave, date, fname) {
    return new Promise((resolve, reject) => {
        var api_key = 'da20c74a96e8ea11e29701a8f1c3002b-7efe8d73-81263506';
        var DOMAIN = 'sandboxa2a27ba470ec4a368c8852e32fa578dd.mailgun.org';
        var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});
        
        var data = {
          from: `${fname}<chatbottestsender@gmail.com>`, // ANY EMAIL CAN BE USED HERE
          to: '<chatbotinternship@gmail.com>', // can only use <chatbotinternship@gmail.com> since its the only verified recipient
          subject: 'Hello',
          text: `Good day I'll be on ${typeofleave} until ${date}`
        };
        
        mailgun.messages().send(data, function (error, body) {
          console.log(body);
        });
        let output = `An email was sent to your manager`
        console.log(output);
        resolve(output);
        res.on('error', (error) => {
            reject(error);
          });
    });
    
  }
  
restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});