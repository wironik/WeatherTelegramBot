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
		[Markup.button.callback('Бросить кубик', 'cube'),Markup.button.callback('Погода сейчас', 'weathernow')],
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
		let rand = Math.round(Math.random() * urlDudes.length-1)
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
		ctx.reply("Введите Ваш город: ", Markup.keyboard([Markup.button.callback('Москва', 'moscow'),Markup.button.callback('Санкт-Петербург', 'spb')]).resize())
		this.statScene[ctx.message.from.id]={action:'weather'}
		console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
		//перехватываем запрос - мы должны ввести ответ и отправить строку
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
	//отображение сообщения после выбора города
	printCurrentWeather(ctx)
	{
		switch(ctx.message.text)
		{
			case 'Вернуться назад':
				ctx.reply('Вы вернулись в главное меню', this.getMainMenu())
				this.statScene[ctx.message.from.id]={action:'ready'}
				console.log(ctx.message.from.first_name+" вернулся в главное меню")
				console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)	
				break;
			default:
				let id=0
				for (var i=0;i<this.weather.info.count;i++)
				{
					if (ctx.message.text==`${i+1}: ${this.weather.info.list[i].name}, ${this.weather.info.list[i].sys.country}`)
					{
						id=i
						break;
					}
					else
						id=null
				}
				if (id!=null)
				{
					let info=this.weather.getInformation(this.weather.info)
					ctx.reply(info.someText[id])
					ctx.replyWithPhoto(`https://static-maps.yandex.ru/1.x/?ll=${this.weather.info.list[id].coord.lon},${this.weather.info.list[id].coord.lat}&size=600,450&z=11&l=map&amp&name=1.png`)
					console.log(ctx.message.from.first_name+" выбрал город")
					break;
				}
				else
				{
					ctx.reply('Такого города нет в списке. Выберите город из списка ниже:')
					console.log(ctx.message.from.first_name+" ввел неверное название города из списка")
					break;
				}
				break;
		}
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
				this.getCurrentWeatherInfo(ctx)
				break;
			//сцена выбора города из списка
			case ('selectWeather'):
				this.printCurrentWeather(ctx)
				break;
			//любая другая сцена
			default:
				ctx.reply('нет такой команды, напишите /help, там рабочие команды!', this.getMainMenu())
				console.log(ctx.message.from.first_name+" ввел неверную команду")
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
