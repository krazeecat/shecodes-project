//update time and date on page
function updateDate() {
  let date = new Date();
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
  let dateNow = date.getDate();
  let dayNow = days[date.getDay()];
  let monthNow = months[date.getMonth()];
  let hourNow = (date.getHours() < 10 ? "0" : "") + date.getHours();
  let minuteNow = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  let displayDate = document.querySelector("#current-date");

  displayDate.innerHTML = `${dayNow} ${dateNow} ${monthNow} ${hourNow}:${minuteNow}`;
}

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

//Swap celcius and farhenheit active links and styling
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

//change display temperatures from celcius to farhenheit
function changeToF() {
  let currentTempC = document.querySelector("#current-temp");
  let currentHighC = document.querySelector("#current-high");
  let currentLowC = document.querySelector("#current-low");
  let currentTempFahrenheit = convertToF(currentTempC.innerText);
  let currentHighFahrenheit = convertToF(currentHighC.innerText);
  let currentLowFahrenheit = convertToF(currentLowC.innerText);
  currentTempC.innerHTML = Math.round(currentTempFahrenheit);
  currentHighC.innerHTML = Math.round(currentHighFahrenheit);
  currentLowC.innerHTML = Math.round(currentLowFahrenheit);

  switchTempSelected();
}

//change display temperatures from farhenheit to celcius
function changeToC() {
  let currentTempF = document.querySelector("#current-temp");
  let currentHighF = document.querySelector("#current-high");
  let currentLowF = document.querySelector("#current-low");
  let currentTempCelcius = convertToC(currentTempF.innerText);
  let currentHighCelcius = convertToC(currentHighF.innerText);
  let currentLowCelcius = convertToC(currentLowF.innerText);
  currentTempF.innerHTML = Math.round(currentTempCelcius);
  currentHighF.innerHTML = Math.round(currentHighCelcius);
  currentLowF.innerHTML = Math.round(currentLowCelcius);

  switchTempSelected();
}

let changeF = document.querySelector("#change-f");
changeF.addEventListener("click", changeToF);

let changeC = document.querySelector("#change-c");
changeC.addEventListener("click", changeToC);

//Update weather info
function updateWeather(response) {
  console.log(response);
  let temperature = Math.round(response.data.main.temp);
  let high = Math.round(response.data.main.temp_max);
  let low = Math.round(response.data.main.temp_min);
  let icon = response.data.weather[0].icon;
  let description = response.data.weather[0].description;
  let wind = Math.round(response.data.wind.speed);

  let currentTemp = document.querySelector("#current-temp");
  let currentHigh = document.querySelector("#current-high");
  let currentLow = document.querySelector("#current-low");
  let currentIcon = document.querySelector("#currentIcon");
  let currentDescription = document.querySelector("#current-description");
  let currentWind = document.querySelector("#current-wind");

  currentTemp.innerText = temperature;
  currentHigh.innerHTML = high;
  currentLow.innerHTML = low;
  currentIcon.setAttribute("src", `images/${icon}.png`);
  currentDescription.innerText = description;
  currentWind.innerText = wind;

  updateDate();

  updateCity(response);
}

//search for weather from search box text
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

//search for weather from the location button
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
