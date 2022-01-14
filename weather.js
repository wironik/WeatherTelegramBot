class Weather
{
	constructor()
	{
		console.log("class weather object created")
	}
	getCurrent(city)
	{
		var {keyWeather, lang} = require('./keys.js')
		let request = require('request');
		return new Promise(function (resolve, reject) 
		{
			request(encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&units=metric&appid=${keyWeather}`), function (error, res, body) 
			{
				if (!error && res.statusCode == 200) 
				{
					//resolve(body);
					let data = JSON.parse(body);
					//console.log(data)
					let parseText = `Погода в городе - ${data.name}, ${data.sys.country}:
					-Температура: ${data.main.temp}C, ${data.weather[0].description};
					-Скорость ветра: ${data.wind.speed} м/с;
					-Влажность: ${data.main.humidity}%;
					-Давление: ${data.main.pressure} мм`
					console.log("Данные: ",parseText)
					resolve({someText:parseText, lat:data.coord.lat, lon:data.coord.lon})
				} 
				else if (!error && res.statusCode==404)
				{
					console.log('Данные не найдены')
					resolve("not found")
				}
				else 
				{
					console.log('Ошибка')
					reject(error);
				}
			});
		});
	}
	requestData(url)
	{
		let request = require('request');
		return new Promise(function (resolve, reject) 
		{
			request(url, function (error, res, body) 
			{
				if (!error && res.statusCode == 200) 
				{
					resolve(body);
				} 
				else 
				{
					reject(error);
				}
			});
		});
	}
	getPicture(x,y)
	{
		//this.url='https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=59.5350&lon=30.5241&zoom=10';
		//`https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${keyWeather}`
		var {keyWeather} = require('./keys.js')
		
		let request = require('request');
		return new Promise(function (resolve, reject) 
		{
			request(`https://tile.openweathermap.org/map/temp_new/10/${x}/${y}.png?appid=${keyWeather}`, function (error, res, body) 
			{
				if (!error && res.statusCode == 200) 
				{
					resolve(body);
				} 
				else 
				{
					reject(error);
				}
			});
		});
		
		
	}

}
module.exports=Weather