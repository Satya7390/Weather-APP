const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searhForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// Initial variables 

let currentTab = userTab;
const API_KEY = 'c065ac6a6dba390a0a20a40b3c9e47f5';
currentTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");

            searchForm.classList.add ("active");
        }
        else{
               searchForm.classList.remove("active");
               userInfoContainer.classList.remove("active");

                 // now I'm in waether tab so for display weather 
               getfromSessionStorage();
            }


    }
    
}

userTab.addEventListener('click' , ()=>{
    //pass  clicked tab as a input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click' , ()=>{
    // pass clicked tab as a input parameter
    switchTab(searchTab);
});

function getfromSessionStorage(){

    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const {lat , lon} = coordinates; 

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API CALL

    try {
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    } catch (error) {
        loadingScreen.classList.remove("active");
        console.log("data not supported");
    }
    
}


function renderWeatherInfo(weatherInfo){

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humudity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${ weatherInfo?.sys?.country.toLowerCase()}.png` ;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png` ;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humudity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Please allow location to access weather information");
    }

}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener('click' , getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})



async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    const errorImage = document.querySelector(".err");
    const pageNotFound = document.querySelector("[errFound");
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

         // If the city is not found, display the error image and message
         if (data.cod === "404") {
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("active"); 

            
            errorImage.classList.add("active");
            pageNotFound.classList.add("active");
            errorImage.alt = "City not found. Please try again.";
            return;
         } 

          // If valid data is returned
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        errorImage.classList.remove("active"); 
        pageNotFound.classList.remove("active");
        renderWeatherInfo(data);
        
    } catch (error) {
        loadingScreen.classList.remove("active");
        console.log("An error occurred:", error);
    }
    
}






























// console.log("Weather APP open");

// const API_KEY  = "c065ac6a6dba390a0a20a40b3c9e47f5"

// const lat = 27;
// const lon= 11;

// async function Weather() {

//     try {
//         const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);


//         let data = await response.json();
//         console.log("data=> ", data);

//         let newPara = document.createElement('p');

//         newPara.textContent = `${data?.main?.temp} °C `;

//         // console.log(newPara);

//         document.body.appendChild(newPara);

//         console.log("API fetched successfully");
//     } catch (error) {
//         console.log("Error to fetch api");
//     }

// }

// Weather();

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("No geolocation supported");
//     }

    
// }

// function showPosition(position){
//     let lat = position.coords.latitude;
//     let long = position.coords.longitude;

//     console.log(lat);
//     console.log(long);
// }

// getLocation();