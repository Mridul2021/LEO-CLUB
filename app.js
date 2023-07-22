var nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the HTML form page
app.use(express.static("./"));

// renders your index.html
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//mount your other paths
// in this case render 404.
app.get("*",function (req, res) {
  res.status(404).send('<h1>File not found</h1>');
});
// Handle form submission and store the comment in a variable
let commentData = ''; // Variable to store the comment

app.post('/save-comment', (req, res) => {
  commentData = req.body.comment;
  res.send('Comment saved successfully');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sender-email-address@example.com',
      pass: 'type-password'
    }
  });
  
  var mailOptions = {
    from: 'youremail@gmail.com',
    to: 'receiver-email-address@example.com',
    subject: 'Sending Email using Node.js',
    text: commentData
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

// Route to retrieve the stored comment
app.get('/get-comment', (req, res) => {
  res.send(commentData);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

