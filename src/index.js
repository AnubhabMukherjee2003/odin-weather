import "./styles.css";
import { setTheme } from "./setTheme";

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.className = theme;
}

async function fetchWeatherData(city) {
    try {
        const url=`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=WDYKGNG87FSUG7FKBMALV7QV8`
        // console.log(url)
        const response = await fetch(url, {mode: 'cors'});
        const data = await response.json();
        return data.days[0];
        // console.log(data.days[0])
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function fetchGif(temp) {
    try {
        const searchTerm = temp > 85 ? 'hot weather' : 'cold weather';
        const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=ITzZlLkD1rFWjPH5ezMigReBWlQYCK2w&s=${searchTerm}`, {mode: 'cors'});
        const data = await response.json();
        return data.data.images.original.url;
    } catch (error) {
        console.error('Error fetching GIF:', error);
    }
}

async function updateWeatherDisplay(city) {
    try {
        // Show loading state
        document.getElementById('weatherGif').src = './loading.gif';
        
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            const {temp, description, humidity, feelslike} = weatherData;
            // console.log(temp, description, humidity, feelslike);
            document.getElementById('temperature').textContent = `Temperature: ${temp}°F`;
            document.getElementById('description').textContent = `Description: ${description}`;
            document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
            document.getElementById('feelsLike').textContent = `Feels like: ${feelslike}°F`;
            
            const gifUrl = await fetchGif(temp);
            if (gifUrl) {
                document.getElementById('weatherGif').src = gifUrl;
            } else {
                document.getElementById('weatherGif').src = './placeholder.jpg';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('weatherGif').src = './placeholder.jpg';
    }
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        updateWeatherDisplay(city);
    }
});

document.querySelector('.theme-toggle').addEventListener('click', setTheme);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const theme = e.matches ? 'dark' : 'light';
    document.documentElement.className = theme;
});

initializeTheme();
updateWeatherDisplay('Kolkata')