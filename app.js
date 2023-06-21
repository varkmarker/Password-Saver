const express = require("express");
const app = express();
const port = 5000
const fs = require("fs");
const bodyParser = require("body-parser");
const { Client } = require('pg');


async function fetchPasswords(value) {

  const client = new Client({
    host: 'asia-south1.a1ead230-86f0-451a-bb30-46b3a65b564d.gcp.ybdb.io',
    port: '5433',
    database: 'password_store',
    user: 'admin',
    password: 'mSvEILUwX72QdFysj3djeNyQO-lsOp',
    // Uncomment and initialize the SSL settings for YugabyteDB Managed and other secured types of deployment
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync('public/crt/root.crt').toString()
    },
    connectionTimeoutMillis: 5000
  });
  try {
    console.log("connecting to database")
    await client.connect();
    console.log('Connected to the database.');


    // Insert query with parameterized query
    const insertQuery = 'INSERT INTO password_list (password) VALUES ($1);';
    const insertValues = [value];

    await client.query(insertQuery, insertValues);
    console.log('Inserted a new row.');

    // Select query
    // const selectQuery = 'SELECT * FROM password_list;';
    // const result = await client.query(selectQuery);
    // const passwords = result.rows;

    // console.log('Passwords:');
    // passwords.forEach((password) => {
    //   console.log(password);
    // });
  } catch (error) {
    console.error('Error:', error);

  } finally {
    await client.end();
    console.log('Disconnected from the database.');
  }
}


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const value = req.body.value;
  fetchPasswords(value);
  res.redirect("/")


});
app.listen(process.env.PROT || port, () => console.log(`Password-Saver running on port ${port}!`));
