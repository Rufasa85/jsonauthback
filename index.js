var express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;


// Requiring our models for syncing
var db = require('./models');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

const authenticateMe = (req)=>{
    let token = false;

    if(!req.headers){
        token=false
    }
    else if(!req.headers.authorization) {
        token=false;
    }
    else {
        token = req.headers.authorization.split(" ")[1];
    }
    let data = false;
    if(token){
        data = jwt.verify(token,"catscatscats",(err,data)=>{
            if(err) {
                return false;
            } else {
                return data
            }
        })
    }
    return data;
}

app.get("/",(req,res)=>{
    res.send("this is the home page.")
})

app.post("/signup",(req,res)=>{
    db.User.create(req.body).then(newUser=>{
        const token = jwt.sign({
            email:newUser.email,
            id:newUser.id
        },"catscatscats",
        {
            expiresIn:"2h"
        })
        return res.json({user:newUser,token})
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    })
})

app.post('/login',(req,res)=>{
    db.User.findOne({
        where:{
            email:req.body.email
        }
    }).then(user=>{
        if(!user){
            return res.status(404).send('no such user')
        }
        else if(bcrypt.compareSync(req.body.password,user.password)){
            const token = jwt.sign({
                email:user.email,
                id:user.id
            },"catscatscats",
            {
                expiresIn:"2h"
            })
            return res.json({user,token})
        }
        else {
            return res.status(403).send('wrong password')
        }
    })
})


app.get('/secretclub',(req,res)=>{
    // let token = false;

    // if(!req.headers){
    //     token=false
    // }
    // else if(!req.headers.authorization) {
    //     token=false;
    // }
    // else {
    //     token = req.headers.authorization.split(" ")[1];
    // }

    // if(!token){
    //     res.status(403).send('log in first man')
    // }
    // else {
    //     const data = jwt.verify(token,"catscatscats",(err,data)=>{
    //         if(err){
    //             return false
    //         } else {
    //             return data;
    //         }
    //     })
    //     if(data){
    //         res.json(data)
    //     } else {
    //         res.status(403).send('auth failed');
    //     }
    // }
    let tokenData = authenticateMe(req);
    if(tokenData){
        res.json(tokenData);
    } else{
        res.status(403).send('auth failed')
    }
})

db.sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});