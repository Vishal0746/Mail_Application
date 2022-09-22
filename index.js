const express= require("express");
const https= require("https");
const bodyparser= require("body-parser");

const app= express();
app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended:true}));

// On the home route, send signup html template
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

// Manage post request on home route and
// Send data to the MailChimp account via API
app.post("/",function(req,res){
  var firstName=req.body.fname;
  var lastname=req.body.lname;
  var mail=req.body.mail;

  var data={
    members:[{
      email_address: mail,
      status: "subscribed",
      merge_fields:{
        FNAME: firstName,
        LNAME: lastname
      }
    }]
  }

// Converting string data to JSON data
const jsonData= JSON.stringify(data);
const url="https://us17.api.mailchimp.com/3.0/lists/ed4040696e";
const options={
  method:"POST",
  auth:"201951173:d0d355b7baecbf3c498fa7d99905131f-us17"
}
const request=https.request(url,options,function(response){
  if(response.statusCode===200){
    res.sendFile(__dirname+"/success.html");
  }else{
    res.sendFile(__dirname+"/fail.html");
  }
  response.on("data",function(data){
    console.log(JSON.parse(data));
  });
});
  request.write(jsonData);
  request.end();
});



app.listen(process.env.PORT || 8000,function(){
  console.log("server is running on port 8000.");
})
