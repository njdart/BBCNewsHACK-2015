var crypto = require('crypto');
var http = require('http');
var BBC_API_KEY = "YB0MY3VMHyllzPqEf5alVj5bUvGpvDVi";
var urls = ['http://www.bbc.co.uk/news/uk-england-kent-31982168'];

urls.map(function(url) { 
  getJuicerArticle(sha1URL(url)), print));
});

function print(data) {
 console.log(data);
}

function sha1URL(url) {
  var hash = crypto.createHash('sha1').update(url);
  url = hash.digest('hex');
  return url;
}

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
