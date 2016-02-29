require('dotenv').load()

// Twitter
var Twitter = require('twitter')
var twitterClient = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})
var twitterHandle = 'tylernappy'
//

// Rate limiter
var RateLimiter = require('limiter').RateLimiter
var limiter = new RateLimiter(2, 'second')
//

// Haven OnDemand
var havenondemand = require('havenondemand')
var hodClient = new havenondemand.HODClient(process.env.HPE_APIKEY)
//

// Twitter stream
twitterClient.stream('statuses/filter', {track: twitterHandle}, function(stream) {
  stream.on('data', function(tweet) {
    var text = tweet.text
    limiter.removeTokens(1, function(err, remainingRequests) {
    // Haven OnDemand
      var data = {text: text}
      hodClient.call('analyzesentiment', data, function(err, resp, body) {
        if (resp) {
          if (resp.body) {
            var sentiment = resp.body.aggregate.sentiment
            var score = resp.body.aggregate.score
            console.log(text + " | " + sentiment + " | " + score)
            console.log("----------------------------------------------")
          }
        }
      })
    //
    })
  })

  stream.on('error', function(error) {
    throw error
  })
})
//
