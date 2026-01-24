import express from "express";
const port = 2000;
const app = express();
app.use(express.static('public'));

app.get("/",(_req,res)=>{
  res.redirect("/JobTracker");
});


app.get("/JobTracker",(_req,res)=>{
  res.render("home.ejs");
});
app.listen(port,()=>{
  console.log(`server started on port, ${port}`);
});
