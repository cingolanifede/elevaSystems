const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(obj) {
console.log(obj);    
var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'elevasystems@gmail.com', // generated ethereal user
          pass: 'hidrolift', // generated ethereal password
        }
      });
      
      var mailOptions = {
        from: 'elevasystems@gmail.com',
        to: obj.to,
        subject: obj.subject,
        text: 'New user'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = { sendMail };
