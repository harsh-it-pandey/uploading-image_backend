const express = require('express');
const router = express.Router();
const Person = require('./../models/Person');
const { request } = require('http');
const {jwtAuthMiddleware,generateToken} = require('./../jwt');
const { JsonWebTokenError } = require('jsonwebtoken');

// Endpoint to create a new Person
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        // Validate 'work' field (if required)
        if (!['chef', 'waiter', 'manager'].includes(data.work)) {
            return res.status(400).json({ error: 'Invalid work role' });
        }

        // Create a new Person document using the mongoose model
        const newPerson = new Person(data);

        // Save the new person to the database
        const response = await newPerson.save();
        console.log('Data saved:', response);

        const payload = {
            id : response.id,
            username : response.username
        }

        console.log(JSON.stringify(payload));
        const token = generateToken(response.username);
        console.log("Token is:" , token);

        res.status(200).json({response:response,token:token}); // ✅ 201 Created
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

//LOGIN ROUTE
router.post('/login', async(req,res)=>{
    try{
        // Extract username and password from request body
        const {username,password} = req.body;

        //find the user by username
        const user = await Person.findOne({username: username});

        //if user dose net exist or password does net match, return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error : 'Invalid username and password'});
        }

        // generate tokens
        const payload = {
            id: user.id,
            username: user.username
        }

        const token = generateToken(payload);

        // return token as response
        res.json({token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : 'Interna server error'});
    }
})

//profile route
router.get('/profile',jwtAuthMiddleware, async (req,res)=>{
    try{
        const userData = req.user;
        console.log("user data :" + userData);

        const userId = userData.id;
        const user = await Person.findById(userId);
        
        res.status(200).json({user});

    }catch(err){
        console.log(err);
        res.status(401).json({error : 'Invalid error'});
    }
})

//GET  METHOD
router.get('/',jwtAuthMiddleware,async(req,res)=>{
    try{
       const data = await Person.find();
       console.log('data fetched');
       res.status(200).json(data);
    }catch(err){
       console.log(err);
       res.status(500).json({error : "Internal server error"});
    }
})

//paramterized API 
router.get('/:workType',async(req,res)=>{
    try{
        const workType = req.params.workType;//extract the worktype fro the URL parameter
        if(workType=='chef' || workType == 'manager' || workType == 'waiter'){
            const response = await Person.find({work:workType});
            console.log('response fetched');
            res.status(200).json(response);
        }else{
            res.status(404).json({error : "Invalid work type"})
        }
    }catch(err){
        console.log(err);
        re.status(500).json({error: 'Internal server Error'});
    } 
})

//PUT(UPDATE) the person data
router.put('/:id', async (req,res)=>{
    try{
       const personId = req.params.id;// extract the id from the URL parameter
       const updatedPersonData = req.body; //updated data for the person

       const response = await Person.findByIdAndUpdate(personId,updatedPersonData,{
        new : true, // return the updated document
        runValidators: true , // run mongooose validation
       })
        
       if(!response){
        return res.status(404).json({error : 'Person not found'});
       }

       console.log('data updated');
       res.status(200).json(response);

    }
    catch(err){
       console.log(err);
       res.status(500).json({error : 'Internal server Error'});
    }
})

router.delete('/:id', async (req,res)=>{
    try{
       const personId = req.params.id;//extract the person's ID from the URL parameter
       // assuminng you have a person model
       const response = await Person.findByIdAndDelete(personId);
       if(!response){
           return res.status(404).json({error : 'Person not found'});
        }
        console.log('data deleted');
        res.status(200).json(response);

    }catch(err){
       console.log(err);
       res.status(500).json({error : 'Internal server error'});
    }
})

module.exports = router;
