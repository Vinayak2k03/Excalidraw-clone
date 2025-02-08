import express from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {CreateRoomSchema, CreateUserSchema, SignInSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client"

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({
        message: "Invalid data",
      });
      return;
    }

    const response=await prismaClient.user.findFirst({
      where:{
        username:parsedData.data.username
      }
    })
  
    if(response){
      res.status(400).json({
        message:"User already exists"
      })
      return;
    }

    const {username,password,name,photo,email}=parsedData.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prismaClient.user.create({
      data:{
        username,
        password:hashedPassword,
        name,
        photo,
        email
      }
    })

    res.json({
      message: "You are signed up",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/signin", async(req, res) => {
  try {
    const parsedData = SignInSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({
        message: "Invalid data",
      });
      return;
    }

    const {username,password}=req.body;

    const user=await prismaClient.user.findFirst({
      where:{
        username
      }
    })

    if(!user){
      res.status(401).json({
        message:"User not found"
      })
      return;
    }

    const passwordMatch=bcrypt.compare(password,password);

    if(!passwordMatch){
        res.status(401).json({
            message:"Invalid password"
        })
        return;
    }

    const token=jwt.sign({
        id:user.id
    },JWT_SECRET);
    
    res.json({
        message:"You are signed in",
        token
    })

  } catch (err) {
    res.status(500).json({
        error:err,
        message:"Internal Server error"
    })
  }
});

app.post("/room", (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({
        message: "Invalid data",
      });
      return;
    }
    // db call
    res.json({
        roomId:123
    })
});

app.listen(3001);
