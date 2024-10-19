import User from '../models/User.js';
import bycryt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const register = async (req,res)=>{
    const {username , password} = req.body;

    try{
        const existing = await User.findOne({username});
        if(existing){
            return res.status(400).json({message:'User already existing'});
        }

        const salt = await bycryt.genSalt(10);
        const hashedPassword = await bycryt.hash(password,salt);

        const newUser = new User({username:username , password:hashedPassword});
        await newUser.save();

        res.status(201).json({message:'User created successfully!!'});

    }catch(err){
        res.status(500).json({message:err.message})
    }
}


export const login = async (req,res) =>{

    const {username , password} = req.body;

    try{
        const user = await User.findOne({username});
        if(!user){
            console.log('not a user');
            return res.status(400).json({message:'Invalid Credential'});
        }

        const isMatch =  bycryt.compare(password,user.password);

        if(!isMatch){
            console.log('not match');
            return res.status(400).json({message:'Invalid credentials'});
            
        }

        const token = jwt.sign({
            userId:user._id,
            username:user.username,
        },
        process.env.JWT_SECRET,
        {expiresIn:'1hr'}
    );


    res.status(201).json({'token':token , 'userId':user._id});

    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});

    }
}