var       http = require('http'),
       express = require('express'),
    bodyParser = require('body-parser'),
        exphbs = require('express-handlebars'),
           app = express(),
        server = require('http').createServer(app);

var BBC_API_KEY = "YB0MY3VMHyllzPqEf5alVj5bUvGpvDVi";  // http://docs.bbcnewslabs.co.uk/NewsHack-Wales.html

/* Express settings */
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 /* Handlebar settings */
app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
  helpers: {
    foo: function () { return 'FOO!'; }
  },
}));
app.set('view engine', 'handlebars');

/* Render home */
app.get('/', function(req, res){
  renderPage('home', null, res);
});

/* 404 Route */
app.get('*', function(req, res){
  res.status(404).send("404, these are not the droids you are looking for.");
});

/* Start server */
server.listen(8000);
console.log("Server listening on localhost:8000");

/* ACTUAL FUNCTIONS THAT DO STUFF GO BELOW HERE */ 

/* Ignore this for a while */
function getArticle() {
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
}

/* Return a page with data included */
function renderPage(page, data, res) {
  res.render(page, {'data':data});
}
