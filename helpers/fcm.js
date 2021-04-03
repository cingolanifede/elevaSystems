FCM = require('fcm-node');

const api_key = 'AAAAzdJXH6U:APA91bH7xxBQqGg1rTcDqPMMA8lOFRczNwArqV1H5o5CPWvcP8WSghriDDFuN7s87f4nLs0iTKHWZshqJV-Q3ZYPfyKIknCWzrxkwD3Kc6UKdDfkgl6xdjY3BvzWKaCMnZL6k4QfokqK';

const fcmCli = new FCM(api_key);

const sendFCM = (empresaId, title, body, extra) => {
    return new Promise(function (resolve, reject) {
	const to = `/topics/${empresaId}`;
	console.log(to);
        const payload = {
            priority: 'high',
            content_available: true,
            to: to,
            notification: {
                title: title,
                body: body
            },
            data: extra
        };

        fcmCli.send(payload,function(err,res){
            if (err) { console.log(err); reject(); }
            else { console.log(res); resolve(true); }
        });
    });
};



module.exports = {
    sendFCM
};
