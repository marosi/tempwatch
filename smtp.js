var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Mandrill",
    auth: {
        user: "kasinec.maros@gmail.com",
        pass: "MiMTqTkIxNWpAnLBzEcoSQ"
    }
});

module.exports.sendEmail = function(to, subject, body, callback){
    smtpTransport.sendMail({
        from: "tempwatcher@exapro.sk",
        to: to,
        subject: subject,
        html: body
    }, function(error, response){
        if(error){
            console.log(error); callback(error, response);
        }else{
            callback(null, response);
        }
    });
};