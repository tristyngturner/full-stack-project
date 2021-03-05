const express = require("express");
const app = express();
const db = require("./models");
const crypto = require("crypto");
const pbkdf2 = require("pbkdf2");
const session = require("express-session");
const handlebars = require("express-handlebars");
const { Op } = require("sequelize");
const { read } = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set Handlebars as view engine
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
    defaultLayout: "index",
    partialsDir: __dirname + "/views/partials",
  })
);
// Serve Static css/image files
app.use(express.static("public"));

// test route for HBS

app.get("/school/test", (req,res) => {
res.render("schoolpage")
});

app.get("/school/:id", (req, res) => {
  db.highschool.findOne({where: {id: req.params.id}}).then((results) => {
    // console.log(results)
    school = results.dataValues;
    res.render("schoolpage", {
      highschool: school
    })
  })
})



app.get("/school/:id/thread/:id", (req, res) => {
  db.thread.findOne({where: {id: req.params.id}}).then((results) => {
  // console.log(results)
  thread = results.dataValues
  res.render = ("schoolpage", {
    thread: thread
    })
  })
})

app.get("/school/:id/thread", (req, res) => {
  db.thread.findAll({where: {highschool_id: req.params.id}}).then((results) => {
    // console.log(results)
    results.map((threads) => {
      console.log(threads)
      res.json(threads)
    })
  // return threads
  // }).then((threads) => {
  //     res.render = ("schoolpage", {
  //       thread: threads
  //     })
    }) 
    // res.redirect(`/school/${highschool.id}`)
  })
// })

//^^res.rediirect back to school:id page?

app.post("/school/:id/thread/new", (req, res) => {
  db.thread.findAll().then((results) => {
    newThread = results.push({title: req.body.title, content: req.body.content})
    res.json(newThread)
  })
})
//^^res.redirect back to thread page?

//test route closed

app.get("/", (req, res) => {
  res.render("home", { active: { home: true } });
});

app.get("/login", (req, res) => {
  res.render("login", { active: { login: true } });
});

app.get("/search", (req, res) => {
  res.render("search", { active: { search: true } });
});

app.get("/search/:name", (req, res) => {
  let schoolName = req.params.name;
  // console.log(schoolName);
  db.highschool
    .findAll({
      where: {
        name: {
          [Op.iLike]: `%${schoolName}%`,
        },
      },
    })
    .then((results) => {

    if(results !== undefined && results.length != 0) {
      // console.log(results);
      schools = results.map((school) => school.toJSON());
      console.log(schools);
      res.render("search", {
        schools: schools,
        listExists: true,
        active: { search: true },
      });
    } else {
      res.status(404).send(`No School found matching ${schoolName}`)
    }
    });
});
// -----Routes-----
app.get("/api", function (request, response, next) {
  console.log("someone sent a request home");
  response.send();
});

app.get("/api/search", function (request, response, next) {
  console.log("someone sent a request home");
  response.send();
});

app.get("/api/login", function (request, response, next) {
  console.log("someone sent a request home");
  response.send();
});

// GET All schools
app.get("/api/school", function (request, response, next) {
  db.highschool.findAll().then((results) => {
    res.send(results);
  });
  response.send();
});
app.get("/api/school/:id", function (request, response, next) {
  console.log("someone sent a request home");
  response.send();
});
app.post("/api/login", function (request, response, next) {
  console.log("someone sent a request home");
  response.send();
});

app.post("/api/alumni", function (request, response, next) {
  console.log("someone sent a request home");
  response.send();
});

app.post("/api/school", function (request, response, next) {
  console.log("someone sent a request home");
  response.send();
});

app.listen(3000, function () {
  console.log("listening in port 3000");
});


// if(!schools) {
//   console.log ('got results!')
//   res.status(401).send('No Matching Schools Found');
//   alert(`No Schools Found matching ${schoolName}`);
//   return;
// }