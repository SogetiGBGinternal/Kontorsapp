
let dt = new Date();
let strDate = dt.toLocaleString().substr(0, 10);
let baseURL = 'https://api.met.no/weatherapi';
let forecastBase = 'locationforecast/1.9';
let weatherIconBase = 'weathericon/1.1';
let latitude = 'lat=57.7072';
let longitude = 'lon=11.9668';  
let forecastLocation = 'Göteborg';
let forecastURL = baseURL + '/' + forecastBase + '/' + '?' + latitude + '&' + longitude;
let weatherIconURL;
let sunriseURL = baseURL + '/sunrise/2.0/?' + latitude + '&' + longitude + '&date=' + strDate + '&offset=+01:00';
let forecastStartDate;
let forecastResponeText;
let forecastArray = [];



document.addEventListener("DOMContentLoaded", function(event) { 

  let sunriseXML;

  /* Formats the datetime string to match the timestamps in the XML by date and hour, 
     format "yyyy-MM-ddThh" eg. "2019-02-27T18"' */
  function formatStartDate(date){
    let currentDT = date.toLocaleString();
    let currentYear = currentDT.substr(0, 10);
    let currentHour = currentDT.substr(11, 2);
    let dtForecastFrom = currentYear + 'T' + currentHour;
    return dtForecastFrom;
  }

  // Add hours to the current hour by the param "hours"
  function addHours(hours) {
    Date.prototype.addHours = function(h){
      this.setHours(this.getHours()+h);
      return this.getHours();
    }
    return new Date().addHours(hours);
  }

  // Generic function for AJAX GET requests
  function getXML(callback, url) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { 
            if (xhr.status === 200) {
              var parser = new DOMParser(),
              xmlDoc = parser.parseFromString(this.responseText, 'text/xml');
              callback(xmlDoc); 
            }
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
  }

  // Creates a forecast object and adds it to an array of forecasts
  function createForecastObject(fDate, fTime, fIcon, fTemp) {
    let forecastObj = {
      date: fDate,
      time: fTime,
      icon: fIcon,
      temperature: fTemp
    };  
    forecastArray.push(forecastObj);
  }

  // Get value from child > attribute 
  function getNodeValue1(nParent, nName, nAttr) {
    for(let i = 0; i < nParent.childNodes.length; i++){
        if(nParent.childNodes[i].nodeName === nName){
          return nParent.childNodes[i].getAttribute(nAttr);
        }
    }
  }

  // Get value from child > child > attribute 
  function getNodeValue2(nParent, nName, nAttr) {
    for(let i = 0; i < nParent.childNodes.length; i++){
      for(let x = 0; x < nParent.childNodes[i].childNodes.length; x++){
        if(nParent.childNodes[i].childNodes[x].nodeName === nName){
          return nParent.childNodes[i].childNodes[x].getAttribute(nAttr);
        }
      }
    }
  }

  // check if the forecast start time is between sunset and sunrise
  function checkTimePeriod(sunset, sunrise, forecastTimeFull) {
    let returnVal;
    let format = 'hh:mm:ss'
    let time = moment(forecastTimeFull, format),
      beforeTime = moment(sunset, format),
      afterTime = moment(sunrise, format).add(1, 'day');
    if (time.isBetween(beforeTime, afterTime)) {
      returnVal = true;
    }else {
      returnVal = false;
    }
    return returnVal;
  }

  // Check if the weather icon should have a moon or sun
  function IsNight(xml, forecastTimeFull){
    let timeNodes;
    let sunsetTS;
    let sunriseTS;
    let returnVal;
    
    try{
      timeNodes = xml.getElementsByTagName('time');
    }catch(error){
      // If the xml isn't ready we refresh the page
      console.log('Page was reloaded');
      window.location.reload(true);
    }

    for(let i = 0; i < timeNodes.length; i++){
      sunsetTS = getNodeValue1(timeNodes[i], 'sunset', 'time').substr(11, 8);
      sunriseTS = getNodeValue1(timeNodes[i], 'sunrise', 'time').substr(11, 8);
    }if(checkTimePeriod(sunsetTS, sunriseTS, forecastTimeFull)){
      returnVal = '&is_night=1';
    }else{
      returnVal = '';
    }
    return returnVal;
  }

  // Creates three forecasts with 3 hours interval
  function getForecastData(forecastXML, sunhoursXML, date) {
    let timeNodes;
    let forecastFrom;
    let forecastTime;
    let forecastTimeFull;
    let nextForecastStart;
    let forecastTo;
    let iconType;
    let temperature;
    let checkFirst = false;
    let checkSecond = false;
    timeNodes = forecastXML.getElementsByTagName('time'); 

    for(let i = 0; i < timeNodes.length; i++) { 
      forecastFrom = timeNodes[i].getAttribute('from').substr(0, 13);
      forecastTo = timeNodes[i].getAttribute('to').substr(0, 13);
      forecastDate = timeNodes[i].getAttribute('from').substr(0, 10);
      forecastTime = timeNodes[i].getAttribute('from').substr(11, 5);     
      nextForecastStart = timeNodes[i].getAttribute('from').substr(0, 11);
      
      // First Forecast
      if((forecastFrom === date) && (forecastTo === forecastFrom) && (checkFirst === false)){
        forecastTimeFull = timeNodes[i].getAttribute('from').substr(11, 8);
        temperature = getNodeValue2(timeNodes[i],'temperature', 'value');
        iconType = getNodeValue2(timeNodes[i+1], 'symbol', 'number');
        weatherIconURL = baseURL + '/' + weatherIconBase + '/?symbol=' + iconType + IsNight(sunhoursXML, forecastTimeFull) + '&content_type=image/png';
        createForecastObject(forecastFrom, forecastTime, weatherIconURL, temperature);
        checkFirst = true;
      } 
      
      // Second Forecast
      else if((forecastFrom === nextForecastStart + addHours(4)) && (forecastTo === forecastFrom) && (checkSecond === false)){     
        forecastTimeFull = addHours(4) + ':00:00';
        temperature = getNodeValue2(timeNodes[i],'temperature', 'value');
        iconType = getNodeValue2(timeNodes[i+1], 'symbol', 'number');
        weatherIconURL = baseURL + '/' + weatherIconBase + '/?symbol=' + iconType + IsNight(sunhoursXML, forecastTimeFull) + '&content_type=image/png';
        createForecastObject(forecastFrom, forecastTime, weatherIconURL, temperature);
        checkSecond = true;
      } 

      // Third Forecast
      else if((forecastFrom === nextForecastStart + addHours(8)) && (forecastTo === forecastFrom) && (checkSecond)){
        forecastTimeFull = addHours(8) + ':00:00';
        temperature = getNodeValue2(timeNodes[i],'temperature', 'value');
        iconType = getNodeValue2(timeNodes[i+1], 'symbol', 'number');
        weatherIconURL = baseURL + '/' + weatherIconBase + '/?symbol=' + iconType + IsNight(sunhoursXML, forecastTimeFull) + '&content_type=image/png';
        createForecastObject(forecastFrom, forecastTime, weatherIconURL, temperature);
        break; 
      } 
    }       
  }

  // Creates HTML for the Boostrap table header
  function createForecastTableHeader(){
  let forecastHeader = document.getElementById('tbl-weather');
  forecastHeader.insertAdjacentHTML(
    'beforeend',
    '<thead class="tbl-weather-thead">' +
          '<tr>' +
            '<th colspan="3" class="text-left">' + 
              '<p class="forecast-text-large">Väderprognos ' + forecastLocation + ' - ' +  strDate + '</p>' + 
            '</th>' +
          '</tr>' +
    '</thead>' +
    '<tbody id="tbl-weather-body"></tbody>'
    );
  }

  // Creates HTML to Bootstrap table body and adds each forecast with a separate row. 
  function createForecastTableBody(arr) {
    var forecastBody = document.getElementById('tbl-weather-body');
    for(var obj in arr) {
      forecastBody.insertAdjacentHTML(
        'beforeend', 
          '<tr>' +
            '<td class=" align-middle">' + 
              '<img src=' + '"' + arr[obj].icon + '"' + '>' +
            '</td>' +
            '<td class="forecast-text-small align-middle">' + 
              'kl ' + arr[obj].time +
            '</td>' +
            '<td class="forecast-text-small align-middle">' +
              'Temp: ' + arr[obj].temperature + '°' +
            '</td>' +
          '</tr>' 
      );
    }
  }

  // Gets the data needed from the sunrise API
  getXML(function (result) {
    forecastStartDate = formatStartDate(dt);
    sunriseXML = result;
  }, sunriseURL);
  
  // Gets the data needed from the forecast API
  getXML(function (result) {
    forecastStartDate = formatStartDate(dt);
    getForecastData(result, sunriseXML, forecastStartDate);
    createForecastTableHeader();
    createForecastTableBody(forecastArray);
  }, forecastURL);

});



  
  






