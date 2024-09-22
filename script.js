// state
let currCity = "London";
let units = "metric";

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax")
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');
let celsiusUnit = document.querySelector(".weather_unit_celsius");
let fahrenheitUnit = document.querySelector(".weather_unit_farenheit");

// search
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    e.preventDefault();
    currCity = search.value;
    getWeather();
    search.value = "";
})

// units
function toggleUnits(selectedUnit) {
    if (selectedUnit === "metric" && units !== "metric") {
        units = "metric";
        celsiusUnit.classList.add("active");
        fahrenheitUnit.classList.remove("active");
    } else if (selectedUnit === "imperial" && units !== "imperial") {
        units = "imperial";
        celsiusUnit.classList.remove("active");
        fahrenheitUnit.classList.add("active");
    }
    getWeather();
}

celsiusUnit.addEventListener('click', () => toggleUnits("metric"));
fahrenheitUnit.addEventListener('click', () => toggleUnits("imperial"));

function convertTimeStamp(timestamp, timezone){
    const convertTimezone = timezone / 3600;
    const date = new Date(timestamp * 1000);
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    }
    return date.toLocaleString("en-US", options);
}

// convert country code to name
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country);
}

function getWeather(){
    const API_KEY = '69605561ac6622711e149e588ecd5411';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`).then(res => res.json()).then(data => {
        city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
        datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
        weather__forecast.innerHTML = `<p>${data.weather[0].main}</p>`;
        weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
        weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
        weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`;
        weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
        weather__humidity.innerHTML = `${data.main.humidity}%`;
        weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
        weather__pressure.innerHTML = `${data.main.pressure} hPa`;
    });
}

document.body.addEventListener('load', getWeather());
