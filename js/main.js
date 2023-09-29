const cityCoordinatesAPI = './city_coordinates.json';
const display = document.querySelector('#display'); // div that displays the weather
const locationDisplay = document.querySelector('#search');

// grabs the location data in city_coordinates.json
const getLocationData = async () => {
    const data = await fetch(cityCoordinatesAPI);
    const jsonData = await data.json();
    return jsonData;
}

const displayLocationData = async () => {
    const payload = await getLocationData();
    const loopedData = payload.map((object) => {
        const { city, country } = object;

        return `
        <option value="${city}">${city}, ${country}</option>`
    })
    locationDisplay.innerHTML = loopedData;
}

displayLocationData();

locationDisplay.addEventListener('change', (event) => {
    const city = event.target.value;

    // gets the location data for the specified city
const getCityData = async (cityName) => {
    const payload = await getLocationData();
    const filteredPayload = payload.filter((cityData) => {
        if (cityData.city == cityName) {
            const data = {
                "city": cityData.city,
                "country": cityData.country,
                "latitude": cityData.latitude,
                "longitude": cityData.longitude
            }
            return data;
        } else {
            return
        }
    });
    return filteredPayload;
}

// uses the spicific location data to return the 7 day forcast
const getWeatherData = async (cityName) => {
    const filteredPayload = await getCityData(cityName);
    const res = await fetch(`http://www.7timer.info/bin/api.pl?lon=${filteredPayload[ 0 ].longitude}&lat=${filteredPayload[ 0 ].latitude}&product=civillight&output=json`);
    const data = await res.json();
    return data.dataseries;
}

// takes the 7 day forcast and displays it
const displayWeatherData = async (cityName) => {
    const weatherData = await getWeatherData(cityName);
    const dataDisplay = weatherData.map((object) => {
        const { date, weather, temp2m, wind10m_max } = object;
        var convertedDate = date.toString().replace(/(\d\d\d\d)(\d\d)(\d\d)/g, '$1/$2/$3');

        return `
        <div class="card">
            <div class="weather">
                <img src="./images/weather/${weather}.png" class="weather-icon">
                <h1 class="date">${convertedDate}</h1>
                <h2 class="city">${cityName}</h2>
                <div class="details">
                    <div class="col1">
                        <img src="./images/icons/icons8-thermometer-100.png">
                        <div>
                            <p class="tempMax">${temp2m.max}</p>
                            <p>Max Temp</p>
                        </div>
                        <div>
                            <p class="tempMin">${temp2m.min}</p>
                            <p>Min Temp</p>
                        </div>
                    </div>
                    <div class="col2">
                        <img src="./images/icons/icons8-wind-100.png">
                        <div>
                            <p class="windy">${wind10m_max} kph</p>
                            <p>Wind Speed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('')

    display.innerHTML = dataDisplay;
}

displayWeatherData(city);
})