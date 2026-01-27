import express from "express";
import pg from "pg";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

const port = 2000;
const app = express();
const db = new pg.Pool({
  user: "postgres",
  host:"localhost",
  port: 6969,
  database: "jobTracker",
  password: "Vasantha123"
});

app.set("view engine","ejs");
app.set("case sensitive routing" ,true);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret: "TOPSECRET",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//home page
app.get("/",(_req,res)=>{
  res.redirect("/jobTracker");
});

app.get("/jobTracker",(_req,res)=>{
  res.render("home.ejs");
});

//get signup
app.get("/jobTracker/signup",(_req,res)=>{
  res.render("signup");
})

//get login page
app.get("/jobTracker/login",(_req,res)=>{
  res.render("login");
})
app.post("/login",passport.authenticate("local",{
  successRedirect:"/jobs",
  failureRedirect:"/login"
}));


passport.use(new Strategy(async function verify(username,password,done){
  try{
    const result = await db.query("select * from jobs where email = $1",[username]);

  }catch(err){

  }
}));
app.listen(port,()=>{
  console.log(`server started on port, ${port}`);
});
