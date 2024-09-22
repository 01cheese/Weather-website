// state
let currCity = "London";  // Город по умолчанию
let units = "metric";
let inactiveTimeout;

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


// Добавляем случайные города, которые сайт будет вводить
const randomCities = ["Paris", "New York", "Tokyo", "Sydney", "Moscow", "Rio de Janeiro", "Berlin", "Toronto", "Rome", "Istanbul"];

// Функция, которая выбирает случайный город и запрашивает погоду
function autoInputCity() {
    let randomCity = randomCities[Math.floor(Math.random() * randomCities.length)];
    searchInput.value = randomCity;  // Вводим случайный город
    currCity = randomCity;  // Обновляем текущий город
    getWeather();  // Запрашиваем погоду для этого города
}

// Функция сброса таймера активности
function resetInactiveTimer() {
    clearTimeout(inactiveTimeout);  // Сброс таймера, если был запущен
    inactiveTimeout = setTimeout(() => {
        autoInputCity();  // Автоматический ввод города, если пользователь бездействует 2 минуты
    }, 60000);  // 120000 миллисекунд = 2 минуты
}

// Запуск таймера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    resetInactiveTimer();  // Запускаем таймер бездействия
    getWeather();  // Загружаем погоду для города по умолчанию
});

// Отслеживание активности пользователя
['mousemove', 'keydown', 'scroll', 'click'].forEach(event => {
    document.addEventListener(event, resetInactiveTimer);
});


// search
document.querySelector(".weather__search").addEventListener('submit', e => {
    e.preventDefault();
    currCity = searchInput.value;
    getWeather();
    searchInput.value = "";
});

// Автозаполнение для предложений
searchInput.addEventListener('input', () => {
    let query = searchInput.value;
    if (query.length > 2) { // Минимум 3 символа для автоподбора
        fetchSuggestions(query);
    } else {
        searchSuggestions.innerHTML = ''; // Очистить предложения, если ввода недостаточно
    }
});


// Add these two selectors for the Celsius and Fahrenheit unit elements
let unitCelsius = document.querySelector(".weather_unit_celsius");
let unitFahrenheit = document.querySelector(".weather_unit_farenheit");

// Function to switch between units
unitCelsius.addEventListener('click', () => {
    if (units !== "metric") {
        units = "metric";  // Switch to Celsius
        unitCelsius.classList.add("active");
        unitFahrenheit.classList.remove("active");
        getWeather();  // Fetch the weather data again with the new units
    }
});

unitFahrenheit.addEventListener('click', () => {
    if (units !== "imperial") {
        units = "imperial";  // Switch to Fahrenheit
        unitCelsius.classList.remove("active");
        unitFahrenheit.classList.add("active");
        getWeather();  // Fetch the weather data again with the new units
    }
});



function fetchSuggestions(query) {
    const API_KEY = '69605561ac6622711e149e588ecd5411';
    fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            searchSuggestions.innerHTML = ''; // Очистить предыдущие предложения
            if (data.count > 0) {
                data.list.forEach(city => {
                    let suggestion = document.createElement("p");
                    suggestion.textContent = `${city.name}, ${convertCountryCode(city.sys.country)}`;
                    suggestion.addEventListener('click', () => {
                        currCity = city.name;
                        getWeather();
                        searchSuggestions.innerHTML = ''; // Очистить предложения после выбора
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

// Преобразование кода страны в название
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country);
}

// Функция получения данных о погоде


// Селектор для видео
let weatherBackground = document.querySelector(".weather__background");

function updateBackground(weatherCondition, isDayTime) {
    // Массивы видео для дневной и ночной погоды
    let dayVideos = {
        "Clear": "default.mp4",
        "Clouds": "cloudy_day.mp4",
        "Rain": "rain_day.mp4",
        "Snow": "snow_day.mp4",
        "Thunderstorm": "thunderstorm_day.mp4",
        "Drizzle": "drizzle_day.mp4",
        "Mist": "mist_day.mp4",
        // Добавь другие типы погоды
    };

    let nightVideos = {
        "Clear": "default.mp4",
        "Clouds": "cloudy_night.mp4",
        "Rain": "rain_night.mp4",
        "Snow": "snow_night.mp4",
        "Thunderstorm": "thunderstorm_night.mp4",
        "Drizzle": "drizzle_night.mp4",
        "Mist": "mist_night.mp4",
        // Добавь другие типы погоды
    };

    // Проверяем время суток и выбираем правильное видео
    let selectedVideo = isDayTime ? dayVideos[weatherCondition] : nightVideos[weatherCondition];

    // Обновляем источник видео
    weatherBackground.src = `${selectedVideo}`;
}

// Модифицируем функцию getWeather
function getWeather() {
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

            // Получаем текущий тип погоды и время суток
            let weatherCondition = data.weather[0].main;
            let isDayTime = data.dt >= data.sys.sunrise && data.dt <= data.sys.sunset;

            // Обновляем видеофон
            updateBackground(weatherCondition, isDayTime);

            // Обновление иконки погоды с fallback
            let iconCode = data.weather[0].icon;
            let iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
            let img = new Image();
            img.src = iconUrl;
            img.onload = () => {
                weather__icon.innerHTML = `<img src="${iconUrl}" alt="Weather icon">`;
            };
            img.onerror = () => {
                weather__icon.innerHTML = `<p>Icon not available</p>`;
                console.error(`Failed to load weather icon with code: ${iconCode}`);
            };

            weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`;
            weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
            weather__humidity.innerHTML = `${data.main.humidity}%`;
            weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
            weather__pressure.innerHTML = `${data.main.pressure} hPa`;
            errorMessage.textContent = ''; // Очистить сообщение об ошибке, если запрос успешен
        })
        .catch(err => {
            errorMessage.textContent = 'City not found. Please try again.';
            console.error(err);
        });
}

