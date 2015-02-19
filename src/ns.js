var request = require('request');
var querystring = require('querystring');
 
var debug = true;
 
var Auth; // Storage for authorization string (NS.Auth)
var NS = {};
var apiUrl = { "getStations": "stations-v2", "getDepartures": "avt", "getAdvise": "treinplanner", "getDisturbances": "storingen" };
 
/*
 * Authorization function
 * 
 * Set Auth variabele with username and password
 * @param required string `username`
 * @param required string `password`
 *
 */
 
NS.Auth = function(username, password) {
  Auth = "Basic " + new Buffer(username+":"+password).toString("base64");
  request({ url: 'http://webservices.ns.nl/ns-api-stations-v2', headers: { "Authorization": Auth } }, function(err, res, body) {
    if(res.statusCode === 401) {
      NS.Error('Wrong credentials');
    }
  });
};
 
NS.Error = function(err) {
  throw new Error(err);
};
 
 
/*
 * getStations
 * 
 * Retrieve all stations
 * @return xml element with all stations
 *
 */
 
NS.getStations = function(cb) {
  NS.Get('getStations', null, function(body) {
    cb(body);
  });
};
 
/*
 * getDepartures
 * 
 * Retrieve departures for a specified station
 * @param required string `station`; Station name
 * @return xml element with departures from specified station
 *
 */
 
NS.getDepartures = function(parameters, cb) {
  if(!parameters.station)
    NS.Error('No station specified');
    
  NS.Get('getDepartures', parameters, function(body) {
    cb(body);
  });
};
 
/*
 * getAdvise
 * 
 * Retrieve travel advise
 * @param required string `fromStation`; Station you want to travel from
 * @param required string `toStation`;  Station you want to travel to
 * @param string `viaStation`; Via station
 * @param int `previousAdvices`; Previous advises (max 5)
 * @param int `nextAdvices`; Next advises (max 5)
 * @param date `dateTime`; Date in ddMMyyyy-format
 * @param boolean `departure`; if true `dateTime` is departure time, else `dateTime` is arrival time
 * @param boolean `hslAllowed`; May travel advise contain high-speed trains (default true)
 * @param boolean `yearCard`; if user has yearcard, some advises will be more expensive but shorter (default false)
 * @return xml element with advises
 *
 */
 
NS.getAdvise = function(parameters, cb) {
  if(!parameters.fromStation)
    NS.Error('No fromStation specified');
  if(!parameters.toStation)
    NS.Error('No toStation specified');
  
  NS.Get('getAdvise', parameters, function(body) {
    cb(body);
  });
};
 
 
/*
 * getDisturbances
 * 
 * Retrieve disturbances
 * @param string `station`; Station name
 * @param boolean `actual`; true will return planned and unplanned disturbances
 * @param boolean `unplanned`; true will return planned disturbances
 * @return xml element with disturbances (all or just for a specified station)
 *
 */
 
NS.getDisturbances = function(parameters, cb) {
  NS.Get('getDisturbances', parameters, function(body) {
    cb(body);
  });
};
 
 
/*
 * Get function
 * 
 * Set Auth variabele with username and password
 * @param required string `type`; API Call
 * @param object `parameters`; Object with parameters
 * @param function `cb`; Callback function
 * @return xml response from NS-API
 *
 */
 
NS.Get = function(type, parameters, cb) {
  if(!type)
    NS.Error('Bad request');
  
  var url = 'http://webservices.ns.nl/ns-api-'+apiUrl[type];
  
  if(parameters)
    url = url+'?'+querystring.stringify(parameters);
  
  request({ url: url, headers: { "Authorization": Auth } }, function(err, res, body) {
    if(debug) {
      console.log(res.statusCode+' '+url);
    }
    if(res.statusCode === 401) NS.Error('Wrong credentials');
    if(res.statusCode !== 200) NS.Error('Unknown error');
    cb(body);
  });
};
 
module.exports = NS;
