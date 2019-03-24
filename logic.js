$(document).ready(function(){

  // VARIABLES
  // ---------------------------------
  var lat, lon, postCode;

  var runInitialize = 0;

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
  
  var date = $('#date').val().toString();
  var date2 = moment(date).format('MM/DD/YYYY');
  // another var for iframe star chart date*
  

  // FUNCTIONS
  // ---------------------------------
  function success(pos) {

    var crd = pos.coords;
    console.log(pos);

    lat = crd.latitude;
    lon = crd.longitude;
    acc = crd.accuracy;
  }


  function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
  }


  // zipcode reverse geocoding
  function display() {
    mapsQueryURL = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat="+lat+"&lon="+lon+"";

    $.ajax({
      url: mapsQueryURL,
      method: "GET"
    }).then(function(mapsResponse) {
      postCode = mapsResponse.address.postcode;
      console.log(postCode);
      $("#zipCode").attr("value", postCode);

    })
  }
  
  // code for constellation
  function virtualSky(){
    var vSky = $("<iframe width='900' height='385' frameborder='0' scrolling='no' marginheight='' marginwidth='' src='https://virtualsky.lco.global/embed/index.html?longitude="+lon+"&latitude="+lat+"&projection=gnomic&constellations=true&constellationlabels=true&showplanetlabels=true&meridian=true' allowTransparency='true'></iframe>")
    $("#moonPhases").html(vSky);
  }


  function getWeather(){
    var userLocation = $("#zipCode").val().toString();
    console.log(userLocation);
    
    weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?zip="+userLocation+"&units=imperial&appid="+weatherAPIKey;
  
    // Weather API - current temp
    $.ajax ({
      url: weatherQueryURL,
      method: "GET"
    }).then(function(response) {

      // display HTML
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
      
      
      $("#city-name").empty();
      $("#weather-forecast").empty();
      $("tbody>tr").empty();
      $("#city-name").append(pCity);
      $("#weather-forecast").append(wIcon, pWeather, pTemp);
      $("tbody>tr").append(pClouds, pHumid, pWindSpeed, pWindDeg);
  
    })
  } 

  // Code from webGLEarth -----
  function initialize() {
    var issLatitude;
    var issLongitude;
    var issLocation = issLatitude + ', ' + issLongitude;
    // refer to documentation to set options. center on iss and rotate with if possible
    var options = {center: [issLocation], zoom: 0};
    var earth = new WE.map('issDiv', options);

    // change texture of map
    WE.tileLayer('https://tileserver.maptiler.com/nasa/{z}/{x}/{y}.jpg', {
      minZoom: 0,
      maxZoom: 0,
      attribution: 'NASA'
    }).addTo(earth);

    
    // rotation animation
    var before = null;
    requestAnimationFrame(function animate(now) {
        var c = earth.getPosition();
        var elapsed = before? now - before: 0;
        before = now;
        earth.setCenter([c[0], c[1] + 0.1*(elapsed/30)]);
        requestAnimationFrame(animate);
    });

    // called down in webGLearth function
     var queryISSURL = "https://api.wheretheiss.at/v1/satellites/25544";

     $.ajax({
       url: queryISSURL,
       method: "GET"
     }).then(function(response) {
        $("#iss").empty();
        console.log(response); 
        // print iss coordinates to neo div
        var issLatitude = JSON.stringify(response.latitude);
        var issLongitude = JSON.stringify(response.longitude);
        console.log('Latitude: ' + issLatitude, 'Longitude: ' + issLongitude);
        
        // var issLatLon = JSON.stringify(issLatitude, issLongitude);
        $("#iss").append('Latitude: ' + issLatitude + ' Longitude: ' + issLongitude);
        console.log("the code for the iss coordinates ran once");

        // marker basic
        var marker = WE.marker([issLatitude, issLongitude], 'images/icons8-satellite-64.png', 64, 64).addTo(earth)
        marker.bindPopup('<b>Hello World!</b>'); 
     });
    // closing tag for intialize globe function
  }

  // EVENTS
  // ---------------------------------------------------------
  // run geolocation code. success, failure, and the last argument failure.
  navigator.geolocation.getCurrentPosition(success, error, options);

  var today = moment().format("YYYY-MM-DD");
  $("#date").attr("value", today);
  
  $("#zipCode").attr("placeholder", "Determining Location...");

  setTimeout(display, 12000);

  //changes "determining location" to "Enter Zipcode" after determining location is called
  setTimeout(function() {
    $("#zipCode").attr("placeholder", "Enter Zipcode");
  }, 15000);

  $(".hidden").hide();

  firebase.initializeApp(config);

  var database = firebase.database();
  var clickCounter = 0;

  // var with date to pass into api parameters
  $('#submitButton').on('click', function(e) {
    runInitialize++;
    e.preventDefault();
    $(".hidden").show();

    //move intro area to top
    $("#introArea").css("padding", "0");
    $("#introArea").css("transition","1s");

    // Add to clickCounter
    clickCounter++;

    //  Store Click Data to Firebase in a JSON property called clickCount
    database.ref().set({
      clickCount: clickCounter
    });

    virtualSky();

    getWeather();

    if (runInitialize < 2){
      initialize();
    }
    
  })

  database.ref().on("value", function(snapshot) {
    console.log(snapshot.val());
    clickCounter = snapshot.val().clickCount;
    $("#click-value").text(snapshot.val().clickCount);
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


// document.ready closing tag
})


