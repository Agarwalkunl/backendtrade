
let nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail',// E.g., 'Gmail' or use your SMTP server settings
    auth: {
      user: 'aceisop107@gmail.com',
      pass: 'jrssmgnffnyszecj',
    },
  });

  exports.mailsend= async ({To,Subject,Text}) => {
    try{
      
     
      const mailOptions = {
        from: 'aceisop107@gmail.com',
        to: TO,
        subject: Subject,
        text: Text,
      };
      // Send the email
        let data=await transporter.sendMail(mailOptions);
      
          if (data) {
            return {
              message: "invalid credentials",
              sucess: true,
              status: 300,
            };
          } 
          else{
            return {
              message: "sent",
              sucess: false,
              status: 200,
            };
          }
      } 
     catch (error) {
      console.log("error", error);
    }
  };
  