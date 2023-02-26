const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');

const app = express();

const key = "f5cea9b3964d50a0ff40d5d321018a49-us18"
const audienceId = "23d5a29e4f"

app.use(bodyParser.urlencoded({extended : true}));
const mailchimp = require("@mailchimp/mailchimp_marketing");
const {response} = require("express");

app.use(express.static(path.join(__dirname, 'public')));

mailchimp.setConfig({
    apiKey: key,
    server: "us18"
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    async function run(){
        const response = await mailchimp.lists.addListMember(audienceId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            },
        });
    }
    run();

    if (response.statusCode === 200){
        res.sendFile(__dirname + "/public/success.html")
    }else{
        res.sendFile(__dirname + "/public/failure.html")
    }
});

app.post("/failure", function (req, res){
    res.redirect("/")
});

app.listen(3000, function () {
    console.log("Server running on port 3000");
});

