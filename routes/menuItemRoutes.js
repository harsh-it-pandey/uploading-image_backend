const express = require('express');
const router = express.Router();
const MenuItem = require('./../models/MenuItem');

//POST method to add a menu Item
router.post('/',async(req,res)=>{
    try{
        const data = req.body
        const newMenu = new MenuItem(data);
        const response = await newMenu.save();
        console.log('data saved');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : "internal server error"});
    }
})

// Get method to get the menu
router.get('/',async(req,res)=>{
    try{
       const data = await MenuItem.find();
       console.log('data fetched');
       res.status(200).json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({error : "internal server error"});
    }
})


//paramterized API 
router.get('/:tasteType',async(req,res)=>{
    try{
        const tasteType = req.params.tasteType;//extract the tasteType fro the URL parameter
        if(tasteType=='sweet' || tasteType =='spicy' || tasteType == 'sour'){
            const response = await MenuItem.find({taste:tasteType});
            console.log('response fetched');
            res.status(200).json(response);
        }else{
            res.status(404).json({error : "Invalid work type"})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server Error'});
    } 
})


module.exports = router;
