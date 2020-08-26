const express = require("express");
const PORT = process.env.PORT || 3000;
const templates = require("./templates");
const cookieParser = require("cookie-parser")

const server = express();

let posts = [{ author: "oli", title: "hello", content: "lorem ipsum etc" }];

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

server.use(express.urlencoded({extended : true}));
server.use(cookieParser())

server.get("/", (req, res) => {
    const email = req.cookies.email
    const html = templates.home(email);
    res.send(html);
})

server.get("/new-post", (req, res) => {
    const html = templates.newPost();
    res.send(html);
})

server.get("/posts", (req, res) => {
    const html = templates.allPosts(posts)
    res.send(html)
})

server.post("/new-post", express.urlencoded({extended: true}), (req, res) => {
    if (req.cookie) {
        const newPost = req.body;
        newPost.author = res.cookies.email
        res.redirect("/posts");
    } else if (!req.cookie) {
        res.status(401).send("<h1>you are not logged in</h1>")
    }
})

server.get("/posts/:title", (req, res) => {
    const post = posts.find((p) => p.title === req.params.title)
    const html = templates.post(post);
    res.send(html)
})

server.get("/delete-post/:post", (req, res) => {
    const postIndex = posts.findIndex((p) => p.title === req.params.post)
    const deletedPost = posts.splice(postIndex, 1);
    res.redirect("/posts")
})

server.get("/log-in", (req, res) => {
    const html = templates.logIn();
    res.send(html);
})

server.post("/log-in", (req, res) => {
    const email = req.body.email;
    console.log(email)
    res.cookie("email", email, { maxAge: 60000});
    res.redirect("/")
})

server.get("/log-out", (req, res) => {
    res.clearCookie("email")
    res.redirect("/")
})

server.use(express.static("workshop/public"))