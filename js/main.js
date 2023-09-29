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
    const res = await fetch(`https://www.7timer.info/bin/astro.php?lon=${filteredPayload[0].longitude}&lat=${filteredPayload[0].latitude}&ac=0&unit=metric&output=json&tzshift=0`);
    const data = await res.json();
    return data.dataseries;
}

// takes the 7 day forcast and displays it
const displayWeatherData = async (cityName) => {
    const weatherData = await getWeatherData(cityName);
    const dataDisplay = weatherData.map((object) => {
        const { date, weather, temp2m, wind10m_max } = object;
        var convertedDate = date.toString().replace(/(\d\d\d\d)(\d\d)(\d\d)/g, '$1/$2/$3');
        let weatherText = weather;
        switch (weather) {
            case "clear":
                weatherText = "Clear";
                break;
            case "pcloudy":
                weatherText = "Partly Cloudy";
                break;
            case "mcloudy":
                weatherText = "Cloudy";
                break;
            case "cloudy":
                weatherText = "Very Cloudy";
                break;
            case "lightrain":
                weatherText = "Light Rain or Showers";
                break;
            case "oshower":
                weatherText = "Occasional Showers";
                break;
            case "ishower":
                weatherText = "Isolated Showers";
                break;
            case "lightsnow":
                weatherText = "Light or Occasional Snow";
                break;
            case "rain":
                weatherText = "Rain";
                break;
            case "snow":
                weatherText = "Snow";
                break;
            case "rainsnow":
                weatherText = "Rain & Snow Mix";
                break;
            case "ts":
                weatherText = "Thunderstorm Possible";
                break;
            case "tsrain":
                weatherText = "Thunderstorm";
                break;
        }

        return `
        <div class="card">
            <div class="weather">
                <img src="./images/weather/${weather}.png" class="weather-icon">
                <h1 class="date">${weatherText}</h1>
                <h2 class="city">${convertedDate}</h2>
                <div class="details">
                    <div class="col1">
                        <img src="./images/icons/thermometer.png">
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
                        <img src="./images/icons/wind.png">
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