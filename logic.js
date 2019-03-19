
$(document).ready(function(){

  // api call - geolocation

  // rss with up to date nasa news?

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
        $("#location").attr("value", postcode);
      })

      console.log(lat);
      console.log(lon);
    }

    setTimeout(display, 10000);


    // EVENTS
    // ---------------------------------------------------------
    // var with date to pass into api parameters
    $('#submitButton').on('click', function() {
          e.preventDefault();
          window.location.href = "main.html";

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

          // if user deny location lat and lon undefined queryURL is input val
          if ((lat || lon) !== undefined) {
              weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+weatherAPIKey;
          } else {
              var userLocation = $("#location").val().toString();
              console.log(userLocation);
              weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?zip="+userLocation+"&appid="+weatherAPIKey;
          }


          // AJAX call
          $.ajax ({
              url: weatherQueryURL,
              method: "GET"
          }).then(function(response) {

              // Log the queryURL
              console.log(weatherQueryURL);

              // log the resulting object
              console.log(response);

              // transfer content to HTML
              var weatherDiv = $("#weatherContainer");

              weatherDiv.append($("<p>").text("City: "+ response.name));
              $(".wind").html("Wind: "+ response.wind);
              $(".humidity").html("humidity: "+response.main.humidity);
              $(".temp").html("Temp: "+response.main.temp);

              // Calculate the temperature (converted from Kelvin)
              // To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
              var Fahrenheit = Math.floor(((response.main.temp - 273.15)*1.80 +32));
              console.log(Fahrenheit + "°F")

              // Dump the temperature content into HTML
              $(".temp").html("Temp: "+ Fahrenheit);

          // on click closing tag. dont fuck with this
        })

        $("#returnButton").on("click", function(e) {
          e.preventDefault();
          window.location.href = "index.html";

        });

    });
})
