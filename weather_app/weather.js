"use strict";

// Unix time converter function
const unixToStandartTime = function (unixtime) {
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  const date = new Date(unixtime * 1000);
  // Hours part from the timestamp
  const hours = date.getHours();
  // console.log(typeof hours);
  // Minutes part from the timestamp
  const minutes = String(date.getMinutes()).padStart(2, 0);

  // Seconds part from the timestamp
  const seconds = String(date.getSeconds()).padStart(2, 0);
  let ampm = "";
  const ampmFunc = function (hours) {
    hours < 12 ? (ampm = " am") : (ampm = " pm");
    return ampm;
  };

  // converting 24 hours formate to  12
  let hour12 = +hours;
  let h = String(hour12 % 12 || 12).padStart(2, 0);
  ampmFunc(Number(hours));
  const formatedTime = `${h}:${minutes}${ampm}`;

  // console.log(formatedTime);
  return formatedTime;
};
unixToStandartTime(1646824481);

// Current Time
const timeFunc = function () {
  const dayArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date();
  let d = date.getDay();
  const hours = date.getHours();
  let hour12 = +hours;
  let h = String(hour12 % 12 || 12).padStart(2, 0);
  // let h = String(date.getHours()).padStart(2, 0);
  let m = String(date.getMinutes()).padStart(2, 0);
  let sec = String(date.getSeconds()).padStart(2, 0);
  // console.log(date);
  const day = dayArray[d];
  let ampm = "";
  const ampmFunc = function (hours) {
    hours < 12 ? (ampm = "AM") : (ampm = "PM");
    return ampm;
  };

  ampmFunc(hours);
  console.log(`${day},${h}:${m}${ampm}`);
  return `${day},${h}:${m} ${ampm}`;
};
timeFunc();

const today = timeFunc();
const wrapper = document.querySelector(".wrapper");

// Render weather function
const renderWeather = function (data) {
  const sunRise = unixToStandartTime(data.sys.sunrise);
  const sunSet = unixToStandartTime(data.sys.sunset);

  const html = `  <div class="main ">
  <h4 class="current_city">${data.name}</h4>
  <p class="current_status">${data.weather[0].description}</p>
  <img
    class="img__png"
     src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
    alt="Cloudy"
  />
  <h1 class="current__tempreture">${Math.floor(data.main.temp - 273.15)}° C</h1>
  <p class="current__date">${today}</p>
</div>
<div class="detail">
  <p>Sunrise<br />${sunRise}</p>
  <p>Feels Like<br />${Math.floor(data.main.feels_like - 273.15)}°C</p>
  <p>Humidity<br />${data.main.humidity}%</p>
  <p>Sunset<br />${sunSet}</p>
  <p>Dew Point<br />${Math.round(
    data.main.temp - 273.15 - (100 - data.main.humidity) / 5
  )}°C</p>
  <p>Wind<br />${data.wind.speed}km/h</p>
</div>`;
  // console.log(typeof html);
  wrapper.insertAdjacentHTML("beforeend", html);
  wrapper.style.opacity = 1;
};

//? Consuming promise with async and await
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
getPosition();

// Weather app
const weatherApp = async function () {
  //Geolocation
  const pos = await getPosition();
  const { latitude: lat, longitude: lng } = pos.coords;
  //  console.log(pos);

  // Fetching data

  const key = "3522295ddc2c99652936b5eb8af9693f";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key}`
  );

  // Getting data from promise
  const data = await response.json();
  // console.log(data);

  //FreeCodeCamp Api
  // const response = await fetch(
  //   `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${lng}`
  // );

  // // Getting data from promise
  // const data = await response.json();
  // console.log(data);
  renderWeather(data);
};
weatherApp();
