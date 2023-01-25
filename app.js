/* eslint-disable no-var */
/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
// import date from './date.js';
import mongoose from 'mongoose';
import _ from "lodash";
const port = process.env.PORT || 3000;
const schema = mongoose.Schema;
mongoose.set('strictQuery', false);


// const day = date.getDay();
var app = express();
var items = [];
var work = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://admin-jashan:test123@cluster0.utn1pdn.mongodb.net/todolist";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function main() {
  await mongoose.connect(uri);
}
main().catch(err => console.error(err));


const listSchema = new schema ({
  name: String,
})



const Item = mongoose.model("Item", listSchema); 

const item1 = new Item({
  name : "do it know"
})
const item2 = new Item({
  name : "hit the + button to add a new item."
})
const item3 = new Item({
  name : "<-- Hit this to delete an item."
})

const defaultItems = [item1, item2, item3];

const newListSchema = new schema({
  name: String,
  items: [listSchema],
});

const List = mongoose.model('list', newListSchema);


app.get('/', (req, res) => {
  Item.find({}, function (err, results) {
    if (err) {
      console.error(err);
    } else {
      // console.log(results);
      if (results.length === 0) {
        Item.insertMany(defaultItems, function (err) {
          if (err) {
              console.error(err);
          } else {
              console.log("Succesfuly sved all items in Items");
          }
        });
        res.redirect("/");
      } else {
        res.render('list', { listTitle: "Today", newItem: results })
      }
    }
  });
});

app.get('/:newList', function (req, res) {
  const listName = _.capitalize(req.params.newList);
  List.find({ name: listName }, function (err, results) {
    if (results.length === 0) {
      const list = new List({
        name: listName,
        items: defaultItems
      });
      list.save();
      res.redirect(`/${listName}`);
    } else {
      // console.log(results[0].items);
      res.render('list', { listTitle: listName, newItem: results[0].items });
    }
  });
  // console.log(listName);
  // console.log(defaultItems);
})

app.post('/', (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.button;
  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect('/');
  } else {
      List.findOne({ name: listName }, function(err, foundList){
      console.log(foundList.items);
      foundList.items.push(item);
      foundList.save();
    });
    // console.log(`#${listName}#`);
    res.redirect(`/${listName}`);
  }
});
app.post('/delete', (req, res) => {
  const checkedBoxId = req.body.checkBox;
  const listName = req.body.listName;

  if (listName === "Today")
  {
  Item.findByIdAndRemove(checkedBoxId, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("Succesfuly deleted the item");
    }
  })
  res.redirect('/');
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedBoxId } } }, function (err, foundList) {
      if (!err) {
        res.redirect(`/${listName}`);
      } else {
        console.log("Succesfuly deleted the item");
      }
    })
  }




})

app.get('/about', (req, res) => {
  res.render('about');
})

app.get("/", (req, res) => res.type('html').send(html));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
