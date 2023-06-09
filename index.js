const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'book_manager',
    charset: 'utf8_general_ci'
});

connection.connect(err => {
    if (err) {
        throw err.stack;
    } else {
        console.log('connect database successfully');
    }
});

app.get('/books/create', (req, res) => {
    res.render('create');
});

app.post('/books/create', (req, res) => {
    const {name, price, status, author} = req.body;
    console.log(req.body);
    const sqlInsert = "INSERT INTO books (name, price, status, author) VALUES ?";
    const value = [
        [name, price, status, author]
    ];
    connection.query(sqlInsert, [value], (err, result) => {
        if (err) throw err;
        res.end('success');
    });
});

app.get('/index', (req, res) => {
    const sql = 'SELECT * FROM books';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.render('index', {data: result});
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});