class Weather
{
	//объект класса погоды, содержит в себе ровно ничего
	constructor()
	{
		console.log("class weather object created")
		this.info={}
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
	getInformation(data)
	{
		let someText=[]
		for (var id=0;id<data.count;id++)
		{
			someText.push(`Погода в городе ${data.list[id].name}, ${data.list[id].sys.country}:
			- Температура: ${data.list[id].main.temp}С, ${data.list[id].weather[0].description};
			- Скорость ветра: ${data.list[id].wind.speed} м/с;
			- Влажность: ${data.list[id].main.humidity}%;
			- Давление: ${data.list[id].main.pressure} гПа`)
		}
		return {someText:someText}
	}
	
}
module.exports=Weather