const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searhForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const API_KEY = 'c065ac6a6dba390a0a20a40b3c9e47f5';
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab) {
    if (clickedTab !== currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => switchTab(userTab));
searchTab.addEventListener('click', () => switchTab(searchTab));

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherData(coordinates.lat, coordinates.lon);
    }
}

async function fetchWeatherData(lat, lon) {
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        ]);

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(currentData);
        renderForecast(forecastData);

    } catch (error) {
        loadingScreen.classList.remove("active");
        alert("Failed to fetch weather data. Please try again.");
    }
}

function renderWeatherInfo(data) {
    document.querySelector("[data-cityName]").innerText = data?.name;
    document.querySelector("[data-countryIcon]").src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    document.querySelector("[data-weatherDesc]").innerText = data?.weather?.[0]?.description;
    document.querySelector("[data-weatherIcon]").src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    document.querySelector("[data-temp]").innerText = `${data?.main?.temp} °C`;
    document.querySelector("[data-windspeed]").innerText = `${data?.wind?.speed} m/s`;
    document.querySelector("[data-humidity]").innerText = `${data?.main?.humidity} %`;
    document.querySelector("[data-cloudiness]").innerText = `${data?.clouds?.all} %`;
    document.querySelector("[data-updatedTime]").innerText = `Last updated: ${new Date().toLocaleTimeString()}`;
}

function renderForecast(forecastData) {
    const forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = "";

    const dailyData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

    dailyData.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const icon = day.weather[0].icon;
        const temp = day.main.temp;

        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");
        forecastCard.innerHTML = `
            <p>${date}</p>
            <ttps://openweathermap.org/img/w/${icon}.png
            <p>${temp} °C</p>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherData(userCoordinates.lat, userCoordinates.lon);
}

document.querySelector("[data-grantAccess]").addEventListener('click', getLocation);

document.querySelector("[data-searhForm]").addEventListener('submit', (e) => {
    e.preventDefault();
    const city = document.querySelector("[data-searchInput]").value.trim();
    if (city) fetchCityWeather(city);
});

async function fetchCityWeather(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

                   throw new Error("City not found");
        }

        const { lat, lon } = data.coord;
        fetchWeatherData(lat, lon);

    } catch (error) {
        loadingScreen.classList.remove("active");
        alert(error.message || "Something went wrong.");
    }
}

document.querySelector("[data-userWeather]").addEventListener('click', () => location.reload());
``
