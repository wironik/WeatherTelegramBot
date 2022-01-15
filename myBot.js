class myBot
{
	//конструктор - содержит в себе обьект погоды, сцену, ключ, а также обьект телеграф бота
	constructor(key,stat)
	{
		const {Telegraf} = require('telegraf')
		const Weather = require('./weather.js')
		
		this.bot=new Telegraf(key);
		this.weather=new Weather();
		this.statScene=stat;

		console.log("class bot object created")
	}
	//куча миллион методов для него
	getMainMenu()
	{
		//кнопки главного меню
		const {Markup} = require('telegraf')
		return Markup.keyboard([
		[Markup.button.callback('Обновить данные', 'start'),Markup.button.callback('Проверка связи', 'ping')],
		[Markup.button.callback('Время сейчас', 'time'),Markup.button.callback('Жабки!', 'dudes')],
		[Markup.button.callback('Бросить кубик', 'cube'),Markup.button.callback('Узнать погоду', 'weathernow')],
		[Markup.button.callback('Узнать, как поживает бот', 'statusbot')]
		]).oneTime()
	}
	//кнопки для команды "кубик"
	getCubeMenu()
	{
		const {Markup} = require('telegraf')
		let buttons=[]
		for (var i=1;i<7;i++)
		{
			let ir=i
			buttons.push(Markup.button.callback(ir+'', ir+''))
		}
		return Markup.inlineKeyboard(buttons).resize()
	}
	//метод присваивания состояния бота
	setAction(func, action, ctx, someText)
	{
		this.statScene[ctx.message.from.id]={action:action}
		console.log(`bot status ${ctx.message.from.id}: ${this.statScene[ctx.message.from.id].action}`)
		console.log(ctx.message.from.first_name + someText)
		this.statScene[ctx.message.from.id]={action:'ready'}
		console.log(`bot status ${ctx.message.from.id}: ${this.statScene[ctx.message.from.id].action}`)
	}
	//команда - старт
	startBot(ctx)
	{
		this.setAction(ctx.reply(`Добро пожаловать, ${ctx.message.from.first_name}, напишите /help`, this.getMainMenu()), 'start', ctx, ' запустил бота')
	}
	//команда - помощь
	helpBot(ctx)
	{
		var {helpText} = require('./keys.js');
		this.setAction(ctx.reply(helpText), 'help', ctx, ' получил информацию')
	}
	//команда - пинг
	pingBot(ctx)
	{
		this.setAction(ctx.reply('pong'), 'ping', ctx, ' передал пакет')
	}
	//команда - время
	timeBot(ctx)
	{
		this.setAction(ctx.reply(String(new Date())), 'time', ctx, ' узнал время')
	}
	//получить рандом ссылку на картинку
	getDudesPic()
	{
		let {urlDudes} = require('./keys.js')
		let rand = Math.round(0.5+Math.random() * urlDudes.length-1)
		console.log(rand)
		return urlDudes[rand]
	}
	//команда - жаба
	dudesBot(ctx, url)
	{
		this.setAction(ctx.replyWithPhoto(this.getDudesPic(),
		{
			caption: 'держи'
		}), 'dudes', ctx, ' получил картинку с жабой')
	}
	//игра кубик - после выбора цифры
	cubeGame(ctx, num)
	{
		ctx.deleteMessage()
		ctx.reply(`Вы загадали цифру: ${num}`)
		ctx.replyWithDice()
		console.log(ctx.from.first_name+" бросил кубик")
		this.statScene[ctx.from.id]={action:'ready'}
		console.log("bot status "+ctx.from.id+": "+this.statScene[ctx.from.id].action)
	}
	//команда - кубик
	cubeBot(ctx)
	{
		ctx.reply("Загадайте цифру, чтобы бросить кубик: ",this.getCubeMenu())
		this.statScene[ctx.message.from.id]={action:'cube'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
	}
	//команда - состояние бота
	statusBot(ctx)
	{
		var {statusText} = require('./keys.js')
		this.setAction(ctx.reply(statusText), 'state', ctx, ' получил сообщение от разработчика')
	}
	//команда - погода сейчас
	weatherNowBot(ctx)
	{
		const {Markup} = require('telegraf')
		ctx.reply("Введите Ваш город: ", Markup.keyboard([Markup.button.callback('Москва', 'moscow'),Markup.button.callback('Санкт-Петербург', 'spb'),Markup.button.callback('Вернуться в главное меню', 'cancelMenu')]).resize())
		this.statScene[ctx.message.from.id]={action:'weather'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		//перехватываем запрос - мы должны ввести ответ и отправить строку
	}
	//вернуться в главное меню
	cancelWeather(ctx)
	{
		ctx.reply('Вы вернулись в главное меню', this.getMainMenu())
		this.statScene[ctx.message.from.id]={action:'ready'}
		console.log(ctx.message.from.first_name+" вернулся в главное меню")
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)	
	}
	//получение списка найденных городов
	getCurrentWeatherInfo(ctx)
	{
		var {keyWeather} = require('./keys.js')
		let url=encodeURI(`http://api.openweathermap.org/data/2.5/find?q=${ctx.message.text}&lang=ru&units=metric&appid=${keyWeather}`)
		
		console.log(ctx.message.from.first_name+" запросил данные о погоде")
		this.weather.requestData(url).then(
		res=>{
		if (res=='not found')
		{
			ctx.reply('Город не найден', this.getMainMenu())
			console.log(ctx.message.from.first_name+" не получил информацию")
			this.statScene[ctx.message.from.id]={action:'ready'}
			console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		}
		else
		{
			//получаем погоду
			const {Markup} = require('telegraf')
			
			let buttons=[]
			for (var id=0; id<res.count;id++)
			{
				buttons.push(Markup.button.callback(`${id+1}: ${res.list[id].name}, ${res.list[id].sys.country}`, 'weather '+id))
			}
			buttons.push(Markup.button.callback('Вернуться назад', 'cancel'))
			ctx.reply('Выберите город из списка ниже: ', Markup.keyboard(buttons).resize())
			
			this.weather.info=res
			this.weather.week=''
			console.log(ctx.message.from.first_name+" получил список городов")
			
			this.statScene[ctx.message.from.id]={action:'selectWeather'}
			console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		}},
		rej=>{
			console.log(rej)
			ctx.reply('Ошибка: не удалось получить данные', this.getMainMenu())
			console.log('Не получилось найти URL')
			this.statScene[ctx.message.from.id]={action:'ready'}
			console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		})
	}
	//получение информации погоды на неделю
	getWeekWeatherInfo(ctx)
	{
		var {keyWeather2} = require('./keys.js')
		let url=encodeURI(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.weather.info.list[this.weather.id].coord.lat}&lon=${this.weather.info.list[this.weather.id].coord.lon}&exclude=current,minutely,hourly,alerts&units=metric&lang=ru&appid=${keyWeather2}`)
		
		console.log(ctx.message.from.first_name+" запросил данные о погоде")
		this.weather.requestData(url).then(
		res=>{
		if (res=='not found')
		{
			ctx.reply('Город не найден', this.getMainMenu())
			console.log(ctx.message.from.first_name+" не получил информацию")
			this.statScene[ctx.message.from.id]={action:'ready'}
			console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		}
		else
		{
			console.log(ctx.message.from.first_name+" получил данные")
			this.weather.week=res
		}},
		rej=>{
			console.log(rej)
			ctx.reply('Ошибка: не удалось получить данные', this.getMainMenu())
			console.log('Не получилось найти URL')
			this.statScene[ctx.message.from.id]={action:'ready'}
			console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		})
	}
	//метод вызова выбора типа погоды
	chooseWeather(ctx)
	{
		if (this.weather.week=='')
		{
			this.getWeekWeatherInfo(ctx)
		}
		this.weather.city=`${this.weather.info.list[this.weather.id].name}, ${this.weather.info.list[this.weather.id].sys.country}`
		const {Markup} = require('telegraf')
		ctx.reply('Выберите погоду, которую хотите узнать: ', Markup.keyboard([
			Markup.button.callback('Погода сейчас', 'currentWeather'),
			Markup.button.callback('Погода на сегодня', 'dayWeather'),
			Markup.button.callback('Погода на завтра', 'tomorrowWeather'),
			Markup.button.callback('Погода на неделю', 'weekWeather'),
			Markup.button.callback('Вернуться назад', 'cancelWeather')]
		).resize())
		this.statScene[ctx.message.from.id]={action:'chooseWeather'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
	}
	//проверка корректности выбора города из списка
	ifCorrectCity(ctx)
	{
		let result=false
		for (var i=0;i<this.weather.info.count;i++)
		{
			if (ctx.message.text==`${i+1}: ${this.weather.info.list[i].name}, ${this.weather.info.list[i].sys.country}`)
			{
				this.weather.id=i
				break;
			}
			else
				this.weather.id=null
		}
		if (this.weather.id!=null)
		{
			result=true
		}
		return result
	}
	//отображение сообщения после выбора города
	printCurrentWeather(ctx)
	{
		let info=this.weather.getCurrentInformation(this.weather.info)
		console.log(ctx.message.from.first_name+" узнал погоду сейчас")
		ctx.replyWithPhoto(`https://static-maps.yandex.ru/1.x/?ll=${this.weather.info.list[this.weather.id].coord.lon},${this.weather.info.list[this.weather.id].coord.lat}&size=600,450&z=11&l=map&amp&name=1.png`,
		{
			caption: info.someText[this.weather.id]
		})
	}
	printWeekWeather(ctx)
	{
		let info=this.weather.getWeekInformation(this.weather.week)
		ctx.reply(info.someText)
		ctx.replyWithPhoto(`https://static-maps.yandex.ru/1.x/?ll=${this.weather.info.list[this.weather.id].coord.lon},${this.weather.info.list[this.weather.id].coord.lat}&size=600,450&z=11&l=map&amp&name=1.png`)
		console.log(ctx.message.from.first_name+" узнал погоду на неделю")
	}
	printDayWeather(ctx, id, day)
	{
		let info=this.weather.getDayInformation(this.weather.week, id, day)
		ctx.replyWithPhoto(`https://static-maps.yandex.ru/1.x/?ll=${this.weather.info.list[this.weather.id].coord.lon},${this.weather.info.list[this.weather.id].coord.lat}&size=600,450&z=11&l=map&amp&name=1.png`,
		{
			caption: info.someText
		})
		console.log(ctx.message.from.first_name+" узнал погоду на "+day)
	}
	
	//команда - ответ на любой иной текст, а также обработка события выбора города погоды
	someTextBot(ctx)
	{
		//если состояния никакого нет в целом
		if (!this.statScene[ctx.message.from.id])
		{
			this.statScene[ctx.message.from.id]={action:'ready'}
			console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		}
		//проверка сцен
		switch (this.statScene[ctx.message.from.id].action)
		{
			//сцена погоды
			case ('weather'):
				switch (ctx.message.text)
				{
					case ('Вернуться в главное меню'):
						this.cancelWeather(ctx)
						break;
					default:
						this.getCurrentWeatherInfo(ctx)
						break;
				}
				break;
			//сцена выбора города из списка
			case ('selectWeather'):
				switch (ctx.message.text)
				{
					case ('Вернуться назад'):
						this.weatherNowBot(ctx)
						break;
					default:
						let search=this.ifCorrectCity(ctx)
						if (search==true)
						{
							console.log(ctx.message.from.first_name+" выбрал город")
							this.chooseWeather(ctx)
						}
						else
						{
							ctx.reply('Такого города нет в списке. Выберите город из списка ниже:')
							console.log(ctx.message.from.first_name+" ввел неверное название города из списка")
						}
						break;
				}
				break;
			//сцена выбора типа прогноза 
			case ('chooseWeather'):
				switch(ctx.message.text)
				{
					case ('Погода сейчас'):
						this.printCurrentWeather(ctx)
						break;
					case ('Погода на сегодня'):
						this.printDayWeather(ctx, 0, 'сегодня')
						break;
					case ('Погода на завтра'):
						this.printDayWeather(ctx, 1, 'завтра')
						break;
					case('Погода на неделю'):
						this.printWeekWeather(ctx)
						break;
					case('Вернуться назад'):
						this.weatherNowBot(ctx)
						break;
					default:
						ctx.reply('Нет такой команды. Выберите погоду, которую хотите узнать:')
						break;
				}
				break;
			//любая другая сцена
			default:
				ctx.reply('нет такой команды, напишите /help, там рабочие команды!', this.getMainMenu())
				console.log(ctx.message.from.first_name+" ввел неверную команду")
				break;
				//на остальное говорит, что команды не существует
		}
	}
	//команда - ответ на любой стикер
	someStickerBot(ctx)
	{
		this.setAction(ctx.replyWithPhoto('https://wdesk.ru/_ph/226/2/201922412.png'), 'sticker', ctx, ' отправил стикер')
	}
	//привязка кнопок к методам
	addActionsBot()
	{
		//функции для кнопок игры в куб
		for (var i=1;i<7;i++)
		{
			let ir=i
			this.bot.action(ir+'', ctx => 
			{
				this.cubeGame(ctx, ir)
			})
		}
		
		//для кнопок главного меню
		this.bot.hears('Обновить данные', ctx => 
		{
			this.startBot(ctx)
		})
		this.bot.hears('Проверка связи', ctx => 
		{
			this.pingBot(ctx)
		})
		this.bot.hears('Жабки!', ctx => 
		{
			this.dudesBot(ctx)
		})
		this.bot.hears('Узнать погоду', ctx => 
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
		this.bot.command('weathernow', ctx=> 
		{
			this.weatherNowBot(ctx)
		})//ответ бота на команду /weathernow
		
		///должно быть в конце, иначе бот команды не увидит и будет на них реагировать как на простой текст
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
module.exports = myBot
