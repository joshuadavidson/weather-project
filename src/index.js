/* establish global variables for ESLint */
/* global $ document */
/* global window document */
/* global navigator document */

const userData = {
  position: {
    lat: 0,
    lon: 0,
  },

  location: {
    city: '',
    state: '',
    country: '',
    locationText: '',
  },

  weather: {
    timeStampWeather: 0, // epoch time in ms
    summary: '', // short description of weather
    humidity: 0, // 0-1
    precipProb: 0, // 0-1
    icon: '', // icon to display

    // data in imperial units
    imperial: {
      temp: 0, // Fahrenheit
      tempUnits: '&degF',
      windSpeed: 0, // mph
      windSpeedUnits: 'mph',
    },

    // data in metric units
    metric: {
      temp: 0, // Celsius
      tempUnits: '&degC',
      windSpeed: 0, // kph
      windSpeedUnits: 'kph',
    },
  },
};

// MOV source added first for safari browser support
const videoTagLookup = {
  'clear-day': '<video poster="./img/clear-day.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/clear-day.mov" type="video/mov"><source id="bgVideo" src="./img/clear-day.mp4" type="video/mp4"></video>',

  'clear-night': '<video poster="./img/clear-night.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/clear-night.mov" type="video/mov"><source id="bgVideo" src="./img/clear-night.mp4" type="video/mp4"></video>',

  rain: '<video poster="./img/rain.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/rain.mov" type="video/mov"><source id="bgVideo" src="./img/rain.mp4" type="video/mp4"></video>',

  snow: '<video poster="./img/snow.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/snow.mov" type="video/mov"><source id="bgVideo" src="./img/snow.mp4" type="video/mp4"></video>',

  sleet: '<video poster="./img/snow.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/snow.mov" type="video/mov"><source id="bgVideo" src="./img/snow.mp4" type="video/mp4"></video>',

  wind: '<video poster="./img/wind.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/wind.mov" type="video/mov"><source id="bgVideo" src="./img/wind.mp4" type="video/mp4"></video>',

  fog: '<video poster="./img/fog.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/fog.mov" type="video/mov"><source id="bgVideo" src="./img/fog.mp4" type="video/mp4"></video>',

  cloudy: '<video poster="./img/cloudy.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/cloudy.mov" type="video/mov"><source id="bgVideo" src="./img/cloudy.mp4" type="video/mp4"></video>',

  'partly-cloudy-day': '<video poster="./img/partly-cloudy-day.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/partly-cloudy-day.mov" type="video/mov"><source id="bgVideo" src="./img/partly-cloudy-day.mp4" type="video/mp4"></video>',

  'partly-cloudy-night': '<video poster="./img/partly-cloudy-night.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/partly-cloudy-night.mov" type="video/mov"><source id="bgVideo" src="./img/partly-cloudy-night.mp4" type="video/mp4"></video>',

  hail: '<video poster="./img/thunderstorm.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/thunderstorm.mov" type="video/mov"><source id="bgVideo" src="./img/thunderstorm.mp4" type="video/mp4"></video>',

  thunderstorm: '<video poster="./img/thunderstorm.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/thunderstorm.mov" type="video/mov"><source id="bgVideo" src="./img/thunderstorm.mp4" type="video/mp4"></video>',

  tornado: '<video poster="./img/thunderstorm.jpg" preload="auto" autoplay="true" loop="loop" muted="muted"><source id="bgVideo" src="./img/thunderstorm.mov" type="video/mov"><source id="bgVideo" src="./img/thunderstorm.mp4" type="video/mp4"></video>',
};

const iconLookup = {
  'clear-day': 'wi-forecast-io-clear-day',
  'clear-night': 'wi-forecast-io-clear-night',
  rain: 'wi-forecast-io-rain',
  snow: 'wi-forecast-io-snow',
  sleet: 'wi-forecast-io-sleet',
  wind: 'wi-forecast-io-wind',
  fog: 'wi-forecast-io-fog',
  cloudy: 'wi-forecast-io-cloudy',
  'partly-cloudy-day': 'wi-forecast-io-partly-cloudy-day',
  'partly-cloudy-night': 'wi-forecast-io-partly-cloudy-night',
  hail: 'wi-forecast-io-hail',
  thunderstorm: 'wi-forecast-io-thunderstorm',
  tornado: 'wi-forecast-io-tornado',
};

