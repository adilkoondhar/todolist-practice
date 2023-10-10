const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const date = require(__dirname + '/date.js')
const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

var newItemList = []
var workItemList = []
app.get('/', function(req, res) {

    let today = date.getDate()

    res.render('index', {listName: today, newItemList: newItemList})

})

app.post('/', function(req, res) {
    let newItem = req.body.newItem

    if(req.body.list === 'Work List') {
        workItemList.push(newItem)
        res.redirect('/work')
    } else {
        newItemList.push(newItem)
        res.redirect('/')
    }
})

app.get('/work', function(req, res) {
    res.render('index', {listName: 'Work List', newItemList: workItemList})
})

app.get('/about', function(req, res) {
    res.render('about')
})

app.listen(3000)