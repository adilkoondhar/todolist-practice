const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const date = require(__dirname + '/date.js')
const mongoose = require('mongoose')
const _ = require('lodash')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/todolistDB')

const Item = mongoose.model('Item', {name: String})

const item1 = new Item({name: 'Welcome to your todolist!'})
const item2 = new Item({name: 'Hit the + button to add a new item.'})
const item3 = new Item({name: '<~~ Hit this to delete an item.'})

const List = mongoose.model('List', {name: String, items: [{name: String}]})

app.get('/', function(req, res) {

    let today = date.getDate()


    Item.find({})
        .then(items => {
            if (items.length === 0) {
                Item.insertMany([item1, item2, item3])
                res.redirect('/')
            } else {
                res.render('index', {listName: today, newItemList: items})
            }
        })
        .catch(err => {
            console.log(err)
        });

})

app.post('/', function(req, res) {
    let newItemName = req.body.newItem
    let listTitle = req.body.list

    if(listTitle == date.getDate()) {
        const newItem = new Item({name: newItemName})
        newItem.save()
        res.redirect('/')
    } else {
        List.findOne({name: listTitle}).then(foundList => {
            foundList.items.push({name: newItemName})
            foundList.save()
            res.redirect('/' + listTitle)
        })
    }
})

app.post('/delete', (req, res) => {
    const itemID = req.body.checkbox
    const delListName = req.body.list

    if (delListName == date.getDate()) {
        Item.findByIdAndDelete(itemID).catch(err => {console.log(err)})
        res.redirect('/')
    } else {
        List.findOneAndUpdate({name: delListName}, {$pull: {items: {_id: itemID}}})
            .then(() => {
                res.redirect('/' + delListName)
            })
    }
})

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName)

    List.findOne({name: customListName}).then(found => {
        if (!found) {
            const list = new List({name: customListName, items: [item1, item2, item3]})
            list.save()
            res.redirect('/' + customListName)
        } else {
            res.render('index', {listName: found.name, newItemList: found.items})
            console.log(found.items[0])
        }
    })
})

app.get('/about', function(req, res) {
    res.render('about')
})

app.listen(3000)