const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require("jsonwebtoken");

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


router.get("/",(req,res)=>{
    db.Tank.findAll().then(tanks=>{
        res.json(tanks)
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    })
})

router.get("/fishes",(req,res)=>{
    db.Tank.findAll({
        include:[db.Fish]
    }).then(tanks=>{
        res.json(tanks)
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    })
})

router.get("/:id/fishes",(req,res)=>{
    db.Tank.findOne({
        where:{
            id:req.params.id
        },
        include:[db.Fish]
    }).then(tanks=>{
        res.json(tanks)
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    })
})

router.post("/",(req,res)=>{
    const userData = authenticateMe(req);
    if(!userData){
        res.status(403).send("login first man");
    } else {
        db.Tank.create({
            name:req.body.name,
            UserId:userData.id
        }).then(newTank=>{
            res.json(newTank)
        }).catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })
    }
})

module.exports = router;