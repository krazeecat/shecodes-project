//Current date and time
let current = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Satday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function giveDate(date) {
  let dateNow = date.getDate();
  let dayNow = days[date.getDay()];
  let monthNow = months[date.getMonth()];
  let hourNow = (date.getHours() < 10 ? "0" : "") + date.getHours();
  let minuteNow = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

  return `${dayNow} ${dateNow} ${monthNow} ${hourNow}:${minuteNow}`;
}

let displayDate = document.querySelector("#current-date");
displayDate.innerHTML = giveDate(current);

//Change city name
function updateCity(response) {
  let newCity = response.data.name;
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = newCity;
  let newCountry = response.data.sys.country;
  let currentCountry = document.querySelector("#current-country");
  currentCountry.innerHTML = newCountry;
}

let citySearch = document.querySelector("#search-form");
citySearch.addEventListener("submit", findCityWeather);

//Change temperature units
function convertToF(celsius) {
  return (celsius * 9) / 5 + 32;
}
function convertToC(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}
function checkTempUnit() {
  let checkC = document.querySelector("#change-c");
  if (checkC.classList.contains("tempSelected")) {
    return true;
  } else {
    return false;
  }
}
function switchTempSelected() {
  let unitC = document.querySelector("#change-c");
  let unitF = document.querySelector("#change-f");
  if (checkTempUnit()) {
    unitC.classList.replace("tempSelected", "tempUnselected");
    unitF.classList.replace("tempUnselected", "tempSelected");
  } else {
    unitC.classList.replace("tempUnselected", "tempSelected");
    unitF.classList.replace("tempSelected", "tempUnselected");
  }
}

function changeToF() {
  let currentTempC = document.querySelector("#current-temp");
  let fahrenheit = convertToF(currentTempC.innerText);
  currentTempC.innerHTML = Math.round(fahrenheit);
  switchTempSelected();
}
function changeToC() {
  let currentTempF = document.querySelector("#current-temp");
  let celcius = convertToC(currentTempF.innerText);
  currentTempF.innerHTML = Math.round(celcius);
  switchTempSelected();
}

let changeF = document.querySelector("#change-f");
changeF.addEventListener("click", changeToF);

let changeC = document.querySelector("#change-c");
changeC.addEventListener("click", changeToC);

//Update weather from location button
function updateWeather(response) {
  let temperature = Math.round(response.data.main.temp);
  let high = Math.round(response.data.main.temp_max);
  let lo = Math.round(response.data.main.temp_min);

  let currentTemp = document.querySelector("#current-temp");
  let currentHigh = document.querySelector("#current-high");
  let currentLo = document.querySelector("#current-lo");

  currentTemp.innerText = temperature;
  currentHigh.innerHTML = high + "˚";
  currentLo.innerHTML = lo + "˚";

  updateCity(response);
}

function findCityWeather(event) {
  event.preventDefault();
  let newCity = document.querySelector("#city-search-text").value;
  let apiKey = "8d0f3193f3635eec81a60bab4807ea1f";
  let unit = "standard";
  if (checkTempUnit()) {
    unit = "metric";
  } else {
    unit = "imperial";
  }
  let weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&units=${unit}&appid=${apiKey}`;

  axios.get(weatherURL).then(updateWeather);
}

function findLocationWeather(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiKey = "8d0f3193f3635eec81a60bab4807ea1f";
  let unit = "standard";
  if (checkTempUnit()) {
    unit = "metric";
  } else {
    unit = "imperial";
  }
  let weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=${unit}&appid=${apiKey}`;

  axios.get(weatherURL).then(updateWeather);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(findLocationWeather);
}

let locationButton = document.querySelector("#use-current-location");
locationButton.addEventListener("click", getLocation);

//get current weather on page load
function firstTimeWeather() {
  let startCity = "Copenhagen";
  let apiKey = "8d0f3193f3635eec81a60bab4807ea1f";
  let unit = "standard";
  if (checkTempUnit()) {
    unit = "metric";
  } else {
    unit = "imperial";
  }
  let weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${startCity}&units=${unit}&appid=${apiKey}`;

  axios.get(weatherURL).then(updateWeather);
}

firstTimeWeather();
