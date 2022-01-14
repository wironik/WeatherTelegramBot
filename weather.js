class Weather
{
	//объект класса погоды, содержит в себе ровно ничего
	constructor()
	{
		console.log("class weather object created")
	}
	//обращение к серверу за информацией о погоде
	getCurrent(city)
	{
		var {keyWeather} = require('./keys.js')
		let request = require('request');
		return new Promise(function (resolve, reject) 
		{
			request(encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&units=metric&appid=${keyWeather}`), function (error, res, body) 
			{
				if (!error && res.statusCode == 200) 
				{
					//парсим информацию, передаем текст и координаты
					let data = JSON.parse(body);
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
					//в случае, если город не найден
					console.log('Данные не найдены')
					resolve({someText:'not found', lat:0, lon:0})
				}
				else 
				{
					//в случае, если проблемы на стороне сервера или url некорректный
					console.log('Ошибка')
					reject(error);
				}
			});
		});
	}
	//(нигде не используется) пример структуры с промисом
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
}
module.exports=Weather