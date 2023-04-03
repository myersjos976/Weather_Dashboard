var searchButton = document.getElementById("search-button");
var historyList;

//Takes in a date from data.list and converts its format to mm/dd/yyyy.
function formatDate(date)
{
    var nthDtArray = date.split(" ");
    var nthDate = nthDtArray[0];
    nthDtArray = nthDate.split("-");
    nthDate = nthDtArray[1] + "/" + nthDtArray[2] + "/" + nthDtArray[0];
    return nthDate;
}

// Grabs user history from local storage of cities searched for.
function getHistory()
{
    if (localStorage.getItem("localHistory") !== null) {
        historyList = JSON.parse(localStorage.getItem("localHistory"));

        // Create buttons for cities in history.
        if (historyList.length > 0) {
            var buttonList = [];
            for (let i = 0; i < historyList.length; i++)
            {
                // Create the button and add it to buttonList.
                buttonList[i] = document.createElement("button");              
                buttonList[i].setAttribute("id", "button-" + i);
                buttonList[i].setAttribute("class", "btn");

                // Give it a label and append it to its parent.
                buttonList[i].innerHTML = historyList[i];
                document.getElementById("history-" + i).append(buttonList[i]);

                let city = buttonList[i].innerHTML;

                //Create an event listener to make the button functional.
                buttonList[i].addEventListener("click", function(event) {
                    event.preventDefault();
                    getForecast(city);
                });
            }
        }
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
    Displays today's forecast for the given city.
    Displays the 5 day forecast for the given city.
    Takes the city and stores it in search history.
*/
function getForecast(cityName)
{
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=f8ce8be1f8cd78a294e4234bae044e80")
    
    .then(response => response.json())
    .then(data => {
        // CREATES TODAY'S FORECAST
        // Header containing city name, today's date, and weather icon. 
        var cityHeader = document.getElementById("city-header");
        cityHeader.innerHTML = data.city.name + " (" + formatDate(data.list[0].dt_txt) + ")";

        // Weather Icon
        var icon0 = document.getElementById("icon-0");
        icon0.src = "https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png";
        icon0.alt = data.list[0].weather[0].main + " (" + data.list[0].weather[0].description + ")";

        // Temperature
        const nodeTemp0 = document.createElement("p");
        nodeTemp0.setAttribute("id", "temp-content-0");
        document.getElementById("temp-0").appendChild(nodeTemp0);
        document.getElementById("temp-content-0").innerHTML = "Temperature: " + Number(1.8 * (data.list[0].main.temp - 273) + 32).toFixed(1) + "° F";

        // Wind Speed
        const nodeWind0 = document.createElement("p");
        nodeWind0.setAttribute("id", "wind-content-0");
        document.getElementById("wind-0").appendChild(nodeWind0);
        document.getElementById("wind-content-0").innerHTML = "Wind: " + Number(data.list[0].wind.speed * 2.237).toFixed(1) + " MPH";
        
        // Humidity
        const nodeHum0 = document.createElement("p");
        nodeHum0.setAttribute("id", "hum-content-0");
        document.getElementById("hum-0").appendChild(nodeHum0);
        document.getElementById("hum-content-0").innerHTML = "Humidity: " + Number(data.list[0].main.humidity).toFixed(1) + "%";


        // CREATES 5 DAY FORECAST
        var dayCount = 0;
        var dtArray = data.list[0].dt_txt.split(" ");
        var currentDate = dtArray[0];
        for(let i = 0; i < data.list.length && dayCount < 5; i++)
        {
            // Only grab 5 day forecast from data.list if the time is 12pm and the date isn't today.
            // Ensures that the weather is only grabbed once per day for 5 day forecast and today's forecast isn't grabbed again. 
            if (data.list[i].dt_txt.includes("12:00:00") && (data.list[i].dt_txt.includes(currentDate) === false)) {              
                dayCount++;

                // Weather Date and Icon
                let nthDate = formatDate(data.list[i].dt_txt);
                let dateHeader = document.getElementById("date-header-" + dayCount);
                dateHeader.innerHTML = nthDate;
                // let icon = document.getElementById("icon-" + dayCount);
                // icon.src = "https://openweathermap.org/img/wn/" + data.list[i].weather[i].icon + "@2x.png";
                // icon.alt = data.list[i].weather[i].main + " (" + data.list[i].weather[i].description + ")";

                // Temperature
                let nodeTemp = document.createElement("p");
                nodeTemp.setAttribute("id", "temp-content-" + dayCount);
                document.getElementById("temp-" + dayCount).appendChild(nodeTemp);
                document.getElementById("temp-content-" + dayCount).innerHTML = "Temp: " + Number(1.8 * (data.list[i].main.temp - 273) + 32).toFixed(1) + "° F";

                // Wind Speed
                let nodeWind = document.createElement("p");
                nodeWind.setAttribute("id", "wind-content-" + dayCount);
                document.getElementById("wind-" + dayCount).appendChild(nodeWind);
                document.getElementById("wind-content-" + dayCount).innerHTML = "Wind: " + Number(data.list[i].wind.speed * 2.237).toFixed(1) + " MPH";

                // Humidity
                let nodeHum = document.createElement("p");
                nodeHum.setAttribute("id", "hum-content-" + dayCount);
                document.getElementById("hum-" + dayCount).appendChild(nodeHum);
                document.getElementById("hum-content-" + dayCount).innerHTML = "Hum: " + Number(data.list[i].main.humidity).toFixed(1) + "%";
            }           
        }


        // ADD CITY TO HISTORY
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

        // Now, update local storage.
        localStorage.setItem("localHistory", JSON.stringify(historyList));
    })

    // If the fetch failed, return alert to user to check their internet connection.
    .catch(err => alert("Unable To Retrieve Weather: Check that city spelling is correct."))
}

getHistory();

// Creates search button that grabs user input and gets forecast for that city from getForecast function.
searchButton.addEventListener("click", function(event) {
    event.preventDefault();
    let cityNameInput = document.getElementById("search-box").value;
    if(cityNameInput.length > 0) {
        getForecast(cityNameInput);
    }
});