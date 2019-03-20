$(document).ready(function(){

  // VARIABLES
  // ---------------------------------
  var lat, lon, acc, postcode;

  var options = {
      enableHighAccuracy: true,
      timeout: 50000,
      maximumAge: 10
  };

  var weatherAPIKey = "b77ed65941bfb419ca54635b571f1301";
  var weatherQueryURL;
  var mapsAPIKey = "KKNAYOZYN0J0eoPbxt3VZ7exkb6E6CCv";
  var mapsQueryURL;


  // FUNCTIONS
  // ---------------------------------

  function success(pos) {

    var crd = pos.coords;
    console.log(pos);

    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    lat = crd.latitude;
    lon = crd.longitude;
    acc = crd.accuracy;

  }

  function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  // run geolocation code. success, failure, and the last argument failure.
  navigator.geolocation.getCurrentPosition(success, error, options);

  // display information on front page "default value"
  function display() {
    mapsQueryURL = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat="+lat+"&lon="+lon+"";

    $.ajax({
      url: mapsQueryURL,
      method: "GET"
    }).then(function(mapsResponse) {
      console.log(mapsResponse);
      postcode = mapsResponse.address.postcode;
      console.log(postcode);
      $("#zipCode").attr("value", postcode);
    })
  }

  setTimeout(display, 5000);


  // EVENTS
  // ---------------------------------------------------------
  var today = moment().format("YYYY-MM-DD");
  $("#date").attr("value", today);

  // var with date to pass into api parameters
  $('#submitButton').on('click', function(e) {
    e.preventDefault();

    $("#weatherDiv").empty();
    $("#eventsDiv").empty();

    var date = $('#date').val().toString();
    var date2 = moment(date).format('MM/DD/YYYY');
    console.log(date);
    console.log(date2);

    // this totally works w00t
    var queryISSURL = "http://api.open-notify.org/iss-now.json";

    $.ajax({
      url: queryISSURL,
      method: "GET"
    }).then(function(response) {
      console.log(response); 
      // print iss coordinates to neo div
      var issLatitude = JSON.stringify(response.iss_position.latitude);
      var issLongitude = JSON.stringify(response.iss_position.longitude);
      console.log('Latittude: ' + issLatitude, 'Longitude: ' + issLongitude);
      // var issLatLon = JSON.stringify(issLatitude, issLongitude);
      $("#nearEarth").append('Latittude: ' + issLatitude, 'Longitude: ' + issLongitude);
    });

    // moonphase api call --- populate into table?
    function moonPhase() {
      var moonPhaseURL = "https://api.usno.navy.mil/moon/phase?date=" + date2 + "&nump=4";

      $.ajax({
        url: moonPhaseURL,
        method: "GET"
      }).then(function(response) {
        $('#moonPhases').empty();
        console.log(response); 
        // populate into #eventsDiv. phasedata [4]
        var phase1 = $('<p>').text('Full Moon: ' + response.phasedata[0].date);
        var phase2 = $('<p>').text('Last Quarter: ' + response.phasedata[1].date);
        var phase3 = $('<p>').text('New Moon: ' + response.phasedata[2].date);
        var phase4 = $('<p>').text('First Quarter: ' + response.phasedata[3].date);
        /* console.log(phase1);
        console.log(phase2);
        console.log(phase3);
        console.log(phase4); */
        $("#moonPhases").append(phase1, phase2, phase3, phase4);
      });
    }

    moonPhase(date2);

    // Near Earth Objects NASA api key: w6WzGfIJHpH3CYm2kyvIAuej0NwIjBmbh1ywubzT
    function nearEarth() {
      var neoWSURL = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + date + "&api_key=w6WzGfIJHpH3CYm2kyvIAuej0NwIjBmbh1ywubzT";

      $.ajax({
        url: neoWSURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);

        $("#nearEarth").empty();
        var nearEarthObjects = $("<p>");
        nearEarthObjects.text(response.element_count + " current objects near the Earth")
        $("#nearEarth").append(nearEarthObjects);
      });
    }

    nearEarth(date);

    // if user denies location queryURL is user input value
    var userLocation = $("#zipCode").val().toString();
    console.log(userLocation);
    weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?zip="+userLocation+"&units=imperial&appid="+weatherAPIKey;


    // Weather API - current temp
    $.ajax ({
      url: weatherQueryURL,
      method: "GET"
    }).then(function(response) {
      $('#weatherDiv').empty();
      // Log the queryURL
      console.log(weatherQueryURL);

      // log the resulting object
      console.log(response);

      var pWeather = $("<p>").text("Forecast: "+ response.weather[0].main);
      var pCity = $("<p>").text("City: "+ response.name+", "+response.sys.country);
      var pWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " mph");
      var pWindDeg = $("<p>").text("Wind Deg: "+ response.wind.deg + "°");
      var pHumid = $("<p>").text("Humidity: "+ response.main.humidity);
      var pTemp = $("<p>").text("Temp: "+ "low "+ Math.floor(response.main.temp_min) +"° / "+ "high "+ Math.floor(response.main.temp_max) +"°");
      var pClouds = $("<p>").text("Cloudiness: "+ response.clouds.all +"%");
      var iconCode = response.weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      var wIcon = $("<img>").attr("id", wIcon).attr("alt", "Weather Icon").attr("src", iconUrl);


      // transfer content to HTML
      var weatherCol1 = $("<div>").addClass("col-lg-6");
      var weatherCol2 = $("<div>").addClass("col-lg-6");

      $("#weatherDiv").append(weatherCol1, weatherCol2);

      weatherCol1.append(pCity, wIcon, pWeather, pTemp);
      weatherCol2.append(pClouds, pHumid, pWindSpeed, pWindDeg);

    }) // on click closing tag. dont fuck with this
  })
})
