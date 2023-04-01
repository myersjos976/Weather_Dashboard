var searchButton = document.getElementById("search-button");
var historyList;

// Returns current date as a string.
function getCurrentDate()
{
    const dayjsObj = dayjs();
    return dayjsObj.format("MM/DD/YYYY");
}

// Returns current time as a string.
function getCurrentTime()
{
    const dayjsObj = dayjs();
    return dayjsObj.format("MM/DD/YYYY");
}

// Grabs user history from local storage of cities searched for.
function getHistory()
{
    if (localStorage.getItem("localHistory") !== null) {
        historyList = JSON.parse(localStorage.getItem("localHistory"));
    }

    else {
        historyList = [];
    }
}

// Clears user history and local storage when called.
function clearHistory()
{
    localStorage.clear();
    historyList = [];
}

/*
    Grabs today's forecast for the given city.
    Displays the 5 day forecast for the given city.
    Takes the city and stores it in search history.
*/
function getForecast(cityName)
{
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=f8ce8be1f8cd78a294e4234bae044e80")
    
    .then(response => response.json())
    .then(data => {
        // CREATE'S TODAY'S FORECAST
        // Header containing city name, today's date, and weather icon. 
        var cityHeader = document.getElementById("city-header");
        cityHeader.innerHTML = data.city.name + " (" + getCurrentDate() + ")";
        
        // Weather icon retrieval not working.
        // document.ElementById("icon-0").src = "https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png";

        // Converts user's entered city to proper format from OpenWeather and adds it to history.
        cityName = data.city.name;
        if (historyList.includes(cityName) === false) {
            // If history is less than 10, push the new city to the end of the array.
            if (historyList.length < 10) {
                historyList.push(cityName);
            }
            // Else, remove the oldest city and then push the new city to the end of the array.
            else {
                historyList.shift();
                historyList.push(cityName);
            }
        }

        // Temperature
        const nodeTemp0 = document.createElement("p");
        nodeTemp0.setAttribute("id", "temp-content-0");
        document.getElementById("temp-0").appendChild(nodeTemp0);
        document.getElementById("temp-content-0").innerHTML = "Temperature: " + Number(data.list[0].main.temp - 273.15).toFixed(1) + "° F";

        // Wind Speed
        const nodeWind0 = document.createElement("p");
        nodeWind0.setAttribute("id", "wind-content-0");
        document.getElementById("wind-0").appendChild(nodeWind0);
        document.getElementById("wind-content-0").innerHTML = "Wind: " + Number(data.list[0].wind.speed * 2.237).toFixed(1) + " MPH";
        
        // Humidity
        const nodeHum0 = document.createElement("p");
        nodeHum0.setAttribute("id", "hum-content-0");
        document.getElementById("hum-0").appendChild(nodeHum0);
        document.getElementById("hum-content-0").innerHTML = "Humidity: " + Number(data.list[0].main.humidity * 2.237).toFixed(1) + "%";

        // Creates 5 day forecast
        localStorage.setItem("localHistory", JSON.stringify(historyList));
    })

    // If the fetch failed, return alert to user to check their internet connection.
    .catch(err => alert("Unable To Retrieve Weather: Check that city spelling is correct."))
}

getHistory();

// Creates search button that grabs user input and gets forecast for that city from getForecast function.
searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    var cityNameInput = document.getElementById("search-box").value;
    getForecast(cityNameInput);
});