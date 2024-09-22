// state
let currCity = "London";
let units = "metric";

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax");
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');
let searchInput = document.querySelector(".weather__searchform");
let searchSuggestions = document.createElement("div");
searchSuggestions.className = "search__suggestions";
document.querySelector(".weather__search").appendChild(searchSuggestions);
let errorMessage = document.createElement("p");
errorMessage.className = "error-message";
document.querySelector(".weather__search").appendChild(errorMessage);

// search
document.querySelector(".weather__search").addEventListener('submit', e => {
    e.preventDefault();
    currCity = searchInput.value;
    getWeather();
    searchInput.value = "";
})

// Autocomplete function to fetch city suggestions
searchInput.addEventListener('input', () => {
    let query = searchInput.value;
    if (query.length > 2) { // Start fetching suggestions when user types more than 2 characters
        fetchSuggestions(query);
    } else {
        searchSuggestions.innerHTML = ''; // Clear suggestions when input is too short
    }
});

function fetchSuggestions(query) {
    const API_KEY = '69605561ac6622711e149e588ecd5411';
    fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            searchSuggestions.innerHTML = ''; // Clear previous suggestions
            if (data.count > 0) {
                data.list.forEach(city => {
                    let suggestion = document.createElement("p");
                    suggestion.textContent = `${city.name}, ${convertCountryCode(city.sys.country)}`;
                    suggestion.addEventListener('click', () => {
                        currCity = city.name;
                        getWeather();
                        searchSuggestions.innerHTML = ''; // Clear suggestions after selection
                    });
                    searchSuggestions.appendChild(suggestion);
                });
            } else {
                let noResult = document.createElement("p");
                noResult.textContent = "No results found";
                searchSuggestions.appendChild(noResult);
            }
        })
        .catch(err => console.error(err));
}

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
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("City not found");
            }
            return res.json();
        })
        .then(data => {
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
            errorMessage.textContent = ''; // Clear error message if successful
        })
        .catch(err => {
            errorMessage.textContent = 'City not found. Please try again.';
            console.error(err);
        });
}