function getUserPosition() {
  // get position from browser
  function posFromBrowser(position) {
    userData.position.lat = position.coords.latitude;
    userData.position.lon = position.coords.longitude;
    getUserLocation();
  }

  // get position via IP
  function posFromIP() {
    $.ajax({
      url: 'https://freegeoip.net/json/',
      dataType: 'json',
      async: true,
      success(ipLoc) {
        userData.position.lat = ipLoc.latitude;
        userData.position.lon = ipLoc.longitude;
        getUserLocation();
      },
      error() {
        window.alert('Unable to determine location.');
      },
    });
  }

  // check if geolocation is enabled
  if (navigator.geolocation) {
    // try browser first then attempt IP, set timeout to 1 sec for Safari hangups
    navigator.geolocation.getCurrentPosition(posFromBrowser, posFromIP, { timeout: 1000 });
  }

  // if geolocation not available just use IP
  else {
    posFromIP();
  }
}

// find user location with Reverse Geocode from google
function getUserLocation() {
  const assembledURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userData.position.lat},${userData.position.lon}&key=AIzaSyCP8GLrC7_6nQYpBJFfTn4YWfz8G42y80g`;
  $.ajax({
    url: assembledURL,
    dataType: 'json',
    async: true,
    success(json) {
      // find the city, state, and country from google geocode results
      for (let i = 0; i < json.results[0].address_components.length; i += 1) {
        for (let j = 0; j < json.results[0].address_components[i].types.length; j += 1) {
          const currType = json.results[0].address_components[i].types[j];
          switch (currType) {
            case 'country':
              userData.location.country = json.results[0].address_components[i].short_name;
              break;
            case 'administrative_area_level_1':
              userData.location.state = json.results[0].address_components[i].short_name;
              break;
            case 'locality':
              userData.location.city = json.results[0].address_components[i].short_name;
              break;
            // no default
          }
        }
      }

      // Assemble the location text and remove empty values placing ',' between them
      userData.location.locationText = `${userData.location.city}\u0009${userData.location.state}\u0009${userData.location.country}`;
      userData.location.locationText = userData.location.locationText.trim().replace(/\t/g, ', ');
      getUserWeather();
    },
    error() {
      window.alert('City, State, Country data could not be found.');
      getUserWeather();
    },
  });
}

function getUserWeather() {
  const assembledURL = `https://api.darksky.net/forecast/5d462c19218fb1f2697e53fefda9aac7/${userData.position.lat},${userData.position.lon}`;
  $.ajax({
    url: assembledURL,
    dataType: 'jsonp',
    async: true,
    success(json) {
      userData.weather.timeStampWeather = json.currently.time;
      userData.weather.summary = json.currently.summary;
      userData.weather.humidity = json.currently.humidity;
      userData.weather.precipProb = json.currently.precipProbability;
      userData.weather.icon = json.currently.icon;

      userData.weather.imperial.temp = json.currently.temperature;
      userData.weather.imperial.windSpeed = json.currently.windSpeed;
      getMetricUserData(); // Convert imperial data to metric
      printUserData('imperial');
    },
    error() {
      window.alert('Unable to fetch weather from forecast.io.');
    },
  });
}

function getMetricUserData() {
  userData.weather.metric.temp = ((userData.weather.imperial.temp - 32) * 5) / 9;
  userData.weather.metric.windSpeed = userData.weather.imperial.windSpeed * 1.609344;
}


function printUserData(unitSystem) {
  // Fade all the data in at once
  $('#weatherBlock').fadeIn(1000);
  $('#creditsBlock').fadeIn(1000);
  $('.background').fadeIn(1000);

  // Update all data while fade is working
  $('#locationText').html(userData.location.locationText);
  $('#summary').html(userData.weather.summary);
  $('#temp').html(Math.round(10 * userData.weather[unitSystem].temp) / 10);
  $('#humidity').html(`${Math.round(100 * userData.weather.humidity)}%`);
  $('#precipProb').html(`${Math.round(100 * userData.weather.precipProb)}%`);
  $('#windSpeed').html(`${Math.round(10 * userData.weather[unitSystem].windSpeed) / 10} ${userData.weather[unitSystem].windSpeedUnits}`);
  $('#weatherIcon').removeClass().addClass(`wi ${iconLookup[userData.weather.icon]} fa-5x`);

  // update the background by looking at the weather icon only if it is not present
  // this if check prevents reload of background if only the units were changed
  if ($('.background').children('video').length === 0) {
    $('.background').html(videoTagLookup[userData.weather.icon]);
  }
}

// start by getting user position
getUserPosition();

// toggle from C to F
$('#degF').click(() => {
  if ($('#degC').hasClass('selected')) {
    $('#degC').removeClass();
    $('#degF').removeClass().addClass('selected');
    printUserData('imperial');
  }
});

// toggle from F to C
$('#degC').click(() => {
  if ($('#degF').hasClass('selected')) {
    $('#degF').removeClass();
    $('#degC').removeClass().addClass('selected');
    printUserData('metric');
  }
});

// while results are loading inform the user
$(document).ajaxStart(() => {
  $('#loading-img').show();
});
$(document).ajaxStop(() => {
  $('#loading-img').hide();
});
