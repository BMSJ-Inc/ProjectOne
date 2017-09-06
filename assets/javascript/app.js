// transit and trails API key: d9881e8b3dd8b87a86a70c42a084d3f4029e9934d3657a6c4c0e71f91f7f79c0

// google places api key AIzaSyA1xuQdW9H5SBfN8XjZtAJKifKs30YBIqk
//google geocoding api key: AIzaSyBOglb0LjVuwKiFDQz52dk_MSTfMJvbq5g
//myTrails api key: q8z7f7e2x9n1z8k7b4h2


$(document).ready(function(){

  var getAjax = function(url){

    var result;

    $.ajax({
      url: url,
      method: "GET",
      async: false,
      success: function(data) {
        //console.log(data.coord.lon)
        console.log(data);
        result = data;
      },
      fail: function(data) {
        console.log(data);
        result = false;
      }
    });

    return result;
  };


  //Workflow:
  //When user inputs location and/or radius, first call google api to get coordinates based on location input.
  //If coordinate data is returned, call weather api using the coordinates, else display error message and skip remaining steps.
  //If weather data is returned, populate data into html and then call trails api, else display message and skip remaining steps.
  //If trails are returned, populate the trails data into html and use coordinates for each of the trails
  //to call google api and add markers onto the map.
  //Populate map result into html. If trails aren't returned, display error message and skip remaining steps.

  $("#trailSearch").on("click", function(){
    var isValid;
    //TODO: Add default radius value
    var radius = $("#radius").val().trim() * 1.6; //Converts from miles to km
    var locationInput = $("#locationInput").val().trim();

    //Google Geocoding API
    var geocodingData = getAjax("https://maps.googleapis.com" + "/maps/api/geocode/json" + "?address=" + locationInput + "&key=AIzaSyBOglb0LjVuwKiFDQz52dk_MSTfMJvbq5g");
    isValid = geocodingDataIsValid(geocodingData);

    //Weather API
    if (isValid) {
      var latitude = geocodingData.results[0].geometry.location.lat;
      var longitude = geocodingData.results[0].geometry.location.lng;
      var weatherData = getAjax("http://api.openweathermap.org" + "/data/2.5/weather" + "?lat=" + latitude + "&lon=" + longitude + "&appid=8f1e1fe8ad21fd905884311228d4b797");
      isValid = weatherData != false;
      //TODO: Populate weather data into html. Add error message logic if it isn't valid or results aren't returned.
    }

    //Trails API
    if (isValid) {
      var transitTrailsData = getAjax("https://api.transitandtrails.org" + "/api/v1/trailheads" + "?latitude=" + latitude + "&longitude=" + longitude+ "&key=d9881e8b3dd8b87a86a70c42a084d3f4029e9934d3657a6c4c0e71f91f7f79c0");
      var trailsData = getAjax("https://mytrails.com.au" + "/service_location.php" + "?apikey=q8z7f7e2x9n1z8k7b4h2" + "&latitude=" + latitude + "&longitude=" + longitude + "&radius=" + radius);
      //No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
      //TODO: Find a damn trails api that works or figure out what's wrong with the api call!!!!
      //TODO: Retrieve latitude and longitude for each trail (array) to use for next google api call
      //TODO: Populate, check validity and reset isValid, add error message logic. Create new function???
    }

    //Google Maps API
    if (isValid) {
      //TODO: Api call to create google map with trail markers here (use latitude and longitude from above for markers).
      //May need to loop through array and make call for each trail's lat and lon. Or api may take all in one call.
      //TODO: Populate, check validity and reset isValid, add error message logic. Create new function???
    }
    //THE END
  });


  var geocodingDataIsValid = function(geocodingData){
    if (geocodingData == false || geocodingData.results.length <= 0) {
      $("#noResultsError").show();
      return false;
    }
    else {
      $("#noResultsError").hide();
      return true;
    }
  };

});