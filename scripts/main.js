var userLoc = {
  //Set Default to Antarctica
  lat: 82.8628,
  lon: 135.0000
};
getUserLocation.
function getUserLocation() {
  console.log("Inside getUserLocation function")
    //If browser has location enabled update userLoc
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      userLoc.lat = position.coords.latitude;
      userLoc.lon = position.coords.longitude;
      return;
    });
  } else { //If browser doesn't have location enabled get from IP address
    $.getJSON("http://freegeoip.net/json/", function(json) {
      console.log("Pulling from IP.");
      userLoc.lat = json.latitude;
      userLoc.lon = json.longitude;
    });
  }
  console.log("End of funtion" + userLoc.lat);
}

$(document).ready(function() {

  getUserLocation();

  $("#latnum").html(userLoc.lat);
  $("#lonnum").html(userLoc.lon);

});
