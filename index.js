const express = require('express')
const mongoose = require('mongoose')
const UserModel = require('./models/user.model')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/signup", async(req, res)=>{

	const {name, email, password, age}= req.body;
	const user = new UserModel({name, email, password, age})

	await user.save()
	return res.status(201).send("User created successfully");
})

app.post("/login", async(req, res)=>{

	const {email, password,}= req.body;
	const user = await UserModel.findOne({email, password})
	if(user){
		//generate the token 
		const token = jwt.sign(
			{id: user._id, name: user.name, age: user.age},
			"SECRET1234"
		)
		const refreshtoken = jwt.sign(
			{id: user._id, name: user.name, age: user.age},
			"SECRET1234"
		)
		// jwt.verify(token, "SECRET1234")
		return res.send({message: "Login Success", token,refreshtoken})
	}
	return res.status(401).send("Invalid Credentials")
})

app.get("/user/:id", async(req,res)=>{
	const {id} = req.params;
	const token = req.headers["authorization"]
	if(!token){
		return res.send("Unauthorization")
	}
	try{ 
        const verification = jwt.verify(token,"SECRET1234")
		if(verification){
			const user = await UserModel.findOne({_id: id});
			return res.send(user)
		}
	} catch (e){
		return res.send("invalid token")
	}
})

app.get("/", (req, res)=> res.send("Hello"));


mongoose.connect("mongodb://localhost:27017/b21").then(()=>{

	app.listen(8080, ()=>{
		console.log("server started on port 8080")
	})
})