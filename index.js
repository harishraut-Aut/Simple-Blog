//jshint esversion:6
const express  = require("express");
const bodyp    = require("body-parser");
const ejs      = require("ejs");
const _        = require("lodash");
const mongoose = require('mongoose');
const app      = express();

var dataObjectArray       = [];

const homeStartingContent = "WELCOME TO HOMEPAGE.";

const aboutContent        = "WELCOME TO ABOUT PAGE.";

const contactContent      = "WELCOME TO CONTACT PAGE.";

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyp.urlencoded(
{
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/Simpleblog",
{
    useNewUrlParser: true
});

const postSchema = {
    title   : String,
    postbody: String
};

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res)
{
    // Old Way to show data

    // console.log(dataObjectArray);
    // res.render("home",
    // {
    //     FirstSentence: homeStartingContent,
    //     posts        : dataObjectArray,
    // });

    Post.find(
    {}, function(err, posts)
    {
        res.render("home",
        {
            FirstSentence: homeStartingContent,
            posts        : posts
        });
    });
});

//  HOW IT IS GETTING FORMATTED
app.get("/about", function(req, res)
{
    res.render("about",
    {
        "AboutSentence": aboutContent
    });
});

app.get("/contact", function(req, res)
{
    res.render("contact",
    {
        "ContactSentence": contactContent
    });
});

app.get("/compose", function(req, res)
{
    res.render("compose");
});

app.post("/compose", function(req, res)
{

    // array approach temporary
    // this composed dat array is a javascript object 
    // it contains key value pair sof title and post
    // var composedData = 
    // {
    //     title: req.body.postTitle,
    //     postbody: req.body.postMsg
    // };
    // dataObjectArray.push(composedData);
    // res.redirect("/");

    // now using database mongoDB
    const post = new Post(
    {
        title   : req.body.postTitle,
        postbody: req.body.postMsg
    });

    post.save(function(err)
    {
        if (!err)
        {
            res.redirect("/");
        }
    });

});
//this is express routing parameter whenever user will access this route we can use callback 
//function to tap into that : part and get its value 

app.get("/home/:postName", function(req, res)
{

    const queryparameter = req.params.postName;

    console.log(queryparameter);

    Post.findOne(
    {
        _id: queryparameter
    }, function(err, post)
    {
        res.render("post",
        {
            sepTitles  : post.title,
            sepPostbody: post.postbody
        });
    });

    //+++++++++++Array Approach++++++++++++//
    // for (var i = 0; i < dataObjectArray.length; i++)
    // {
    //     console.log(dataObjectArray[i].title);
    //     var titlesinArray = _.lowerCase(dataObjectArray[i].title);
    //     console.log("titlesinArray" + titlesinArray);
    //     if (titlesinArray === queryparameter)
    //     {
    //         // console.log("match found");
    //         var matchedTitle = titlesinArray.toUpperCase();
    //         // var matchedPostbody =   
    //         var respectedPostmsg =
    //             res.render("post",
    //             {
    //                 "sepTitles"  : dataObjectArray[i].title,
    //                 "sepPostbody": dataObjectArray[i].postbody
    //             });
    //     }

    // }

});

app.listen(3000, function(req, res)
{
    console.log("Server Started on port 3000");
});

// db.products.find(
//                    {
//                        stock: 20
//                    }
//                    , 
//                    {
//                       name: 1
//                    }
//                 )