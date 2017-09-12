$(document).ready(function () {

    //Global variables
    var radius;

    var geocodingDataIsValid = function (geocodingData) {
        if (geocodingData.results.length <= 0) {
            $("#errorMessage").html("<strong>No results returned.</strong>");
            $("#errorMessage").show();
            return false;
        }
        else if (geocodingData.results.length > 1) {
            $("#errorMessage").html("<strong>More than 1 result returned. Please narrow search.</strong>");
            $("#errorMessage").show();
            return false;
        }
        else {
            $("#errorMessage").hide();
            return true;
        }
    };

    var getTrailsData = function () {

        $.ajax({
            url: "https://www.hikingproject.com" + "/data/get-trails" + "?lat=" + searchCoordinates.lat + "&lon=" + searchCoordinates.lng + "&maxDistance=" + radius + "&key=200147703-07bf8d789bb5f945f6246689684605c2",
            method: "GET",
            success: function (data) {
                for (i = 0; i < data.trails.length; i++) {
                    $("#trails-info").append("<h3>" + data.trails[i].name + "</h3>");
                    $("#trails-info").append("<p>" + data.trails[i].summary + "</p>");
                    $("#trails-info").append("<strong>Difficulty Level: " + data.trails[i].difficulty + "</strong>");
                    //TODO: Also append location info or more general trail data if possible           
                    window.locations.push({ lat: data.trails[i].latitude, lng: data.trails[i].longitude });
                }
                console.log(window.locations);
                console.log(data);
            },
            fail: function (data) {
                console.log(data);
            }
        });
    };

    var getWeatherData = function () {

        $.ajax({
            url: "http://api.openweathermap.org" + "/data/2.5/weather" + "?lat=" + searchCoordinates.lat + "&lon=" + searchCoordinates.lng + "&appid=8f1e1fe8ad21fd905884311228d4b797",
            method: "GET",
            success: function (data) {
                var tempF = Math.floor((((data.main.temp) - 273) * 1.8) + 32);
                $("#weatherName").html(data.name);
                $("#weatherTemp").html("Temperature: " + tempF + "&#176; F");
                $("#weatherHumidity").html("Humidity: " + data.main.humidity + "%");
                $("#weatherDescription").html("Forecast: " + data.weather[0].description);
                getTrailsData();
            },
            fail: function (data) {
                console.log(data);
            }
        });
    };

    var getGeocodingData = function (location) {

        $.ajax({
            url: "https://maps.googleapis.com" + "/maps/api/geocode/json" + "?address=" + location + "&key=AIzaSyBOglb0LjVuwKiFDQz52dk_MSTfMJvbq5g",
            method: "GET",
            success: function (data) {
                console.log(data);
                if (geocodingDataIsValid(data)) {
                    window.searchCoordinates = { lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng}
                    getWeatherData();
                }
            },
            fail: function (data) {
                console.log(data);
            }
        });
    };

    $("#trailSearch").on("click", function () {
        var isValid = true;
        radius = $("#radius").val().trim();
        $("#errorMessage").hide();

        if (radius == "") {
            radius = 20;
        }
        else if (radius > 1000) {
            $("#errorMessage").html("<strong>Radius too large. Please search under 1000 miles.</strong>");
            $("#errorMessage").show();
            isValid = false;
        }

        if (isValid) {
            var locationInput = $("#locationInput").val().trim();
            getGeocodingData(locationInput);
            window.initMap();
        };
    });
});