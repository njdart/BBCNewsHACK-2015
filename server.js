var       http = require('http'),
       express = require('express'),
    bodyParser = require('body-parser'),
        exphbs = require('express-handlebars'),
       Twitter = require('twitter'),
           app = express(),
     sensitive = require('./sensitive.js'),
        server = require('http').createServer(app);

var client = new Twitter({
  consumer_key: sensitive.Consumer_Key,
  consumer_secret: sensitive.Consumer_Secret,
  access_token_key: sensitive.Access_Token,
  access_token_secret: sensitive.Access_Token_Secret
});

// client.get('search/tweets', {q: 'bbc.co.uk'}, function(error, tweets, response){
//   console.log(response);
// });

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
  getJSON(URIS.BBC, {"articleId":"6e825b2e5becd6c489ad9bef124b22b8d0450dcb"}, function(data){
    renderPage("home", JSON.stringify(data), res);
  });
});

app.route('/run').post(function(req, res){
  post = req.body;
  getJSON(URIS.TIWTTER, { /* ALL OF THE TWITTER ARGUMENTS + LAT LONG */ },
    getArticlesFromTweets(data));
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

  getJSON(BBC, { /* Article Ids */ }, createArticleList(article));

};

var createArticleList = function(article, callback) {

  var listOfArtciles = [];
  // add
  // check if done
  // render page 

};

function getJSON(type, args, callback){
  var url = type.URI;
  if(type == URIS.BBC){
    url += args.articleId;
    url += type.API_BASE += BBC_API_KEY;
  } else if(type == URIS.TWITTER){
    
  }

  console.log("Generaated URI: " + url);

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
