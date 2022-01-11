//библиотеки!
import Markup from 'telegraf/markup.js'
import { getMainMenu } from './keyboards.js'

//создание обьекта - бота 
const { Telegraf } = require('telegraf')
const bot = new Telegraf(keys.keyBot)

//задаем команды боту
bot.start((ctx) => ctx.reply('Добро пожаловать, это тестовая разработка',getMainMenu())) //ответ бота на команду /start
bot.help((ctx) => ctx.reply('1. /ping - проверка связи\n2. /start - запуск бота\n3. /time - показывает текущее время\n4. Жаба - прикол')) //ответ бота на команду /help
bot.command('ping', (ctx) => ctx.reply('pong')) //проверка связи
bot.command('time', ctx => {ctx.reply(String(new Date()))}) //отображение текущего времени
bot.hears('Жаба', ctx => {ctx.replyWithPhoto('https://memepedia.ru/wp-content/uploads/2018/07/cover1.jpg',{caption: 'It is wednesday, my dudes'})}) //присылает картинку 
bot.on('text', ctx => {ctx.replyWithHTML('нет такой команды')}) //реакция на все остальные введеные сообщения

//создание кнопок
export function getMainMenu() 
{
    return Markup.keyboard([
		['/ping'],
		['/time'],
        ['Жаба']
    ]).resize().extra()
}

//запуск бота
bot.launch()