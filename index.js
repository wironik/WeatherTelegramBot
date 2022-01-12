//создание обьекта - бота и кнопки
const {Telegraf} = require('telegraf')
const {Markup} = require('telegraf')
var {keyBot} = require('./keys.js')


//создание кнопок
function getMainMenu()
{
	return Markup.keyboard([
		['/help'],
		['/ping'],
		['/time'],
		['/WeatherNow'],
        ['Жаба']
    ])
}
//создание бота
const bot = new Telegraf(keyBot)
console.log('bot created')


//СПИСОК ФУНКЦИЙ С АПИШКОЙ
function getWeatherNow()
{
	var someText="Здесь будет отображена погода сейчас"
	//var fetch = require('node-fetch');
	return someText
}



//задаем команды боту
bot.start((ctx) => ctx.reply(`Добро пожаловать, ${ctx.message.from.first_name}`,getMainMenu())) //ответ бота на команду /start
bot.help((ctx) => ctx.reply('1. /ping - проверка связи\n2. /start - запуск бота\n3. /time - показывает текущее время\n4. Жаба - прикол\n5. /WeatherNow - показать погоду сейчас')) //ответ бота на команду /help
bot.command('ping', (ctx) => ctx.reply('pong')) //проверка связи
bot.command('time', ctx => {ctx.reply(String(new Date()))}) //отображение текущего времени
bot.hears('Жаба', ctx => {ctx.replyWithPhoto('https://memepedia.ru/wp-content/uploads/2018/07/cover1.jpg',{caption: 'It is wednesday, my dudes'})}) //присылает картинку 
bot.command('WeatherNow', async ctx=> {
	var someText=await getWeatherNow()
	ctx.reply(`Текущая погода: ${someText}`)
	
	})


//обработка остального
bot.on('text', ctx => {ctx.replyWithHTML('нет такой команды')}) //реакция на все остальные введеные сообщения





//запуск бота
bot.launch()
console.log("succsess")