// api call - predict the sky
/* var queryURL = "http://api.predictthesky.org/events/all"

$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
  });
 */
// api call - geolocation

// on submit -- convery city to lat/lon and pull relevant data from predict the sky

// rss with up to date nasa news?

/* var predictTheSkyUrl = "http://www.adamretter.org.uk/spaceapps/space.xql?lat=latitude&lng=longitude&format=json&jsonp=?&nextClear=true";
   var predictTheSkyUrl = "http://www.adamretter.org.uk/spaceapps/space.xql?lat=50.7218&lng=-3.5336&format=json&jsonp=getNextClearEvent&nextClear=true";
   var predictTheSkyUrl = "http://api.predictthesky.org/events/all/?lat=50.7218&lng=-3.5336&format=json";
   var predictTheSkyUrl = "http://api.predictthesky.org/events/all/?lat=50.7218&lng=-3.5336";

// function getNextEventAndWeather(latitude, longitude) {
//     var urlForThisLocation = predictTheSkyUrl.replace("latitude", latitude).replace("longitude", longitude);
    $.ajax({
        url: predictTheSkyUrl,
        dataType: "json",
        type: 'GET',
    }).then(function(response) {
        console.log(response);
      }); */

// this shit dont work
// var queryURL = "http://star-api.herokuapp.com/api/v1/search?q='Sun'";

// this totally works w00t
var queryURL = "http://api.open-notify.org/iss-now.json";

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
});

// moonphase api call --- populate into table?
var moonPhaseURL = "https://api.usno.navy.mil/moon/phase?date=3/19/2019&nump";

$.ajax({
  url: moonPhaseURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
});

// this shit is dead af
/* var starURL = "https://cors-ut-bootcamp.herokuapp.com/http://star-api.herokuapp.com/api/v1/search?q='Sun'";

$.ajax({
  url: starURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
}); */

// nasa api key: w6WzGfIJHpH3CYm2kyvIAuej0NwIjBmbh1ywubzT
var neoWSURL = "https://api.nasa.gov/neo/rest/v1/feed?start_date=2019-03-19&api_key=w6WzGfIJHpH3CYm2kyvIAuej0NwIjBmbh1ywubzT";

$.ajax({
  url: neoWSURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
});   