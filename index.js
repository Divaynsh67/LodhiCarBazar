const express = require('express');
require('dotenv').config()
const app = express()
const port = process.env.PORT||3000
const path = require('path')
const url=require('url')
const host=process.env.APP_BASE_URL
var bodyParser = require('body-parser');
const info = require('./Other/info');
const { urlencoded } = require('body-parser');
//EMAIL 
const nodemailer=require("nodemailer")
const EmailTemplate=require('./Other/emailtemplate')



app.use(express.static('public'));
app.set('view engine', 'hbs')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/cars/bolero', (req, res) => {
 
  res.render('index',info[0])

})
app.get('/cars/alto', (req, res) => {
  res.render('index',info[1])
})
app.get('/cars/omni', (req, res) => {
  res.render('index',info[2])
})


app.post('/submit' ,urlencodedParser,(req,res)=>{
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let Account =process.env.LOGIN;
    let pass=process.env.PASS
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: Account, // generated ethereal user
        pass:pass, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: req.body.email, // sender address
      to: Account, // list of receivers
      subject: `Mr/Mrs ${req.body.name} sended a mail to LodhiCarBazar`, // Subject line
      text: "", // plain text body
      html: EmailTemplate(req.body.name,req.body.phoneNo,req.body.email,req.body.Message)// html body
    });
  

  }
  
  main().catch(console.error);
  res.render('sumbit', req.body)
})





app.listen(port, () => {
  console.log(`Example app listening at ${host}`)
})