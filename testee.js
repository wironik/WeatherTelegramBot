'use strict';
var keys =
{
	keyWeather2:"bb8168d3a4b4fde874d2805aaa94b144"
}

var options =
{
	city: "санкт-петербург",
	lang: "ru",
	units: "metric",
	lat: 59.8944,
	lon: 30.2642,
	layerImg: "temp_new",
	zoom:1,
	x:1,
	y:1
}

function test()
{
	var url = `http://api.openweathermap.org/data/2.5/weather?q=${options.city}&lang=${options.lang}&units={options.units}&appid=${keys.keyWeather2}`;
	fetch(url)
	//.then(response=>
	//{
		//console.log(response.json());
	//	console.log('ok');
		//return response;
	//	console.log(response.cod);
	//});
	.then((response) => {
	response.text()
	return response.json(); // Error!
	})
	.then((data) => {
	console.log(data);
	});
	
}

function today()
{
	
}

function searchDay()
{
	
}

function mounth()
{
	
}

//функция по замене русских букв в ссылке для выполнения поискового запроса
function translateUrl(uri)
{
	var encoded = encodeURI(uri);
	console.log(encoded);
	return encoded;
}

function ss()
{
}


