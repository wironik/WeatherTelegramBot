# WeatherTelegramBot
Бот для телеграм, который отображает погоду

Автор: Суязнова Вероника, группа ИП-18-3

Учебная практика


Бот использует сервис OpenWeatherMap: https://openweathermap.org/

а также библиотеку Telegraf для бота и request для выполнения запросов API

Информация о текущем состоянии работоспособности бота:
1. package.json - файл параметров телеграм бота
2. package-lock.json - подробности о package и модули
3. index.js - основной файл для запуска бота
4. weather.js - класс погоды, который получает информацию о погоде
5. myBot.js - класс бота, в котором создаются команды


Команды:

/start - запуск бота

/ping - проверка связи, отвечает "pong", если связь имеется

/help - отображает список доступных команд

/time - показывает текущее время

/dudes - отправляет рандом картинку с жабой

/weathernow - отображает текущую погоду в указанном городе c возможностью выбрать нужный из списка вместе с картой города.

/сube - игра, где нужно выбрать любое число от 1 до 6, а бот в ответ пришлет куб (анимация)

/botstatus - отображает сообщение от разработчика 

Если ввести любой другой текст - скажет, что такой команды нет

Если прислать любой стикер - бот пришлет "класс"


Дополнительная информация по установке:

Бот написан на языке JavaScript и Node.JS

1. скачиваем файлы из ветки /dev
2. скачиваем Node.js, если отсутствует и вводим команды в консоли: -mpm i telegraf --save и --npm i request --save, для установки библиотек
3. запускаем программу в консоли через команду node index 
4. готово! бот работает
