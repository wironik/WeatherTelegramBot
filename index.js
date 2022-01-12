//библиотеки!
//import express from 'express'
//import Telegraf from 'telegraf'
//import session from 'telegraf/lib/session.js'
//import Markup from 'telegraf/lib/markup.js'

//ключи, апи и прочее
//import  './keys.js'

//создание обьекта - бота и кнопки
const {Telegraf} = require('telegraf')
const {Markup} = require('telegraf')
var {keyBot} = require('./keys.js')


//создание кнопок
function getMainMenu()
{
	return Markup.keyboard([
		['/ping'],
		['/time'],
        ['Жаба']
    ])
}
//создание бота
const bot = new Telegraf(keyBot)
console.log('bot created')

//задаем команды боту
bot.start((ctx) => ctx.reply('Добро пожаловать, это тестовая разработка',getMainMenu())) //ответ бота на команду /start
bot.help((ctx) => ctx.reply('1. /ping - проверка связи\n2. /start - запуск бота\n3. /time - показывает текущее время\n4. Жаба - прикол')) //ответ бота на команду /help
bot.command('ping', (ctx) => ctx.reply('pong')) //проверка связи
bot.command('time', ctx => {ctx.reply(String(new Date()))}) //отображение текущего времени
bot.hears('Жаба', ctx => {ctx.replyWithPhoto('https://memepedia.ru/wp-content/uploads/2018/07/cover1.jpg',{caption: 'It is wednesday, my dudes'})}) //присылает картинку 
bot.on('text', ctx => {ctx.replyWithHTML('нет такой команды')}) //реакция на все остальные введеные сообщения

//СПИСОК ФУНКЦИЙ С АПИШКОЙ
function getTodayWeather(city)
{
	var fetch = require('node-fetch');
	
}


//запуск бота
bot.launch()
console.log("succsess")