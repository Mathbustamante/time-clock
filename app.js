var express     = require("express");
    app         = express(),
    methodOverride = require("method-override"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://matheus:matheus@ds127968.mlab.com:27968/timeclock");



app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

//Mongoose1/ Model config.
var timeclockSchema = new mongoose.Schema({
    name: String,
    image: String,
    Hometown: String,
    Major: String,
    InvolvedIn: String,
    FunFact: String,
    created: { type : Date, default: Date.now },
});

var TimeClock = mongoose.model('TimeClock', timeclockSchema);

var mongoWorkers = mongoose.model("mongoWorkers", timeclockSchema);



//ROUTES
//INDEX ROUTE
app.get("/", function(req, res){
    res.redirect("/timeclock");
});

app.get("/timeclock", function(req, res){
    TimeClock.find({}, function(err, person){
        if(err){
            console.log(err);
        } else if(!person.length) {
            res.render("landing");
        } else{ 
            res.render("index", {person: person});
        }
    })
});

//NEW ROUTE
app.get("/timeclock/new", function(req, res) {
 
    mongoWorkers.find({}, function(err, worker){
        if(err){
            console.log(err);
        } else {
          res.render("new",  {worker: worker});
        }
    });
});


// CREATE ROUTE
app.post("/timeclock", function(req, res){
    TimeClock.create(req.body.worker, function(err, newWorker){
        if(err){
            res.render("new");
        } else {
            res.redirect("/timeclock");
        }
    });
});

// SHOW ROUTE
app.get("/timeclock/:id", function(req, res){
  TimeClock.findById(req.params.id, function(err, foundWorker){
      if(err){
          res.redirect("/timeclock");
      } else {
          res.render("show", {worker: foundWorker});
      }
  })
});

//EDIT AND UPDATE
app.get("/timeclock/:id/edit", function(req, res) {
    TimeClock.findById(req.params.id, function(err, foundworker){
        if(err){
            res.redirect("/timeclock");
        } else{
            res.render("edit", {worker: foundworker});
        }
    });
});

//UPDATE 
app.put("/timeclock/:id", function(req, res){
    TimeClock.findByIdAndUpdate(req.params.id, req.body.worker, function(err, updatedWorker){
        if(err){
            res.redirect("/timeclock");
        } else {
            res.redirect("/timeclock/" + req.params.id);
        }
    });
});


// DELETE ROUTE
app.delete("/timeclock/:id", function(req, res){
   //clock out
   TimeClock.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/timeclock");
       } else {
           res.redirect("/timeclock");
       }
   })
 
});




// app.listen(3000, function(){
// 	console.log("Server has started on port 3000");
// });

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("it_forum server is running!!");
});




	

