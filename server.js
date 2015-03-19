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

client.get('search/tweets', {q: 'news', count:16}, function(error, tweets, response) {
  //console.log(JSON.parse(response.body));                        //.entities);//.urls.expanded_url);
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
  getJSON(URIS.BBC, {"articleId":"6e825b2e5becd6c489ad9bef124b22b8d0450dcb"}, function(data){
    renderPage("home", [data, data, data, data], res); // THIS NEEDS TO BE A LIST, BUT NOT HERE
  });
});

app.route('/run').post(function(req, res){
  post = req.body;
  getJSON(URIS.TIWTTER, { /* ALL OF THE TWITTER ARGUMENTS + LAT LONG */ }, getArticlesFromTweets(data));
  renderPage('homepage', data, res);
});

/* 404 Route */
app.get('*', function(req, res){
  res.status(404).send("404, these are not the droids you are looking for.");
});

/* Start server */
server.listen(8000);
console.log("Server listening on http://localhost:8000");

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

var testdata = [{
  "description":"Chancellor George Osborne denies Labour claims he is planning deeper spending cuts than in the past few years, as the pre-election battle over the economy steps up a gear.","source":{"source-uuid":"4b9b4468-1395-4a38-b580-82618d0cc90b","source-id":1,"source-name":"BBC News"},"title":"Budget 2015: Election battle over spending cuts","concepts":[{"generic-type":"http://dbpedia.org/ontology/Organisation","count":1,"surface_form":"NHS","uri":"http://dbpedia.org/resource/National_Health_Service_(England)","label":"NHS","score":0.5742331032941506,"types":["http://dbpedia.org/ontology/Organisation","http://schema.org/GovernmentOrganization","http://dbpedia.org/ontology/GovernmentAgency","http://www.w3.org/2002/07/owl#Thing","http://dbpedia.org/ontology/Agent","http://schema.org/Organization"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":2,"surface_form":"BBC","uri":"http://dbpedia.org/resource/BBC","label":"BBC","score":0.5337887834242889,"types":["http://www.w3.org/2002/07/owl#Thing","http://dbpedia.org/ontology/Agent","http://schema.org/Organization","http://dbpedia.org/ontology/Organisation","http://dbpedia.org/ontology/Company"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":1,"surface_form":"BBC Radio","uri":"http://dbpedia.org/resource/BBC_Radio","label":"BBC Radio","score":0.5201351529158627,"types":["http://schema.org/Organization","http://dbpedia.org/ontology/Organisation","http://dbpedia.org/ontology/Company","http://www.w3.org/2002/07/owl#Thing","http://dbpedia.org/ontology/Agent"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":1,"surface_form":"UKIP","uri":"http://dbpedia.org/resource/UK_Independence_Party","label":"UKIP","score":0.5197057308626851,"types":["http://dbpedia.org/ontology/PoliticalParty","http://www.w3.org/2002/07/owl#Thing","http://dbpedia.org/ontology/Agent","http://schema.org/Organization","http://dbpedia.org/ontology/Organisation"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":1,"surface_form":"Plaid","uri":"http://dbpedia.org/resource/Plaid_Cymru","label":"Plaid","score":0.5182500729933153,"types":["http://dbpedia.org/ontology/PoliticalParty","http://www.w3.org/2002/07/owl#Thing","http://dbpedia.org/ontology/Agent","http://schema.org/Organization","http://dbpedia.org/ontology/Organisation"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":1,"surface_form":"Office for Budget Responsibility","uri":"http://dbpedia.org/resource/Office_for_Budget_Responsibility","label":"Office for Budget Responsibility","score":0.5171796514990938,"types":["http://www.w3.org/2002/07/owl#Thing","http://dbpedia.org/ontology/Agent","http://schema.org/Organization","http://dbpedia.org/ontology/Organisation"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":1,"surface_form":"Parliament","uri":"http://dbpedia.org/resource/Parliament_of_the_United_Kingdom","label":"Parliament (UK)","score":0.5169394851563278,"types":["http://dbpedia.org/ontology/Organisation","http://dbpedia.org/ontology/Legislature","http://www.w3.org/2002/07/owl#Thing","http://dbpedia.org/ontology/Agent","http://schema.org/Organization"]},{"generic-type":"http://dbpedia.org/ontology/Person","count":1,"surface_form":"Robert Peston","uri":"http://dbpedia.org/resource/Robert_Peston","label":"Robert Peston","score":0.5059301789150483,"types":["http://dbpedia.org/ontology/Agent","http://schema.org/Person","http://www.w3.org/2002/07/owl#Thing","http://xmlns.com/foaf/0.1/Person","http://dbpedia.org/ontology/Person"]},{"generic-type":"http://dbpedia.org/ontology/Person","count":1,"surface_form":"Chancellor George Osborne","uri":"http://dbpedia.org/resource/George_Osborne","label":"Chancellor George Osborne","score":0.48424980485295244,"types":["http://www.w3.org/2002/07/owl#Thing","http://xmlns.com/foaf/0.1/Person","http://dbpedia.org/ontology/Person","http://dbpedia.org/ontology/OfficeHolder","http://dbpedia.org/ontology/Agent","http://schema.org/Person"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":3,"surface_form":"Conservatives","uri":"http://dbpedia.org/resource/Conservative_Party_(UK)","label":"Conservatives (UK)","score":0.4796229113910928,"types":["http://www.w3.org/2002/07/owl#Thing","http://dbpedia.org/ontology/Agent","http://schema.org/Organization","http://dbpedia.org/ontology/Organisation","http://dbpedia.org/ontology/PoliticalParty"]},{"generic-type":"http://dbpedia.org/ontology/Person","count":2,"surface_form":"Danny Alexander","uri":"http://dbpedia.org/resource/Danny_Alexander","label":"Danny Alexander","score":0.466191572458049,"types":["http://dbpedia.org/ontology/OfficeHolder","http://dbpedia.org/ontology/Agent","http://schema.org/Person","http://www.w3.org/2002/07/owl#Thing","http://xmlns.com/foaf/0.1/Person","http://dbpedia.org/ontology/Person"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":1,"surface_form":"the BBC News","uri":"http://dbpedia.org/resource/BBC_News","label":"The BBC News","score":0.45558733102520943,"types":["http://dbpedia.org/ontology/Agent","http://schema.org/Organization","http://dbpedia.org/ontology/Organisation","http://dbpedia.org/ontology/Company","http://www.w3.org/2002/07/owl#Thing"]},{"generic-type":"http://dbpedia.org/ontology/Person","count":1,"surface_form":"Martin Lewis","uri":"http://dbpedia.org/resource/Martin_Lewis_(financial_journalist)","label":"Martin Lewis (financial journalist)","score":0.45049998737419383,"types":["http://dbpedia.org/ontology/Agent","http://schema.org/Person","http://www.w3.org/2002/07/owl#Thing","http://xmlns.com/foaf/0.1/Person","http://dbpedia.org/ontology/Person"]},{"generic-type":"http://dbpedia.org/ontology/Person","count":2,"surface_form":"Ed Balls","uri":"http://dbpedia.org/resource/Ed_Balls","label":"Ed balls","score":0.4483169926643584,"types":["http://www.w3.org/2002/07/owl#Thing","http://xmlns.com/foaf/0.1/Person","http://dbpedia.org/ontology/Person","http://dbpedia.org/ontology/Politician","http://dbpedia.org/ontology/Agent","http://schema.org/Person"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":2,"surface_form":"Lib Dem","uri":"http://dbpedia.org/resource/Liberal_Democrats","label":"Lib Dem","score":0.44719368213380895,"types":["http://dbpedia.org/ontology/PoliticalParty","http://www.w3.org/2002/07/owl#Thing","http://dbpedia.org/ontology/Agent","http://schema.org/Organization","http://dbpedia.org/ontology/Organisation"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":1,"surface_form":"the SNP","uri":"http://dbpedia.org/resource/Scottish_National_Party","label":"The SNP","score":0.43941270181382164,"types":["http://schema.org/Organization","http://dbpedia.org/ontology/Organisation","http://dbpedia.org/ontology/PoliticalParty","http://www.w3.org/2002/07/owl#Thing","http://dbpedia.org/ontology/Agent"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":2,"surface_form":"Buy","uri":"http://dbpedia.org/resource/Rakuten.com","label":"Buy","score":0.43193364983826354,"types":["http://dbpedia.org/ontology/Agent","http://schema.org/Organization","http://dbpedia.org/ontology/Organisation","http://dbpedia.org/ontology/Company","http://www.w3.org/2002/07/owl#Thing"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":1,"surface_form":"Wednesday","uri":"http://dbpedia.org/resource/Sheffield_Wednesday_F.C.","label":"Wednesday","score":0.4256910637156457,"types":["http://www.w3.org/2002/07/owl#Thing","http://dbpedia.org/ontology/Agent","http://schema.org/Organization","http://dbpedia.org/ontology/Organisation","http://schema.org/SportsTeam","http://dbpedia.org/ontology/SportsTeam","http://dbpedia.org/ontology/SoccerClub"]},{"generic-type":"http://dbpedia.org/ontology/Organisation","count":2,"surface_form":"savers","uri":"http://dbpedia.org/resource/Savers","label":"Savers","score":0.4147517801748335,"types":["http://dbpedia.org/ontology/Agent","http://schema.org/Organization","http://dbpedia.org/ontology/Organisation","http://dbpedia.org/ontology/Company","http://www.w3.org/2002/07/owl#Thing"]}],"id":"9de77ae4ae4f60738bcf18d004bf48a5711a05ab","url":"http://www.bbc.co.uk/news/uk-politics-31956459","image":"http://news.bbcimg.co.uk/media/images/81758000/gif/_81758290_budgetcomposite.gif","body":"Chancellor George Osborne has denied his planned cuts after the general election would be tougher than the austerity of the past few years.\n\nMr Osborne said public service cuts would be balanced by welfare savings and action against tax avoidance.\n\nShadow chancellor Ed Balls said he would not reverse any of the measures in Wednesday's \"pretty empty\" Budget.\n\nBut he said Mr Osborne would be forced to put VAT up and cut NHS services to make his overall sums add up.\n\nLib Dem Treasury Secretary Danny Alexander will announce new coalition measures to tackle tax evasion later and set out his own party's tax and spending plans for the next five years.\n\nThe three men's tour of media outlets came the morning after Mr Osborne used the Budget to draw the battle lines for the general election in seven weeks' time.\n\nMr Balls said it was \"good\" that Mr Osborne had announced help for savers in the Budget and he thought the new Help to Buy ISA was an \"interesting idea\", which would not be scrapped if Labour wins power in May.\n\nUnder the Help to Buy ISA, which comes into effect in the Autumn, first-time home buyers putting money aside for a deposit will have their savings topped up by the government, to the tune of £50 for every £200 saved.\n\nMr Balls said Labour would also keep the rise in the personal tax allowance, which will go up from £10,600 to £11,000 by 2016-7.\n\n\"What I will reverse is a plan for deeper spending cuts in the next three years than the last five.\n\n\"I think that is a really risky and dangerous prospect for our country. I think he'll end up cutting the National Health Service or raising VAT.\"\n\nHe said Labour had a plan to cut the deficit with a more \"sensible\" mix of spending cuts and tax increases on the better-off - and it would also axe what it calls the \"bedroom tax\".\n\nBut he said Mr Osborne's Budget had not \"changed the fundamental picture\", with 49 days to go to the general election.\n\n\"I thought it was quite empty. I didn't think there was too much in it,\" he told BBC Radio 4's Today programme.\n\nLib Dem Treasury Secretary Danny Alexander said his party would not rely solely on spending cuts to pay off the deficit.\n\n\"The Conservatives are going in a more extreme direction with all the focus on reducing the size of the state. I don't think that's right.\n\n\"I also want to make sure that we can invest in our National Health Service; that we can reward public sector workers whose pay restraint has been a key part of balancing the books in this parliament and that's the different proposition that I'll be setting out today.\"\n\nBut Mr Osborne sought to play down the scale of the cuts he is planning to public spending, insisting money would also be raised by slashing the welfare budget and cracking down on tax avoidance.\n\n\"I'm not proposing deeper cuts than the ones over the last five years, I'm proposing the same pace of cuts for the next couple of years as we had over the last five - because we're making those other decisions on welfare and indeed tax evasion and avoidance.\"\n\nOn Wednesday, in his final set-piece pitch to voters before May's election, Mr Osborne announced that if the Conservatives won power, the first £1,000 of savings interest would be tax free - meaning 95% of savers would pay no tax.\n\nOther measures announced in the Budget included:\n\nMr Osborne hailed slightly better-than-expected growth figures, which suggest the economy will expand by 2.5% this year, and said the government had met its 2010 target to end this Parliament with Britain's national debt falling as a share of GDP.\n\nHe said he would use a boost in the public finances caused by lower inflation and welfare payments to pay off some of the national debt and end the squeeze on public spending a year earlier than planned.\n\nIn 2019/20 spending will grow in line with the growth of the economy - bringing state spending as a share of national income to the same level as in 2000, he said.\n\nBut despite Mr Osborne relaxing his plans, shadow chancellor Ed Balls said the Treasury's own figures showed spending at the \"lowest level since 1938\" in 2018/19.\n\nThe independent Office for Budget Responsibility said Mr Osborne's plans implied \"a much sharper squeeze on real spending in 2016-17 and 2017-18 than anything seen over the past five years, followed by the biggest increase in real spending for a decade in 2019-20\", a pattern it described as a \"rollercoaster profile\".\n\nBBC economics editor Robert Peston said the Conservatives believed this critique was unfair as more than a third of the cuts earmarked for the first two years would come from welfare rather than departmental spending - though these had not been spelt out.\n\nMr Osborne's sixth Budget statement, which came against a backdrop of a strengthening economic recovery, a fresh fall in unemployment and inflation at historic lows, was also criticised by UKIP, the Green Party, the SNP and Plaid Cymru.\n\nBut business groups said it would provide \"stability and consistency\".\n\nDo you have a question about the Budget? We will be putting a selection of your questions to Martin Lewis of moneysavingexpert.com at 11.30 GMT on the BBC News Channel. You can send us your questions by emailing haveyoursay@bbc.co.uk. If you are available to speak to a BBC journalist, please include a contact telephone number.\n\nHave your say","authors":[],"feed-id":1,"published":"2015-03-19T01:43:04Z"
}];
