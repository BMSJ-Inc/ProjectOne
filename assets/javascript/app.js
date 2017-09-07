// transit and trails API key: d9881e8b3dd8b87a86a70c42a084d3f4029e9934d3657a6c4c0e71f91f7f79c0

// google places api key AIzaSyA1xuQdW9H5SBfN8XjZtAJKifKs30YBIqk
//google geocoding api key: AIzaSyBOglb0LjVuwKiFDQz52dk_MSTfMJvbq5g
//myTrails api key: q8z7f7e2x9n1z8k7b4h2
//mapbox key: pk.eyJ1IjoiZHVja2llYmVld2FycmVuIiwiYSI6ImNqNzl1cXMwajA3aTcyd2xhazU0Y3cyd2UifQ.jR30zEe-DjeGZSakFXo4-g

$(document).ready(function(){

  //Global variables
  var searchLocation;
  var trailLocations = [];

  var getAjax = function(url){

    var result;

    $.ajax({
      url: url,
      method: "GET",
      // headers: {
      //   "X-Mashape-Key":"FtPQ6JmTVtmshoiz8rYTQyhg7M7zp1A2x1NjsnfqQ6kJxvwTXr",
      //   "Accept":"text/plain"
      // }
      //Must put "async: false" property to return result from api. Why???
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
    var isValid = true;
    var radius = $("#radius").val().trim();
    $("#radiusTooHighError").hide();

    if (radius == "") {
      radius = 20;
    }
    else if (radius > 1000) {
      $("#radiusTooHighError").show();
      isValid = false;
    }
    
    if(isValid){
      var locationInput = $("#locationInput").val().trim();

      //Google Geocoding API
      var geocodingData = getAjax("https://maps.googleapis.com" + "/maps/api/geocode/json" + "?address=" + locationInput + "&key=AIzaSyBOglb0LjVuwKiFDQz52dk_MSTfMJvbq5g");
      isValid = geocodingDataIsValid(geocodingData);
    }
    

    //Weather API
    if (isValid) {
      searchLocation = { Latitude: geocodingData.results[0].geometry.location.lat, Longitude: geocodingData.results[0].geometry.location.lng };
      var weatherData = getAjax("http://api.openweathermap.org" + "/data/2.5/weather" + "?lat=" + searchLocation.Latitude + "&lon=" + searchLocation.Longitude + "&appid=8f1e1fe8ad21fd905884311228d4b797");
      isValid = weatherData != false;
      //TODO: Populate weather data into html. Add error message logic if it isn't valid or results aren't returned.
    }

    //FtPQ6JmTVtmshoiz8rYTQyhg7M7zp1A2x1NjsnfqQ6kJxvwTXr
    //Trails API
    if (isValid) {
      var hikingTrailsApiData = getAjax("https://www.hikingproject.com" + "/data/get-trails" + "?lat=" + searchLocation.Latitude + "&lon=" + searchLocation.Longitude + "&maxDistance=" + radius + "&key=200147703-07bf8d789bb5f945f6246689684605c2");
      
      isValid = processTrailData(hikingTrailsApiData);
    }

    //Google Maps API
    if (isValid) {
      getGoogleMapWithMarkers();
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

  var processTrailData = function(trailData){
    if(trailData.trails > 0){

      for(var i in hikingTrailsApiData.trails) {
          trailLocations.push({Latitude: hikingTrailsApiData.trails[i].latitude, Longitude: hikingTrailsApiData.trails[i].longitude});
          populateTrailData(hikingTrailsApiData.trails[i]);
      };
      console.log(trailLocations);

      //populateTrailData(hikingTrailsApiData.trails);

    }
    else{
      return false;
    }
  }

  var populateTrailData = function(trailInfo){

  };



  //Creating Google Map With Markers
        var getGoogleMapWithMarkers = function initMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 3,
          center: {lat: searchLocation.Latitude, lng: searchLocation.Longitude}
        });

        // Create an array of alphabetical characters used to label the markers.
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // Add some markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.
        var markers = locations.map(function(location, i) {
          return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
          });
        });

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
      }
      var locations = trailLocations;
});