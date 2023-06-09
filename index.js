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

app.get('/books/:id/delete', (req, res) => {
    const idBook = req.params.id;
    const sql = `DELETE FROM books WHERE id = ${idBook}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/index');
    });
});

app.get('/books/:id/update', (req, res) => {
    const idBook = req.params.id;
    const sql = `SELECT * FROM books WHERE id = ${idBook}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.render('update', {book: result[0]});
    });
});

app.post('/books/:id/update', (req, res) => {
    const idBook = req.params.id;
    const sql = `UPDATE books SET name = ?, price = ?, author = ?, status = ? WHERE id = ?`;
    const {name, price, author, status} = req.body;
    const value = [name, price, author, status, idBook];
    connection.query(sql, value, (err, result) => {
        if (err) throw err;
        res.redirect('/index');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});