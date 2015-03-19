// Load the http module to create an http server.
var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    server = require('http').createServer(app);

/* Express settings */
app.use(express.static(__dirname + '/images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* Start server */
server.listen(8000);
console.log("Server listening on localhost:8000");

var url = "http://data.test.bbc.co.uk/bbcrd-juicer/articles/9de77ae4ae4f60738bcf18d004bf48a5711a05ab?apikey=YB0MY3VMHyllzPqEf5alVj5bUvGpvDVi";

http.get(url, function(res) {
  var body = '';

  res.on('data', function(chunk) {
    body += chunk;
  });

  res.on('end', function() {
    var response = JSON.parse(body);
    console.log("Got response: %j", response);
  });
}).on('error', function(e) {
  console.log("Got error: ", e);
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");
