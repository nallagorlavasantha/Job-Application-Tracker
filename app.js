import express from "express";
import pg from "pg";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

const port = 2000;
const app = express();
const saltRounds = 10;
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
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret: "TOPSECRET",
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(passport.initialize());
app.use(passport.session());

//home page
app.get("/",(_req,res)=>{
  res.redirect("/jobTracker");
});

app.get("/jobTracker",(req,res)=>{
  console.log(req.user);
  if(req.user){
   return  res.render("home",{user:req.user});
  }
  else{
    return res.render("home");
  }
  
});

//get signup
app.get("/jobTracker/signup",(_req,res)=>{
  res.render("signup");
})

app.post("/signup",async (req,res,next)=>{
  //check if email already exists in database
 
    if(req.body.username){

      try{
        const result = await db.query("select * from users where email = $1",[req.body.username]);
        if(result.rowCount >= 1){
          //email already exists notify the user to try loggin in 
          return res.json({notify:"Email already exists try logging in!"});
        }else{
          //hash the password and save the user in database
          bcrypt.hash(req.body.password,saltRounds,async (err,hash)=>{
            if(err){
              console.log(`Error while hashing the password, `+err);
              return res.statusCode(500);
            }
            else{
              //insert them to users table 
              const result = await db.query("insert into users(name,email,password) values($1,$2,$3) returning id",[req.body.name,req.body.username,hash]);
              let user = result.rows[0];
              req.login(user,(err)=>{
                if(err){
                  console.log(next(err));
                  return next(err)
                }
                else{
                  return res.json({redirect: '/jobTracker'});
                }
              })
            }
          });
        }
      }catch(err){
        console.log(err)
      }
    }
    
  

})
//get login page
app.get("/jobTracker/login",(_req,res)=>{
  res.render("login");
})
app.post("/login",(req,res,next)=>{
  passport.authenticate("local",(err,user,info)=>{
  if(err){
    return next(err);
  }
  if(!user){
    return res.json({message:info.message});
  }
  req.login(user,(err)=>{
    if(err){
      return next(err);
    }
    return res.json({message:"login success"});
  });
})(req,res,next);
});


passport.use(new Strategy(async function verify(username,password,done){
  try{
    const result = await db.query("select * from users where email = $1",[username]);
    if(result.rowCount == 1){
      //correct email verify the passwords.
      let user = result.rows[0];
      let hash = user.password;
      
      //compare the hash and password
      bcrypt.compare(password,hash,(err,match)=>{
        if(err){
          //err while decrypting the passwords
          return done(err);
        }
        if(match){
          //password matched 
          return done(null,user,{message:"login successfull"});
        }
        else{
          //incorrect password
          return done(null,false,{message:"incorrect password"});
        }

      })

    }else{
      //incorrect email
      return done(null,false,{message:"invalid email"});
    }

  }catch(err){
    console.log(err);
  }
}));

passport.serializeUser((user,done)=>{
  done(null,user.id);
});

passport.deserializeUser(async (id,done)=>{
  //extract user data from database
  try{
    const result = await db.query("select name, email from users where id = $1",[id]);
    let user = result.rows[0];
    done(null,user);
  }catch(err){
    console.log(err);
  }
  
})
app.listen(port,()=>{
  console.log(`server started on port, ${port}`);
});
