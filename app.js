//jshint esversion:6

// Set up the following packages:
// Express
const express = require("express");
// body-parser
const bodyParser = require("body-parser");
// ejs
const ejs = require("ejs");
// mongoose
const mongoose = require("mongoose");

// Set up express server
const app = express();

// Set up EJS view engine
app.set("view engine", "ejs");

// Set up body-parser
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));



//connect to MongoDB by specifying port to access MongoDB server
main().catch(err => console.log(err));
 
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WikiDB');
}

// Create article Schema
const articleSchema = new mongoose.Schema ({
  title: { type: String,
      required: [true, "No title entered"]
  },
  content: { type: String,
    required: [true, "No content entered"]
  } ,
  topic: String
})

// Assign Schema to mongoose
const Article = mongoose.model("article", articleSchema);

const article1 = new Article ({
  title:"API",
  content: "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer.",
  topic:"General Dev"
}) ;

const article2 = new Article({
  title: "BootStrap",
  content: "This is a framework developed by Twitter that contains pre-made front-end templates for web design",
  topic:"CSS"
});

const article3 = new Article({
  title: "DOM",
  content: "The Document Object Model is like an API for interacting with our HTML",
  topic:"JavaScript"
});

const defaultContent = [article1, article2, article3];

// Create Get Route to check if any data exists,
// to load data into the database if needed and then
// load home page with entries

app.get("/", function(req, res){
  Article.find()
      .then(function(foundArticles){
          if (foundArticles.length === 0){
              Article.insertMany(defaultContent);
              res.redirect("/");
          } else {
              res.render("home", {title:"Welcome to my Web Development Wikipedia", posts: foundArticles});
          }
      })
      .catch(function(err){
          console.log(err);
      })    
  });

app.get("/compose", function(req, res){
    res.render("compose")
});


// Create a post route for compose where,
// checks to see if entry already there, before adding to database
app.post("/compose", function(req, res){
  const title = req.body.title;
  const content = req.body.content;
  const topic = req.body.topic;

  const article = new Article({title:title, content: content, topic:topic});
  
  Article.findOne({title:title})
  .then(function(foundArticles){
      if (foundArticles != null){
          console.log("Already Created");
          res.redirect("/");
      } else {
          console.log("Article Added");
          article.save();
          res.redirect("/");
      }
  })
  .catch(function(err){
      console.log(err);
  })   
});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = req.params.postName;

  // Add code to find the requested post title in database and pass it to the post ejs page
  Article.find()
      .then(function(posts){
        posts.forEach(function(post){
          const storedTitle = post.title;
          if (storedTitle === requestedTitle ){ 
            res.render("post",{postTitle: post.title, postContent: post.content}); 
          } 
        });
      })
      .catch(function(err){
          console.log(err);
      })    
  });

// Filters
app.get("/posts/topic/css", function(req, res){
  Article.find({topic:"CSS"})
      .then(function(foundArticles){
          if (foundArticles.length === 0){
              Article.insertMany(defaultContent);
              res.redirect("/");
          } else {
              res.render("home", {title:"CSS", posts: foundArticles});
          }
      })
      .catch(function(err){
          console.log(err);
      })    
  });

  app.get("/posts/topic/javascript", function(req, res){
    Article.find({topic:"JavaScript"})
        .then(function(foundArticles){
            if (foundArticles.length === 0){
                Article.insertMany(defaultContent);
                res.redirect("/");
            } else {
                res.render("home", {title: "JavaScript", posts: foundArticles});
            }
        })
        .catch(function(err){
            console.log(err);
        })    
    });

  app.get("/posts/topic/general-dev", function(req, res){
    Article.find({topic:"General Dev"})
        .then(function(foundArticles){
            if (foundArticles.length === 0){
                Article.insertMany(defaultContent);
                res.redirect("/");
            } else {
                res.render("home", {title: "General Dev", posts: foundArticles});
            }
        })
        .catch(function(err){
            console.log(err);
        })    
    });

    app.get("/posts/topic/html", function(req, res){
      Article.find({topic:"HTML"})
          .then(function(foundArticles){
              if (foundArticles.length === 0){
                  Article.insertMany(defaultContent);
                  res.redirect("/");
              } else {
                  res.render("home", {title: "HTML", posts: foundArticles});
              }
          })
          .catch(function(err){
              console.log(err);
          })    
      });

      app.get("/posts/topic/images", function(req, res){
        Article.find({topic:"Images"})
            .then(function(foundArticles){
                if (foundArticles.length === 0){
                    Article.insertMany(defaultContent);
                    res.redirect("/");
                } else {
                    res.render("home", {title: "Images", posts: foundArticles});
                }
            })
            .catch(function(err){
                console.log(err);
            })    
        });

        app.get("/posts/topic/databases", function(req, res){
          Article.find({topic:"Databases"})
              .then(function(foundArticles){
                  if (foundArticles.length === 0){
                      Article.insertMany(defaultContent);
                      res.redirect("/");
                  } else {
                      res.render("home", {title: "Databases", posts: foundArticles});
                  }
              })
              .catch(function(err){
                  console.log(err);
              })    
          });


// Set up port listening code 
app.listen(3000, function(){
  console.log("Server is started on port 3000")
});
