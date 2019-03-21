$(document).ready(function(){

  // VARIABLES
  // ---------------------------------
  var lat, lon, postCode;

  var options = {
      enableHighAccuracy: true,
      timeout: 50000,
      maximumAge: 10
  };

  var weatherAPIKey = "b77ed65941bfb419ca54635b571f1301";
  var weatherQueryURL;
  var mapsAPIKey = "KKNAYOZYN0J0eoPbxt3VZ7exkb6E6CCv";
  var mapsQueryURL;
  
  //Star Clicker Config
  var config = {
    apiKey: "AIzaSyCXNm13AyUH8iwFFpEAhKFMM-5IaPswpAE",
    authDomain: "fir-click-counter-7cdb9.firebaseapp.com",
    databaseURL: "https://star-clicker.firebaseio.com/",
    storageBucket: "fir-click-counter-7cdb9.appspot.com"
  };
  


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
      postCode = mapsResponse.address.postcode;
      console.log(postCode);
      $("#zipCode").attr("value", postCode);

    })
  }
  
  setTimeout(display, 5000);
  
  
  // EVENTS
  // ---------------------------------------------------------
  var today = moment().format("YYYY-MM-DD");
  $("#date").attr("value", today);
  
  $(".hidden").hide();
  
  $("#zipCode").attr("placeholder", "Determining Location...");

  // if (postCode === undefined) {
  //   $("#zipCode").attr("placeholder", "Zip Code");
  // } else {
  //   $("#zipCode").attr("placeholder", "Determining Location...");
  // }


  firebase.initializeApp(config);

  var database = firebase.database();
  var clickCounter = 0;

  // var with date to pass into api parameters
  $('#submitButton').on('click', function(e) {
    e.preventDefault();
    $(".hidden").show();


    // Add to clickCounter
    clickCounter++;

    //  Store Click Data to Firebase in a JSON property called clickCount
    database.ref().set({
      clickCount: clickCounter
    });

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
      console.log('Latitude: ' + issLatitude, 'Longitude: ' + issLongitude);
      // var issLatLon = JSON.stringify(issLatitude, issLongitude);
      $("#nearEarth").append('Latitude: ' + issLatitude, 'Longitude: ' + issLongitude);
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
    
    // $("#weatherDiv").empty();
    
    // Weather API - current temp
    $.ajax ({
      url: weatherQueryURL,
      method: "GET"
    }).then(function(response) {
      
      // Log the queryURL
      console.log(weatherQueryURL);
      
      // log the resulting object
      console.log(response);
      
      var pCity = $("<h1>").text(response.name+", "+response.sys.country);
      var pWeather = $("<h4>").text(response.weather[0].main);
      var pTemp = $("<p>").text("low "+ Math.floor(response.main.temp_min) +"° | "+ "high "+ Math.floor(response.main.temp_max) +"°");
      var pClouds = $("<td>").text(response.clouds.all +"%");
      var pHumid = $("<td>").text(response.main.humidity+" %");
      var pWindSpeed = $("<td>").text(Math.floor(response.wind.speed) + " mph");
      var pWindDeg = $("<td>").text(response.wind.deg +"°");
      
      var iconCode = response.weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      var wIcon = $("<img>").attr("id", "weather-icon").attr("alt", "Weather Icon").attr("src", iconUrl);
      
      
      // transfer content to HTML
      // var weatherCol1 = $("<div>").addClass("col-lg-6");
      // var weatherCol2 = $("<div>").addClass("col-lg-6");
      
      $("#city-name").append(pCity);
      $("#weather-forecast").append(wIcon, pWeather, pTemp);
      $("tbody>tr").append(pClouds, pHumid, pWindSpeed, pWindDeg);
  


    })

  })

  database.ref().on("value", function(snapshot) {

    console.log(snapshot.val());

    clickCounter = snapshot.val().clickCount;

    $("#click-value").text(snapshot.val().clickCount);

    }, function(errorObject) {

    console.log("The read failed: " + errorObject.code);
  });

})
