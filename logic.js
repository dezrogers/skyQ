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
        $("#location").attr("value", postcode);
      })

      console.log(lat);
      console.log(lon);
    }

    setTimeout(display, 10000);


    // EVENTS
    // ---------------------------------
    $("button").click(function(event){
        event.preventDefault();

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

        });
    });
})
