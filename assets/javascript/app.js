// transit and trails API key: d9881e8b3dd8b87a86a70c42a084d3f4029e9934d3657a6c4c0e71f91f7f79c0

// google places api key AIzaSyCs2eO_yLfEGdntBqOvVJMsZL5ONGtBwHM

$(document).ready(function(){


	var APIKey = "d9881e8b3dd8b87a86a70c42a084d3f4029e9934d3657a6c4c0e71f91f7f79c0";
  
    var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?";
   
   var getAjax = function(url){

    var apiUrl = url;   
    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function(data) {
        	console.log(data)
         return data;
      	}
    });
	};

	$("#weatherSearch").on("click", function(){ 
		var city = $("#city").val().trim();
		getAjax("http://api.openweathermap.org" + "/data/2.5/weather" + "?q=" + city + "&appid=8f1e1fe8ad21fd905884311228d4b797")
	})


	

});