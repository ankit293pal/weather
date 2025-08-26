const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');  
const currentDateTxt = document.querySelector('.current-date-txt');  
const forecastItemsContainer = document.querySelector('.forecast-items-container');  

const apiKey = '55931d174f0419eee0dd373c4e1eec26';

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;  
    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(mainCondition) {
    switch (mainCondition.toLowerCase()) {
        case 'clear':
            return 'https://cdn-icons-png.flaticon.com/512/3222/3222800.png'; 
        case 'clouds':
            return 'https://tse2.mm.bing.net/th?id=OIP.-ZsZYvYapxsy1wgiZm6wjgHaF6&pid=Api&P=0&h=180'; 
        case 'rain':
            return 'https://img.freepik.com/free-vector/storm-cloud-rain_23-2147493355.jpg?w=900&t=st=1728874987~exp=1728875587~hmac=230a27796c59d92d723d3e6d6f746fcd29bce2c69b2e0397a2e107eec651d207';  
        case 'thunderstorm':
            return 'https://tse1.mm.bing.net/th?id=OIP.puFvyheaI7cDwWPDdDCJCgHaIP&pid=Api&P=0&h=180'; 
        case 'drizzle':
            return 'https://tse2.mm.bing.net/th?id=OIP.YpHunJak-iR_iYHS7BnmMAHaEK&pid=Api&P=0&h=180'; 
        case 'snow' :
            return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXFPbwYL_DuCcAV07l38FjB9mvVxKSUQRLjg&s';      
        default:
            return 'https://cdn-icons-png.flaticon.com/512/6368/6368753.png';    
    }
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    };
    return currentDate.toLocaleDateString('en-GB', options);  
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);

    if (weatherData.cod !== 200) {  
        showDisplaySection(notFoundSection);
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ main }],  
        wind: { speed },
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + ' %';
    windValueTxt.textContent = speed + ' m/s';

    currentDateTxt.textContent = getCurrentDate();

    
    weatherSummaryImg.src = getWeatherIcon(main);
    
    await updateForecastsInfo(city);
    showDisplaySection(weatherInfoSection);
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];  

    forecastItemsContainer.innerHTML = '';
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather);
        }
    });
}



function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ main }],  
        main: { temp },
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short',
    };
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption); 

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="${getWeatherIcon(main)}" class="forecast-item-img"> <!-- Use the correct weather icon -->
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>     
    `;

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none');

    section.style.display = 'flex';
}

