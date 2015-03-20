var bodyParser = require('body-parser'),
       express = require('express'),
          http = require('http'),
        exphbs = require('express-handlebars'),
       Twitter = require('twitter'),
           app = express(),
//   urlExpander = require('expand-url'),      /// Experimental
     sensitive = require('./sensitive.js'),
        crypto = require('crypto'),
         async = require('async'),
        server = require('http').createServer(app);

var client = new Twitter({
  consumer_key: sensitive.Consumer_Key,
  consumer_secret: sensitive.Consumer_Secret,
  access_token_key: sensitive.Access_Token,
  access_token_secret: sensitive.Access_Token_Secret
});

var BBC_API_KEY = "YB0MY3VMHyllzPqEf5alVj5bUvGpvDVi";  // http://docs.bbcnewslabs.co.uk/NewsHack-Wales.html

/* OH GOD WHY */
var articles = [];
var response;

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

app.get('/', function(req, res){
  //getJuicerArticle({"articleId":"6e825b2e5becd6c489ad9bef124b22b8d0450dcb"}, function(data){
    renderPage("home", null, res); // THIS NEEDS TO BE A LIST, BUT NOT HERE
  //});
});

app.route('/run').post(function(req, res) {
  articles = [];
  response = res;
  post = req.body;
  var twitterQuery = "bbc.co.uk OR news.sky.com";
  //var twitterQuery = "Xander_barnes";
  // post.lat = 53.1436732;
  // post.lng = -4.2727924;
  var locationData = post.lat + "," + post.lng + "," + post.radius + "mi";
  client.get('search/tweets', {q: twitterQuery,geocode:locationData, count:24, result_type: "recent"}, function(error, tweets, response) {
    getArticlesFromTweets(tweets); 
  });
});

/* 404 Route */
app.get('*', function(req, res){
  res.status(404).send("404, these are not the droids you are looking for.");
});

/* Start server */
server.listen(8000);
console.log("Server listening on http://localhost:8000");

/* ACTUAL FUNCTIONS THAT DO STUFF GO BELOW HERE */ 

function getArticlesFromTweets(tweets) {
  var results = [];
  //console.log(JSON.stringify(tweets, null, 2));
  tweets.statuses.map(function(item) {
    item.entities.urls.map(function(url) {
      if(url.expanded_url.length > 25) {
        results.push(sha1URL(url.expanded_url));
      }
    });
  });

  console.log(results);

  var reduced = [];
  var usedIds = {};
  results.forEach(function(result){
    if (!usedIds[result]) {
      reduced.push(result)
      usedIds[result] = 0;
    }
    usedIds[result] += 1;
  })

  console.log("REDUCED: " + JSON.stringify(usedIds));

  reduced = [];
  for(o in usedIds){
    console.log(o);
    console.log(usedIds[o])
    reduced.push({el:o, freq: usedIds[o]});
  }

  reduced.sort(function (a,b) {
    if (a.freq < b.freq)
       return -1;
    if (a.freq > b.freq)
      return 1;
    return 0;
  });

  console.log("Final: " + JSON.stringify(reduced));
  // var reduced = results.reduce(function(prev, curr, index, arry) {
  //   console.log(prev); 
  //   console.log(curr);
  //   console.log(index);
  //   console.log(arry);
  //   count = 0;
  //   arry.forEach(function(obj){
  //     if(obj === curr){
  //       count += 1;
  //     }
  //   })
  //   arry[index] = {
  //       item: curr,
  //       count: count
  //     };
  // }, []); 


  createArticleList(reduced);
}

function createArticleList(hashes) {
  async.map(hashes, getJuicerArticle, function(e, data) {
    console.log(articles);
    response.render('home', {layout: false, data:articles});
    //renderPage('home', articles, response);
  }); 
}

var getJuicerArticle = function(hash, callback){
  url = "http://data.test.bbc.co.uk/bbcrd-juicer/articles/";
  url += hash.el;
  url += "?apikey=" + BBC_API_KEY;
  //console.log("Generated URI: " + url + " FREQ: " + hash.freq);

  http.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var data = JSON.parse(body);
      if(data) {
        if(data.id) {
          data.freq = hash.freq;
          articles.push(data);
          console.log("HERE: " + articles.length);
        }  
      }
      callback();
    });
  }).on('error', function(e) {
    console.log("Got error: ", e);
  });
};

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

/* URL Expander */
///urlExpander.expand('http://bbc.in/1MOoEuU', function(err, longUrl){
  //console.log("LONG: " + longUrl);
//});
