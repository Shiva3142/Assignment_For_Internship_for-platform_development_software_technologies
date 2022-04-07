const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors =require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(
    session({
        secret: "ShivkumarChauhan",
        resave: false,
        saveUninitialized: true,
        maxAge: Date.now() + 150000,
    })
);
app.use(
    cors({
        credentials: true,
        origin: [
            "http://localhost:3000",
            "https://localhost:3000",
        ],
    })
);

dotenv.config({
    path: "./config.env",
});
const Database = process.env.DATABASE;
let port = process.env.PORT || 80;

mongoose.connect(Database, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
db = mongoose.connection;
db.once("open", () => {
    console.log("connected to database");
});

let userschema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String
});
let todolistschema = new mongoose.Schema({
    content:String,
    createdby:String,
    createdAt:{
        type:String,
        default:new Date().toISOString()
    }
});

let userdetails = mongoose.model("userdetails", userschema);
let tododetails = mongoose.model("tododetails", todolistschema);

const redirectlogin = (req, res, next) => {
    if (!req.session.useremail) {
        res.status(407).send("user is not logged in");
    } else {
        next();
    }
};

const redirecthome = (req, res, next) => {
    if (req.session.useremail) {
        res.status(403).send("bad request");
    } else {
        next();
    }
};

app.post("/authunicateuser", (req, res) => {
    if (req.session.useremail) {
        res.status(200).send({
            username: req.session.username,
        });
    } else {
        res.status(404).send({
            user: false,
        });
    }
});

app.post("/login", redirecthome, (req, res) => {
    console.log(req.body);
    let entry = {
        email: req.body.email.toLowerCase(),
        password: req.body.password,
    };
    console.log(entry);
    userdetails.findOne(
        {
            $or:[
                {
                    email: entry.email
                },
                {
                    username:entry.email
                }
            ]
        },
        (err, data) => {
            console.log(data);
            if (data !== null) {
                bcrypt.compare(
                    entry.password,
                    data.password,
                    function (err, result) {
                        if (result === true) {
                            req.session.username = data.username;
                            req.session.userid = data._id;
                            req.session.useremail = data.email;
                            console.log(req.session.username);
                            req.session.save((err) => {
                                if (err) {
                                    console.log("error on session saving", err);
                                    res.status(403).send({
                                        message: "Some Error Occured"
                                    });
                                } else {
                                    console.log("logging in -> ",data.username);
                                    res.json({
                                        username: data.username,
                                        user_id: data._id,
                                    });
                                }
                            });
                        } else {
                            res.status(401).json({
                                message: "invalid credentials",
                            });
                        }
                    }
                );
            } else {
                res.status(401).json({
                    message: "invalid credentials",
                });
            }
        }
    );
});

app.post('/register',redirecthome,(req,res)=>{
    console.log(req.body);
    let entry = {
        name:req.body.name.toLowerCase(),
        email: req.body.email.toLowerCase(),
        username: req.body.username,
        password: req.body.password,
    };
    userdetails.findOne({
        $or:[
            {
                email: entry.email
            },
            {
                username:entry.username
            }
        ]
    },(err,data)=>{
        if (data==null) {
            bcrypt.hash(entry.password, 12, function (err, hash) {
                console.log(hash);
                let data_entry = {
                    name: entry.name,
                    email: entry.email,
                    username: entry.username,
                    password: hash,
                };
                console.log(entry);
                let userdetail = new userdetails(data_entry);
                userdetail.save((err, data) => {
                    if (err) {
                        console.log(err);
                    }
                    req.session.username = data.username;
                    req.session.userid = data._id;
                    req.session.useremail = data.email;
                    console.log(req.session.username);
                    req.session.save((err) => {
                        if (err) {
                            console.log("error on saving", err);
                        }
                    });
                    res.json({
                        username: data.username,
                        user_id: data._id,
                    });
                });
            });
        } else {
            res.status(400).json({
                message: "User already exists for same username or email",
            });
        }
    })
    console.log(entry);
})

app.post('/addtodoitem',redirectlogin,(req,res)=>{
    let entry={
        content:req.body.todo,
        createdby:req.session.useremail
    }
    let tododetail=new tododetails(entry);
    tododetail.save((error)=>{
        if (error) {
            console.log(error);
        }
        tododetails.find({createdby:req.session.useremail},(err,data)=>{
            if (data!==null) {
                res.send(data);
            } else {
                res.send([])
            }
        })
    })
})

app.post('/deletetodoItem',redirectlogin,(req,res)=>{
    console.log(req.body);
    tododetails.deleteOne({_id:req.body.id},(error,data)=>{
        if (error) {
            console.log(error);
        }
        tododetails.find({createdby:req.session.useremail},(err,data)=>{
            if (data!==null) {
                res.send(data);
            } else {
                res.send([])
            }
        })
    })
})


app.post('/gettodoitems',redirectlogin,(req,res)=>{
    tododetails.find({createdby:req.session.useremail},(err,data)=>{
        if (data!==null) {
            res.send(data);
        } else {
            res.send([])
        }
    })
})


app.post('/updateusername',redirectlogin,(req,res)=>{
    console.log(req.body);
    userdetails.updateOne({email:req.session.useremail},{$set:{username:req.body.username}},(error,data)=>{
        if (error) {
            console.log(error);
        }
        console.log(data);
        req.session.username = req.body.username;
        
        req.session.save((err) => {
            if (err) {
                console.log("error on saving", err);
            }
        });
        res.send({
            username:req.body.username
        })
    })
})


app.post('/updatepassword',redirectlogin,(req,res)=>{
    console.log(req.body);
    bcrypt.hash(req.body.newpassword, 12, function (err, hash) {
        userdetails.updateOne({email:req.session.useremail},{$set:{password:hash}},(error,data)=>{
            if (error) {
                console.log(error);
            }
            console.log(data);
            res.send({message:"done"})
        })
    })
})












app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        console.log("session Destroyed");
    });
    res.status(200).send("logged out");
});

app.listen(port, () => {
    console.log("Server is started at http://127.0.0.1:" + port);
});
