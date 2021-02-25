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
    db.Fish.findAll().then(tanks=>{
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
        db.Tank.findOne({
            where:{
                id:req.body.tank
            }
        }).then(tank=>{
            
            if(tank.UserId===userData.id){
                db.Fish.create({
                    name:req.body.name,
                    color:req.body.color,
                    width:req.body.width,
                    TankId:req.body.tank,
                    UserId:userData.id
                }).then(newTank=>{
                    res.json(newTank)
                }).catch(err=>{
                    console.log(err);
                    res.status(500).json(err);
                })
            } else {
                res.status(403).send("that isnt your tank")
            }
        }).catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })
        
    }
})

router.delete("/:id",(req,res)=>{
    const userData = authenticateMe(req);
    db.Fish.findOne({
        where:{
            id:req.params.id
        }
    }).then(fish=>{
        if(fish.UserId===userData.id){
            db.Fish.destroy({
                where:{
                    id:req.params.id
                }
            }).then(delFish=>{
                res.json(delFish)
            }).catch(err=>{
                console.log(err)
                res.status(500).json(err)
            })
        }else {
            res.status(403).send("not your fish")
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err)
    })
})

module.exports = router;