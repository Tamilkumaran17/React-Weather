import { useEffect, useState } from 'react'

import searchIcon from "./assets/searchicon.png"
import clearDay from "./assets/clearDay.png"

import humidityicon from "./assets/humidityicon.png"
import windicon from "./assets/windicon.png"
import brokenClouds from "./assets/brokenClouds.png"
import clearNight from './assets/clearNight.png';
import cloudicon from './assets/cloudicon.png';
import fewcloudsday from './assets/fewcloudsday.png';
import fewcloudsnight from './assets/fewcloudsnight.png';
import mist from './assets/mist.png';
import rainDay from './assets/rainDay.png';
import rainNight from './assets/rainNight.png';
import searchicon from './assets/searchicon.png';
import shower from './assets/shower.png';
import Snowicon from './assets/Snowicon.png';
import thunderstrom from './assets/thunderstrom.png';






import './App.css'

const WeatherUpdate = ({icon,temp,city,country,lat,lon,humid,wind}) =>{
  return(
    <>
  <div className="image">
    <img src={icon} alt="clearicon" />
  </div>
  <div className="temp">
    {temp}℃
  </div>
  <div className="location">{city}</div>
  <div className="country">{country}</div>
  <div className="cord">
    <div>
      <span className="lat">latitude</span>
      <span>{lat}</span>
    </div>
    <div>
      <span className="lon">longitude</span>
      <span>{lon}</span>
    </div>
  </div>

  <div className="data-container">
    <div className="element">
      <img src={humidityicon} alt="humidity" className='icon' />
      <div className="data">
        <div className="humidity-percent">{humid}%</div>
        <div className="text">Humidity</div>
      </div>
    </div>
    <div className="element">
      <img src={windicon} alt="wind" className='icon' />
      <div className="data">
        <div className="wind-percent">{wind}Km/h</div>
        <div className="text">Wind Speed</div>
      </div>
    </div>

  </div>
  
  </>
  );
};

function App() {

  let api_key="355a8e1f1ba6aeacdc860d6306cac950";

  const [text,setText] = useState("Chennai");
  const [icon,setIcon] = useState(clearDay);
  const [temp,setTemp] = useState(0);
  const [city,setCity] = useState("");
  const [country,setCountry] = useState("");
  const [lat,setLat] = useState(0);
  const [lon,setLon] = useState(0);
  const [humidity,setHumidity] = useState(0);
  const [wind,setWind] = useState(0);

  const [cityNotFound , setCityNotFound] = useState(false);
  const [loding , setLoding] = useState(false);
  const [error,setError]= useState(null);

  const sendNotification = () => {
    // Fetch weather data
    fetchWeatherData();
    // Display notification with weather information
    // You can use browser's Notification API to display notification
    // Example:
    // new Notification(`Current weather in ${city}`, {
    //   body: `Temperature: ${temp}°C, Humidity: ${humidity}%, Wind: ${wind}km/h`
    // });
  };
  useEffect(() => {
    // Schedule notification to run at custom time (e.g., 8:00 AM)
    const customNotificationTime = "08:00"; // Set your custom notification time here
    const [hours, minutes] = customNotificationTime.split(":").map(Number);
    const now = new Date();
    const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const timeUntilNotification = notificationTime - now;

    if (timeUntilNotification > 0) {
      setTimeout(sendNotification, timeUntilNotification);
    }
  }, []);

  const weatherIconMap={
    "01d" : clearDay,
    "01n" : clearNight,
    "02d" : fewcloudsday,
    "02n" : fewcloudsnight,
    "03d" : cloudicon,
    "03n" : cloudicon,
    "04d" : brokenClouds,
    "04n" : brokenClouds,
    "09d" : shower,
    "09n" : shower,
    "10d" : rainDay,
    "10n" : rainNight,
    "11n" : thunderstrom,
    "11d" : thunderstrom,
    "13d" : Snowicon,
    "13n" : Snowicon,
    "50d" : mist,
    "50n" : mist
  }



const search = async ()=>{
  setLoding(true);
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

  try{
    let result = await fetch(url);
    let data = await result.json();
    console.log(data);
    if(data.cod === "404"){
      console.log("city not found ");
      setCityNotFound(true);
      setLoding(false);
      return;
    }

    setHumidity(data.main.humidity);
    setWind(data.wind.speed);
    setTemp(Math.floor(data.main.temp));
    setCity(data.name);
    setCountry(data.sys.country);
    setLat(data.coord.lat);
    setLon(data.coord.lon);
    setCityNotFound(false);

    const weatherIconCode = data.weather[0].icon;
    setIcon(weatherIconMap[weatherIconCode] || clearDay);

  }catch(error){
    console.log("An error occured :" ,error.message);
    setError("An error occured while fetching weather data.");
  }finally{
    setLoding(false);
  }
}

useEffect(function (){
  search();
},[])

const handleKeyDown =(e)=>{
  if(e.key==="Enter"){
    search();
  }

}
  const handleInputText = (e)=>{
    setText(e.target.value);
  }

  return (
    <>
      
        <div className="container">
          <div className="input-container">
            <input type="text" className="cityinput" placeholder='Search city' onChange={handleInputText} value={text} onKeyDown={handleKeyDown}/>
            <div className="search-icon">
              <img src={searchIcon} alt="searchicon" className='searchicon' onClick={search}/>
            </div>
          </div>
          
            {loding && <div className="loding-message">Loading...</div>}
            {error && <div essagclassName="error-me">{error}</div>}
            {cityNotFound &&<div className="city-not-found">city not found</div>}

            {!loding && !cityNotFound &&  <WeatherUpdate icon={icon} temp={temp} city={city} country={country} lat={lat} lon={lon} humid={humidity} wind={wind} / >
}
        </div>
        

    </>
  )
};

export default App