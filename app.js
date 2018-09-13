let bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();


//configure mongoose "connection to DB"
//mongoose.connect("mongodb://localhost/restful_blog_app")
mongoose.connect("mongodb://dogapp:dogapp1@ds155292.mlab.com:55292/dogapp")

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))


//MONGOOSE/MODEL CONFIG Schema
let blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body: String,
    created: {type:Date, default: Date.now}
})
let Blog = mongoose.model("Blog", blogSchema);

            
//RESTful ROUTES
app.get("/", (req, res) => {
    res.render("landing") 
})
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) =>{
        if(err){
            console.log(err)
        }else{
            res.render("index", {blogs:blogs})
        }
    })
})

//GET ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
})

//CREATE ROUTE: Post Route
app.post("/blogs", (req, res) =>{
    req.body.blog.body=req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
})

//SHOW ROUTE (RESTful ROUTE 3)
app.get("/blogs/:id", (req, res) => {
Blog.findById(req.params.id, (err, foundBlog) => {
    if(err){
        res.redirect("/blogs")
    }else{
        res.render("show", {blog:foundBlog})
        }
    })   
})

//EDIT ROUTE (RESTful ROUTE 4)
app.get("/blogs/:id/edit", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog) =>{
       if(err){
           res.redirect("/blogs")
       }else{
           res.render("edit", {blog:foundBlog})
       }
    })
})
//UPDATE ROUTE
app.put("/blogs/:id", (req, res) =>{
    req.body.blog.body=req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect("/blog")
        }else{
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

//DELETE ROUTE 
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect("/blog")
        }else{
            res.redirect("/blogs/")
        }
    })
})

//SERVER CONFIG
app.listen(process.env.PORT, process.env.IP,  () => {
    console.log("YOUR SERVER IS ON!!")
})




