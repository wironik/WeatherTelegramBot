class Weather
{
	//объект класса погоды, содержит в себе город (для отображения), JSON текущей погоды и погоды на неделю
	constructor()
	{
		console.log("class weather object created")
		this.id=null
		this.info={}
		this.city=''
		this.week=''
	}
	//обращение к серверу за информацией о погоде
	
	//поиск информации
	requestData(url)
	{
		let request = require('request');
		return new Promise(function (resolve, reject) 
		{
			request(url, function (error, res, body) 
			{
				if (!error && res.statusCode == 200) 
				{
					console.log('Данные получены')
					resolve(JSON.parse(body))
				} 
				else if (!error && res.statusCode==404)
				{
					//в случае, если город не найден
					console.log('Данные не найдены')
					resolve('not found')
				}
				else if (error)
				{
					console.log('Ошибка')
					console.log(error)
					reject(error);
				}
			});
		});
	}
	//получаем массив текстовых сообщений
	getCurrentInformation(data)
	{
		let someText=[]
		
		for (var id=0;id<data.count;id++)
		{
			someText.push(`Погода в городе ${data.list[id].name}, ${data.list[id].sys.country}:
			- Температура: ${data.list[id].main.temp}°С, ${data.list[id].weather[0].description};
			- Скорость ветра: ${data.list[id].wind.speed} м/с;
			- Влажность: ${data.list[id].main.humidity}%;
			- Давление: ${data.list[id].main.pressure} гПа`)
		}
		return {someText:someText}
	}
	//конвертация времени
	timeConverter(unix)
	{
		var date = new Date(unix * 1000);
		var months = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'];
		var year = date.getFullYear();
		var month = months[date.getMonth()];
		var date = date.getDate();
		var time = date + ' ' + month + ' ' + year;
		return time;
	}
	//получение текста погоды на неделю
	getWeekInformation(data)
	{
		let someText=`Погода в городе ${this.city} на неделю: `
		for (var i=0; i<data.daily.length; i++)
		{
			let correctDate=this.timeConverter(data.daily[i].dt)
			someText+=`
			 
			- Дата: ${correctDate};
			- Температура: ${data.daily[i].temp.min}°C, ${data.daily[i].temp.max}°C, ${data.daily[i].weather[0].description};
			- скорость ветра: ${data.daily[i].wind_speed} м/с
			- влажность: ${data.daily[i].humidity}%;
			- давление: ${data.daily[i].pressure} гПа`
		}
		return {someText:someText}
	}
	getDayInformation(data, i, day)
	{
		let correctDate=this.timeConverter(data.daily[i].dt)
		let someText=`Погода в городе ${this.city} на ${day}: 
			 
			- Дата: ${correctDate};
			- Температура: 
			- Утром ${data.daily[i].temp.morn}°C, ${data.daily[i].weather[0].description};
			- Днем: ${data.daily[i].temp.day}°C, ${data.daily[i].weather[0].description};
			- Вечером: ${data.daily[i].temp.eve}°C, ${data.daily[i].weather[0].description};
			- Ночью: ${data.daily[i].temp.night}°C, ${data.daily[i].weather[0].description};
			- скорость ветра: ${data.daily[i].wind_speed} м/с
			- влажность: ${data.daily[i].humidity}%;
			- давление: ${data.daily[i].pressure} гПа`
		return {someText:someText}
	}
	
	
}
module.exports=Weather