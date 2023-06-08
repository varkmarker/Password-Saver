const express = require("express");
const app = express();
const port = 5000
const fs = require("fs");
const bodyParser = require("body-parser");
require('dotenv').config()
const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DATABASE_URL='mysql://qllzv20g60vxweks3swt:pscale_pw_9j1dsPYwFdpLH34sDhuFrkK4tEiwlJvOl5Vah8VF7Jz@aws.connect.psdb.cloud/password_lists?ssl={"rejectUnauthorized":true}'
)

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    } else {
        console.log('Connected to PlanetScale!')
    }

});
app.post("/", (req, res) => {
    const value = req.body.value;
    const insertQuery = 'INSERT INTO passwords (password) VALUES (?)';


    connection.query(insertQuery, [value], (err, results) => {
        if (err) {
            console.error('Error inserting value into the database:', err);
            return;
        }
        console.log('Value inserted successfully!');
        console.log('Inserted row ID:', results.insertId);

        connection.end(); // Close the database connection
    })

    res.redirect("/")


});
app.listen(process.env.PROT || port, () => console.log(`Password-Saver running on port ${port}!`));
