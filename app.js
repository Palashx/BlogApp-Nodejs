var express = require("express"),
    methodOverride = require("method-override"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));    
app.use(express.static("public"));
app.use(methodOverride("_method"));
// Connecting to mongoose
mongoose.connect('mongodb://localhost:27017/blog_app', {useNewUrlParser: true});


// Mongoose configuration
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1447684808650-354ae64db5b8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d3786eeaf183b022befb24523a4e64a0&auto=format&fit=crop&w=747&q=80",
//     body: "This is a blog post!!"
// });

app.get("/", function(req,res){
    res.redirect("/blogs");
});

// INdex route
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, allblogs){
        
        if(err){
            console.log("Something went wrong");
        }
        else{
            res.render("index", {blogsejs: allblogs});
        }
    });
});

app.post("/blogs", function(req,res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log("Something went wrong in Blog.create");
            res.render("new");
        } else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/new", function(req,res){
    res.render("new");    
});

app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundblog){
        if(err){
            console.log("Something went wrong in Blog.findById");
            console.log(err);
        } else{
            console.log("In show");
            console.log(foundblog);
            res.render("show", {blogejs: foundblog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundblog){
        if(err){
            console.log("Something went wrong in edit route");
        } else{
            console.log("In edit "+  req.params.id);
            res.render("edit", {blogejs: foundblog});
        }
            
    });
});

// PUT request
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
        if(err){
            console.log("Something is wring in the update route");
            res.redirect("/blogs");
        } else{
             res.redirect("/blogs/"+ req.params.id);
        }
    });
    
    
  //  res.send("Update route");
});

app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("Something went wrng in delete route.");
        }
    });
    res.redirect("/blogs");
    
});







app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Blog app has started");
});