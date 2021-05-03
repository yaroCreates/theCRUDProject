const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const app = express()

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'james'
})

connection.connect((err) => {
    if (err) console.log(err)
    else console.log('Database Connected!')
})



//Setting static files

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))


app.set('views', __dirname + '/views')

app.set('view-engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))






app.get('/', (req, res) => {
    let sql = 'SELECT * FROM users'
    query = connection.query(sql, (err, rows) => {
        if (err) throw err
        res.render('index.ejs', {
            title: 'The dashboard',
            users: rows
        })

    })
})


app.get('/login', (req, res) => {
    res.render('login.ejs')
})


app.get('/signup', (req, res) => {
    res.render('signup.ejs')
})

app.post("/save", (req, res) => {
    let data = {username: req.body.username, email: req.body.email, password: req.body.password}
    let sql = "INSERT INTO users SET ?"
    let query = connection.query(sql, data, (err, results) => {
        if (err) throw err
        res.redirect('/')
    })
})

app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId
    let sql = `SELECT * from users where id = ${userId}`
    let query = connection.query(sql, (err,result) => {
        if (err) throw err
        res.render('edit.ejs', {
            user: result[0]
        })
    })
})

app.post("/update", (req, res) => {
    const userId = req.body.id
    let sql = "UPDATE users SET username ='"+req.body.username+"', email ='"+req.body.email+"', phone_number ='"+req.body.phone_number+"', password ='"+req.body.password+"' where id="+userId
    let query = connection.query(sql,(err, result) => {
        if (err) throw err
        res.redirect('/')
    })
})

app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId
    let sql = `DELETE from users where id = ${userId}`
    let query = connection.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/')
        })
    })

app.listen('3000', ()=> console.log('Server running on port 3000'))
