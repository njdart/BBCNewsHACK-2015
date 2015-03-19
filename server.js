var bodyParser = require('body-parser'),
       express = require('express'),
          http = require('http'),
        exphbs = require('express-handlebars'),
       Twitter = require('twitter'),
           app = express(),
     sensitive = require('./sensitive.js'),
        crypto = require('crypto'),
        server = require('http').createServer(app);

var client = new Twitter({
  consumer_key: sensitive.Consumer_Key,
  consumer_secret: sensitive.Consumer_Secret,
  access_token_key: sensitive.Access_Token,
  access_token_secret: sensitive.Access_Token_Secret
});

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
  getJuicerArticle({"articleId":"6e825b2e5becd6c489ad9bef124b22b8d0450dcb"}, function(data){
    renderPage("home", [data, data, data, data], res); // THIS NEEDS TO BE A LIST, BUT NOT HERE
  });
});

app.get('/run').post(function(req, res) {
  post = req.body;
  var twitterQuery = "bbc.co.uk OR news.sky.com";
  var locationData = post.lat + "," + post.lng + "," + post.radius + "mi";
  client.get('search/tweets', {q: twitterQuery, geocode:locationData, count:16}, function(error, tweets, response) {
    getArticlesFromTweets(tweets); //, renderPage('home', data)); // NICK FIX IT
  });
  //renderPage('home', data, res);
});

/* 404 Route */
app.get('*', function(req, res){
  res.status(404).send("404, these are not the droids you are looking for.");
});

/* Start server */
server.listen(8000);
console.log("Server listening on http://localhost:8000");

/* ACTUAL FUNCTIONS THAT DO STUFF GO BELOW HERE */ 

var getArticlesFromTweets = function(tweets) { //, callback) {
  var results = [];
  //console.log(JSON.stringify(tweets));
  tweets.statuses.forEach(function (status){
    status.entities.urls.forEach(function (url){
      results.push(url.expanded_url);
    });
  });
  console.log(JSON.stringify(results));
  console.log("Now we need to validate these URL's on juicer with the SHA1 function");
};

var createArticleList = function(article, callback) {

  var listOfArtciles = [];
  // add
  // check if done
  // render page 

};

function getJuicerArticle(args, callback){
  url = "http://data.test.bbc.co.uk/bbcrd-juicer/articles/";
  url += args.articleId;
  url += "?apikey=" + BBC_API_KEY;

  console.log("Generated URI: " + url);

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

/* Has a news article URL to use on juicer */
function sha1URL(url) {
  var hash = crypto.createHash('sha1').update(url);
  url = hash.digest('hex');
  return url;
}

/* Return a page with data included */
function renderPage(page, data, res) {
  res.render(page, {'data':data});
}
