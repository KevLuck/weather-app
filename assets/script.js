const apiKey = '86126605dbb286cd48feed0f4cbce593';
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const clearButton = document.querySelector("#clear-button");
const pastSearchEl = document.querySelector("#past-search");
const currentConditionsEl = document.querySelector("#currentConditions");
const fiveDayForecastEl = document.querySelector("#fiveDayForecast");

let pastSearch = JSON.parse(localStorage.getItem('pastSearch')) || [];

searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    const city = cityInput
        .value
        .trim();
    if (pastSearch.includes(city)) {
        
    } else {
        pastSearch.push(city);
        localStorage.setItem('pastSearch', JSON.stringify(pastSearch));
        renderSearchHistory();
    }
    cityInput.value = '';

    const params = new URLSearchParams({q: city, appid: apiKey});

    fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`)
        .then(
            res => res.json()
        )
        .then(data => {
            const temperatureFahrenheit = (data.main.temp - 273.15) * 9 / 5 + 32;
            currentConditionsEl.innerHTML = `
        <div class="weather-item1">
         
          <h3>Current Weather In ${data
                .name} (${new Date()
                .toLocaleDateString()})</h3>
          <img src="https://openweathermap.org/img/w/${data
                .weather[0]
                .icon}.png" alt="${data
                .weather[0]
                .description}">
          <p>Temperature: ${temperatureFahrenheit
                .toFixed(2)}°F</p>
          <p>Humidity: ${data
                .main
                .humidity}%</p>
          <p>Wind Speed: ${data
                .wind
                .speed} m/s</p>
        </div>
      `;

            return fetch(
                `https://api.openweathermap.org/data/2.5/forecast?${params}&units=imperial`
            );
        })
        .then(res => res.json())
        .then(data => {

            const forecastData = data
                .list
                .filter(item => item.dt_txt.includes('12:00:00'));

            fiveDayForecastEl.innerHTML = forecastData
                .map(
                    item => `
                    
        <div class="weather-item">
          <h4>${new Date(item.dt_txt).toLocaleDateString()}</h4>
          <img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
          <p>Temperature: ${item.main.temp}&deg;F</p>
          <p>Humidity: ${item.main.humidity}%</p>
          <p>Wind Speed: ${item.wind.speed} m/s</p>
        </div>
      `
                )
                .join('');
        })
        .catch(err => console.log(err));
});

pastSearchEl.addEventListener('click', searchHistoryCity);

function renderSearchHistory() {
    pastSearchEl.innerHTML = `
    <h3>Search History</h3>
    <ul>
      ${pastSearch
        .map(
            city => `<li>${city}</li>`
        )
        .join('')}
    </ul>
  `;
}

function searchHistoryCity(e) {
    if (e.target.tagName === 'LI') {
        cityInput.value = e.target.textContent;
        searchButton.click(); 
    }
}

clearButton.addEventListener('click', function () {
    localStorage.removeItem('pastSearch');
    pastSearch = [];
    renderSearchHistory();
});

renderSearchHistory();
