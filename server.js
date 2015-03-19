var       http = require('http'),
       express = require('express'),
    bodyParser = require('body-parser'),
        exphbs = require('express-handlebars'),
           app = express(),
     sensitive = require('./sensitive.js'),
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

app.get('/testing', function(req, res){
  getArticleAsJSON(URIS.BBC, {"articleId":"6e825b2e5becd6c489ad9bef124b22b8d0450dcb"}, function(res){
    console.log(res);
  });
});

app.route('/run').post(function(req, res){
  post = req.body;
  getJSON(URIS.TIWTTER, { /* ALL OF THE TWITTER ARGUMENTS + LAT LONG */ }, getArticlesFromTweets(data, displayPage(articles)));
  renderPage('homepage', data, res);
});

/* 404 Route */
app.get('*', function(req, res){
  res.status(404).send("404, these are not the droids you are looking for.");
});

/* Start server */
server.listen(8000);
console.log("Server listening on localhost:8000");

/* ACTUAL FUNCTIONS THAT DO STUFF GO BELOW HERE */ 

var getArticlesFromTweets = function(tweets, callback) {

  // pass list of articles sorted by amount seen;
  // most popular -> least popular;

};

function displayPage(articles) { 
  renderPage('home', articles);
}

function getJSON(type, args, callback){
  var url = type.URI;
  url += args.articleId;
  url += type.API_BASE += BBC_API_KEY;


  console.log(url);

  http.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      callback(JSON.parse(body));
    });
  }).on('error', function(e) {
    console.log("Got error: ", e);
  });

}

/* Return a page with data included */
function renderPage(page, data, res) {
  res.render(page, {'data':data});
}

var URIS = {
  TWITTER: {
    URI : "foobar",
    "API_BASE" : ""
  },
  BBC: {
    "URI": "http://data.test.bbc.co.uk/bbcrd-juicer/articles/",
    "API_BASE" : "?apikey="
  }
};
