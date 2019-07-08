require('dotenv').config();
const request = require('request')

module.exports = {
  GetChatId : function(username) { 
    return new Promise(function(resolve, reject) {
        const link = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUpdates`;
        request(link, (error, response, body) =>{
            const data = JSON.parse(body);
            data['result'].forEach(element => {
                if (element['message']['chat']['username'] == username){
                    resolve(element['message']['chat']['id'])
                }
            });
            reject(error)
        });
    });
    },
    SendMessage: function(chatid, message){
        const link = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${chatid}&text=${message}`;
        request(link, (error, response, body) =>{
        });
    }
};
