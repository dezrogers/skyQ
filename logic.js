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

  setTimeout(display, 2000);


  // EVENTS
  // ---------------------------------------------------------
  var today = moment().format("YYYY-MM-DD");
  $("#date").attr("value", today);

  // var with date to pass into api parameters
  $('#submitButton').on('click', function(e) {
    e.preventDefault();

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

    moonPhase(date2);


    // Near Earth Objects NASA api key: w6WzGfIJHpH3CYm2kyvIAuej0NwIjBmbh1ywubzT
    function nearEarth() {
      var neoWSURL = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + date + "&api_key=w6WzGfIJHpH3CYm2kyvIAuej0NwIjBmbh1ywubzT";

      $.ajax({
        url: neoWSURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        $("#nearEarthObjects").empty();
        var nearEarthObjects = $("<p>");
        nearEarthObjects.text(response.element_count + " current objects near the Earth")
        $("#nearEarthObjects").append(nearEarthObjects);
      });
    }

    nearEarth(date);

    // if user denies location queryURL is user input value
    if ((lat || lon) !== undefined) {
      weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=imperial&appid="+weatherAPIKey;
    } else {
      var userLocation = $("#zipCode").val().toString();
      console.log(userLocation);
      weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?zip="+userLocation+"&units=imperial&appid="+weatherAPIKey;
    }


    // Weather API - current temp
    $.ajax ({
      url: weatherQueryURL,
      method: "GET"
    }).then(function(response) {

      // Log the queryURL
      console.log(weatherQueryURL);

      // log the resulting object
      console.log(response);
      $("#weatherDiv").empty();

      var pWeather = $("<p>").text("Forecast: "+ response.weather[0].main);
      var pCity = $("<p>").text("City: "+ response.name+", "+response.sys.country);
      var pWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " mph");
      var pWindDeg = $("<p>").text("Wind Deg: "+ response.wind.deg + "°");
      var pHumid = $("<p>").text("Humidity: "+ response.main.humidity + "%");
      var pTemp = $("<p>").text("Temp: "+ "low "+response.main.temp_min +"° / "+ "high "+response.main.temp_max+"°");
      var pClouds = $("<p>").text("Cloudiness: "+ response.clouds.all +"%");
      var iconCode = response.weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      var wIcon = $("<img>").attr("id", wIcon).attr("alt", "Weather Icon").attr("src", iconUrl);

      /*
      // Calculate the temperature (converted from Kelvin)
      // To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
      var Fahrenheit = Math.floor(((response.main.temp - 273.15)*1.80 +32));
      console.log(Fahrenheit + "°F")
      
      // Dump the temperature content into HTML
      var pTemp = $("<p>").text("Temp: "+ Fahrenheit);
      */      

      // transfer content to HTML
      var weatherCol = $("<div>").addClass("col-lg-12");
      $("#weatherDiv").append(weatherCol);
      weatherCol.append(pCity, wIcon, pWeather, pTemp, pClouds, pHumid, pWindSpeed, pWindDeg);

     
    }) // on click closing tag. dont fuck with this
  })
})
