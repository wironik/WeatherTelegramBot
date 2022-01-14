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
				console.log(ctx.message.from.first_name+" запросил данные о погоде")
				let query=this.weather.getCurrent(ctx.message.text).then(
				res=>{
				if (res.someText=='not found')
				{
					ctx.reply('Город не найден', this.getMainMenu())
					console.log(ctx.message.from.first_name+" не получил информацию")
				}
				else
				{
					var {keyWeather} = require('./keys.js')
					ctx.reply(res.someText, this.getMainMenu())
					ctx.replyWithPhoto(`https://static-maps.yandex.ru/1.x/?ll=${res.lon},${res.lat}&size=600,450&z=11&l=map&amp&name=1.png`)
					console.log(ctx.message.from.first_name+" узнал погоду")
				}},
				rej=>{
					console.log(rej)
					ctx.reply('Ошибка: не удалось получить данные', this.getMainMenu())
					console.log('Не получилось найти URL')
				})
				this.statScene[ctx.message.from.id]={action:'ready'}
				console.log("bot status "+ctx.message.from.id+": "+this.statScene[ctx.message.from.id].action)
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
		//функции для кнопок главного меню
		//for (var elem in this.hears)
		//{
		//	let tt=elem
		//	this.bot.hears(tt, ctx =>this.hears[tt](ctx))
		//}
		///не сработало, если боту писать /команду, то работает, если текстом отправлять - выдает ошибки 
		///(например, говорит что функция по созданию кнопок не является функцией, не может присвоить action, тк undefined, хотя там все есть
		///!упд: теперь пишет, что setAction, вызываемый внутри функции из перечисления, не является таковой
		
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

		//for (var elem in this.commands)
		//{
		//	let tt=elem
		//	this.bot.command('/'+tt, ctx =>this.commands[tt](ctx))
		//	console.log(tt,this.commands[tt])
		//}
		///тоже не сработало, пишет, что setAction, вызываемый внутри функции из перечисления, не является таковой
		
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
