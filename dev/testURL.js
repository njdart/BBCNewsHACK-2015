var crypto = require('crypto');
var http = require('http');
var JUICER_API_KEY = "YB0MY3VMHyllzPqEf5alVj5bUvGpvDVi";
var urls = [
  'http://www.bbc.co.uk/news/science-environment-31965456',
  'http://news.sky.com/story/1448732/north-korea-defectors-are-human-scum',
  'http://www.independent.co.uk/news/world/asia/north-korea-ready-anytime-for-nuclear-war-as-diplomat-calls-defectors-animals-and-scum-10121587.html',
  'http://www.theguardian.com/education/2015/mar/20/labour-calls-time-on-exam-factory-approach-to-schooling',
  'http://www.ft.com/cms/s/eb98baa4-ce49-11e4-86fc-00144feab7de,Authorised=false.html?_i_location=http%3A%2F%2Fwww.ft.com%2Fcms%2Fs%2F0%2Feb98baa4-ce49-11e4-86fc-00144feab7de.html%3Fsiteedition%3Duk&siteedition=uk&_i_referer=http%3A%2F%2Fwww.ft.com%2Fhome%2Fuk#axzz3Uv0Y2KoV',
  http://www.telegraph.co.uk/finance/economics/11484544/Europe-squeezes-more-reforms-from-Greece-as-Merkel-steps-into-bail-out-talks.html',
  'http://www.southwales-eveningpost.co.uk/Adam-Jones-linked-English-Harlequins/story-26202114-detail/story.html',
  'http://www.walesonline.co.uk/news/wales-news/stag-party-thrown-ryanair-flight-8880743',
  'http://www.newstatesman.com/culture/2015/03/so-hot-right-now-peppers-prove-theres-perv-all-us',
  'http://www.thetimes.co.uk/tto/life/motoring/article4387712.ece',
  'http://www.bbc.co.uk/sport/0/football/31899097',
  'http://www.bbc.co.uk/sport/football/teams/cardiff-city/results',
  'http://www.telegraph.co.uk/news/picturegalleries/picturesoftheday/11451022/Pictures-of-the-day-5-March-2015.html?frame=3220760',
  'http://www.bbc.co.uk/weather/2654092'
  ];
urls.map(function(url) { 
  getJuicerArticle(sha1URL(url), url);
});

function sha1URL(url) {
  var hash = crypto.createHash('sha1').update(url);
  url = hash.digest('hex');
  return url;
}

function getJuicerArticle(hash, source){
  url = "http://data.test.bbc.co.uk/bbcrd-juicer/articles/";
  url += hash;
  url += "?apikey=" + JUICER_API_KEY;
  //console.log("Generated URI: " + url);

  http.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var result = JSON.parse(body).id;
      if(result) {
        console.log("[+] " + source);
      } else {
        console.log("   [-] " + source);
      }
    });
  }).on('error', function(e) {
    console.log("ERROR: ", e);
  });
}
