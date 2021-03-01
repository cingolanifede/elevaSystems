var request = require('request');

// HsrSystem api key Cloud Messaging

var api_key = 'AAAAzdJXH6U:APA91bH7xxBQqGg1rTcDqPMMA8lOFRczNwArqV1H5o5CPWvcP8WSghriDDFuN7s87f4nLs0iTKHWZshqJV-Q3ZYPfyKIknCWzrxkwD3Kc6UKdDfkgl6xdjY3BvzWKaCMnZL6k4QfokqK';

const sendFCM = (empresaId, title, body, extra) => {
    return new Promise(function (resolve, reject) {
        console.log('Envio PUSH');
        request({
                url: 'https://fcm.googleapis.com/fcm/send',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": ['key', api_key].join('=')
                },
                json: {
                    to: "/topics/" + empresaId,
                    notification: {
                        title: title,
                        body: body
                    },
                    data: extra
                }
            },
            function (error, response, body) {
                if (error) {
                    reject();
                }
                console.log('Request push ok');
                resolve(true);
            });
    });
};

module.exports = {
    sendFCM
};