# ns-api
NS API Module written in Node.js

#### How to use
```
var NS = require('./src/ns');

NS.Auth('API Username', 'API Password');

NS.getStations(function(stations) {
  return stations; // List of stations
});
```

#### Documentation
The documentation can be found here: http://ns.nl/api/api

`(c) 2015 Jesse Reitsma <jesse@reitsma.co>`
