//создание обьекта - бота и кнопки

var {keyBot, statusText, helpText} = require('./keys.js')

//наш ботик с методами
class myBot
{
	constructor(key,stat)
	{
		const {Telegraf} = require('telegraf')
		
		this.bot=new Telegraf(key);
		this.statScene=stat;
		console.log("class bot object created")
	}
	//обьект бота
	
	//куча миллион методов для него
	getMainMenu()
	{
		//,Markup.button.callback('Погода сейчас', 'weathernow')
		const {Markup} = require('telegraf')
		return Markup.keyboard([
		[Markup.button.callback('Обновить данные', 'start'),Markup.button.callback('Проверка связи', 'ping')],
		[Markup.button.callback('Время сейчас', 'time'),Markup.button.callback('Жабки!', 'dudes')],
		[Markup.button.callback('Бросить кубик', 'cube')],
		[Markup.button.callback('Узнать, как поживает бот', 'statusbot')]
		])
		
	}
	getCubeMenu()
	{
		const {Markup} = require('telegraf')
		return Markup.inlineKeyboard([
			Markup.button.callback('1', '1'),
			Markup.button.callback('2', '2'),
			Markup.button.callback('3', '3'),
			Markup.button.callback('4', '4'),
			Markup.button.callback('5', '5'),
			Markup.button.callback('6', '6')])
		.resize()
	}
	//игра - кубик
	cubeGame(ctx, num)
	{
		ctx.deleteMessage()
		ctx.reply(`Вы выбрали цифру: ${num}`)
		ctx.replyWithDice()
		console.log(ctx.from.first_name+" бросил кубик")
		this.statScene[ctx.from.id]={action:'ready'}
		console.log("bot status "+ctx.from.id+": "+this.statScene[ctx.from.id].action)
	}
	//команда - старт
	startBot(ctx)
	{
		this.statScene[ctx.message.from.id]={action:'start'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		ctx.reply(`Добро пожаловать, ${ctx.message.from.first_name}, напишите /help`, this.getMainMenu())
		console.log(ctx.message.from.first_name+" запустил бота")
		this.statScene[ctx.message.from.id]={action:'ready'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
	}
	//команда - погода сейчас
	
	weatherNowBot(ctx)
	{
		ctx.reply("Введите Ваш город: ")
		//status:weather
		this.statScene[ctx.message.from.id]={action:'weather'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		//перехватываем запрос - мы должны ввести ответ и отправить строку
	}
	//команда - помощь
	helpBot(ctx)
	{
		this.statScene[ctx.message.from.id]={action:'help'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		ctx.reply(helpText)
		console.log(ctx.message.from.first_name+" получил информацию")
		this.statScene[ctx.message.from.id]={action:'ready'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
	}
	//команда - пинг
	pingBot(ctx)
	{
		this.statScene[ctx.message.from.id]={action:'ping'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		ctx.reply('pong')
		console.log(ctx.message.from.first_name+" передал пакет")
		this.statScene[ctx.message.from.id]={action:'ready'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
	}
	//команда - время
	timeBot(ctx)
	{
		this.statScene[ctx.message.from.id]={action:'time'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		ctx.reply(String(new Date()))
		console.log(ctx.message.from.first_name+" узнал время")
		this.statScene[ctx.message.from.id]={action:'ready'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
	}
	//команда - жаба
	dudesBot(ctx)
	{
		this.statScene[ctx.message.from.id]={action:'dudes'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		ctx.replyWithPhoto('https://memepedia.ru/wp-content/uploads/2018/07/cover1.jpg',
		{
			caption: 'It is wednesday, my dudes'
		})
		console.log(ctx.message.from.first_name+" получил картинку с жабой")
		this.statScene[ctx.message.from.id]={action:'ready'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
	}
	//команда - кубик
	cubeBot(ctx)
	{
		ctx.reply("Выберите цифру, чтобы бросить кубик: ",this.getCubeMenu())
		this.statScene[ctx.message.from.id]={action:'cube'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
	}
	//команда - состояние бота
	statusBot(ctx)
	{
		this.statScene[ctx.message.from.id]={action:'state'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		ctx.reply(statusText)
		console.log(ctx.message.from.first_name+" получил сообщение от разработчика")
		this.statScene[ctx.message.from.id]={action:'ready'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
	}
	//команда - ответ на любой иной текст
	someTextBot(ctx)
	{
		if (!this.statScene[ctx.message.from.id])
		{
			this.statScene[ctx.message.from.id]={action:'ready'}
			console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		}
		
		//проблема: данные возвращаются позже, чем это все (использовать асинк и эвейт, хз где и как)
		switch (this.statScene[ctx.message.from.id].action)
		{
			case ('weather'):
				console.log(ctx.message.from.first_name+" запросил данные о погоде")
				var someText=weather.getCurrent(ctx.message.text)
				console.log(someText)
				if (someText==undefined)
				{
					ctx.reply('Город не найден')
					console.log(ctx.message.from.first_name+" не получил информацию")
				}
				else
				{
					ctx.reply(`${someText}`)
					console.log(ctx.message.from.first_name+" узнал погоду")
				}
					
				//вызываем метод//
				this.statScene[ctx.message.from.id]={action:'ready'}
				console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
				break;
			default:
				ctx.reply('нет такой команды, напишите /help, там рабочие команды!')
				console.log(ctx.message.from.first_name+" ввел неверную команду")
				//на остальное говорит, что команды не существует
		}
	}
	//команда - ответ на любой стикер
	someStickerBot(ctx)
	{
		this.statScene[ctx.message.from.id]={action:'sticker'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		ctx.replyWithPhoto('https://wdesk.ru/_ph/226/2/201922412.png')
		console.log(ctx.message.from.first_name+" отправил стикер")
		this.statScene[ctx.message.from.id]={action:'ready'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
	}
	
	//привязка кнопок к методам
	addActionsBot()
	{
		this.bot.action('1', ctx => 
		{
			this.cubeGame(ctx, 1)
		})
		this.bot.action('2', ctx => 
		{
			this.cubeGame(ctx, 2)
		})
		this.bot.action('3', ctx => 
		{
			this.cubeGame(ctx, 3)
		})
		this.bot.action('4', ctx => 
		{
			this.cubeGame(ctx, 4)
		})
		this.bot.action('5', ctx => 
		{
			this.cubeGame(ctx, 5)
		})
		this.bot.action('6', ctx => 
		{
			this.cubeGame(ctx, 6)
		})
		
		this.bot.hears('Обновить данные', ctx => 
		{
			this.startBot(ctx)
			console.log('restart')
		})
		this.bot.hears('Проверка связи', ctx => 
		{
			this.pingBot(ctx)
		})
		this.bot.hears('Жабки!', ctx => 
		{
			this.dudesBot(ctx)
		})
		this.bot.hears('Погода сейчас', ctx => 
		{
			this.weatherNowBot(ctx)
		})
		this.bot.hears('Бросить кубик', ctx => 
		{
			this.cubeBot(ctx)
		})
		this.bot.hears('Время сейчас', ctx => 
		{
			this.timeBot(ctx)
		})
		this.bot.hears('Узнать, как поживает бот', ctx => 
		{
			this.statusBot(ctx)
		})
		console.log("actions added")
	}
	addCommandBot()
	{
		this.bot.start((ctx) => 
		{
			this.startBot(ctx)
		}) //ответ бота на команду /start
		
		this.bot.command('weathernow', ctx=> 
		{
			this.weatherNowBot(ctx)
		})//ответ бота на команду /weathernow
		this.bot.help((ctx) => 
		{
			this.helpBot(ctx)
		}) //ответ бота на команду /help
		this.bot.command('ping', (ctx) => 
		{
			this.pingBot(ctx)
		}) //проверка связи
		this.bot.command('time', ctx => 
		{
			this.timeBot(ctx)
		}) //отображение текущего времени
		this.bot.command('dudes', ctx => 
		{
			this.dudesBot(ctx)
		}) //присылает картинку 
		this.bot.command('botstatus', ctx=>
		{
			this.statusBot(ctx)
		}) //отображает сообщение разработчика
		this.bot.command('cube', ctx=>
		{
			this.cubeBot(ctx)
		})
		this.bot.on('text', ctx => 
		{
			this.someTextBot(ctx)
			
			
			
		}) //реакция на все остальные введеные сообщения
		this.bot.on('sticker', (ctx) => 
		{
			this.someStickerBot(ctx)
		})
		console.log("commands added")
	}
	
	//запуск бота
	initialize()
	{
		//this.getMainMenu()
		this.addActionsBot()
		this.addCommandBot()
		
		this.bot.launch()
		console.log("bot is running")
	}
};

class Weather
{
	constructor(url)
	{
		this.url=url
		console.log("class weather object created")
	}
	getCurrent(city)
	{
		var {keyWeather, lang, units} = require('./testee.js')
		this.url=encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&units=metric&appid=${keyWeather}`)

		//let res = this.requestData(this.url);
		//console.log(res);
		
		let someText=undefined
		
		let request = require('request');
		request(this.url, function (err, res, body) 
		{
			if(err)
			{
				console.log('error:', err);
				return someText
			} 
			if (res.cod!="404")
			{
				let data = JSON.parse(body);
				//console.log(data)
				someText = `Погода в городе - ${data.name}:
				-Температура: ${data.main.temp}C, ${data.weather[0].description};
				-Скорость ветра: ${data.wind.speed} м/с;
				-Влажность: ${data.main.humidity}%;
				-Давление: ${data.main.pressure} мм`
				console.log("Данные: ",someText)
				return someText
			}
			else
			{
				console.log('Данные не найдены: ', res)
				return someText
			}
		});
		
		//return someText
		//var someText=city+"\nПогода: хорошая)))"
		
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
	getAnotherDay()
	{
		//this.url='';
	}
	getPicture()
	{
		//this.url=''
	}
	//что в планах: 
	//команда - погода сейчас (обращаемся к боту, запрашиваем у него город, по желанию еще параметры через запятую, 
	//бот вернет массив, а также добавит в лист кнопочки к этому запросу, затем обращаемся к погоде, формируем ссылку, возвращаем данные)
	//погода вернула данные, другая функция погоды обрабатывает результат, возвращает строку, отдает ее боту. 
	//бот ее принимает и отображает в чатике
	
	//по такому же принципе будут выполняться остальные запросы (на завтра, на дату определенную)
	
	//в идеале - чтобы либо жсон файл сохранялся на комп в виде файла, если не выйдет - будет хранить строку, а дальше по поиску будет идти обработка
	
	
	
	//опции
	//обьект погоды 
	//ссылька
	//ключик
	
	//пару методов, тупо возвращающие данные
}

//class app()
//{
//	constructor()
//	{
		
//	}
//}

//создание бота
let stateScene = {}
const bot = new myBot(keyBot,stateScene)
const weather = new Weather('yourUrl')

console.log('bot created')


//обработка остального
//запуск бота
bot.initialize()
console.log("succsess")