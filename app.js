//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://mk:mk98@cluster0.gldzot4.mongodb.net/diaryDB");

// mongoose.connect("mongodb://localhost:27017/diaryDB");

const itemSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Item = mongoose.model("Item", itemSchema);

const homeStartingContent =
  " this is an example texts fg!! vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const homeaboutContent =
  "It was created in a very simple format so you could easily use it in your daily journaling. Daily Journaling is my online diary. You can use it to record daily journals, secret thoughts, journeys, moods, and anything else you want. For starters, you can enter any of your thoughts in text format and wait for the updates in the future. If any, then it might be possible for pictures and other emojis. You can record anything here, like your whole day or only productive things, but I suggest you record in a definite format.";
const homecontactContent =
  "Why should you use this ? Because this simple format for daily journaling is exactly what you want. You created it. Hence, you have total control of it. And unlike others, here you can record in the easy format. Start recording your every day, even if it's non-productive. You know, with daily journaling, three things are going to improve: typing , English phrases, and recording of every day in order to be productive. The reason behind wanting to create this has two reasons. One is to test your coding skills and another is that you can create your own database of your diary, so there is no need for data encryption authentication.";

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.get("/", function (req, res) {
  Item.find({}, function (err, doc) {
    if (err) {
      console.log(err);
    } else {

        res.render("home", {
        startingContent: homeStartingContent,
        posts: doc,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: homeaboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: homecontactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  var post = {
    title: req.body.postTitle,
    content: req.body.postBody,
  };

  const composeItem = new Item({
    title: post.title,
    content: post.content,
  });
  composeItem.save();
  res.redirect("/");
});

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  Item.find({}, function (err, docs) {
    if (!err) {
      docs.forEach(function (post) {
        const storedTitle = _.lowerCase(post.title);

        if (storedTitle === requestedTitle) {
          res.render("post", {
            title: post.title,
            content: post.content,
          });
        } else {
          console.log(err);
        }
      });
    }
  });
});


app.post("/delete",(req,res)=>{
  const deleteThis =   req.body.deleteOne

  Item.deleteOne({_id:deleteThis},function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Succesfully deleted the Item");
      res.redirect("/")
      
    }
    
  })


})

app.listen( process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
