//создание обьекта - бота
var {keyBot} = require('./keys.js')
const myBot = require('./myBot.js')

//создание бота
let stateScene = {}
let bot = new myBot(keyBot,stateScene)


//запуск бота
bot.initialize()
console.log("succsess")
