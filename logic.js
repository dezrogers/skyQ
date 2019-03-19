// api call - predict the sky

// api call - geolocation

// on submit -- convery city to lat/lon and pull relevant data from predict the sky

// rss with up to date nasa news?

// var with date to pass into api parameters
$('#submitButton').on('click', function() {
  var date = $('#date').val().toString();
  var date2 = moment(date).format('MM/DD/YYYY'); 
  console.log(date);
  console.log(date2);
  nearEarth(date);
  moonPhase(date2);

// this totally works w00t
var queryURL = "http://api.open-notify.org/iss-now.json";

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
});

// moonphase api call --- populate into table?
function moonPhase() {
var moonPhaseURL = "https://api.usno.navy.mil/moon/phase?date=" + date2 + "&nump=4";

$.ajax({
  url: moonPhaseURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
});
}

// Near Earth Objects NASA api key: w6WzGfIJHpH3CYm2kyvIAuej0NwIjBmbh1ywubzT
function nearEarth() {
var neoWSURL = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + date + "&api_key=w6WzGfIJHpH3CYm2kyvIAuej0NwIjBmbh1ywubzT";

$.ajax({
  url: neoWSURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
});
}

// on click closing tag. dont fuck with this
})
$("#submitButton").on("click", function(e) {
    e.preventDefault();
    window.location.href = "main.html";
    
});
$("#returnButton").on("click", function(e) {
    e.preventDefault();
    window.location.href = "index.html";
    
});
