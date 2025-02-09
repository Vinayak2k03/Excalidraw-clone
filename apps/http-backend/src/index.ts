import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SignInSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { authMiddleware } from "./middleware";

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

    const response = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });

    if (response) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const { password, name, photo, email } = parsedData.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prismaClient.user.create({
      data: {
        password: hashedPassword,
        name,
        photo,
        email,
      },
    });

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

app.post("/signin", async (req, res) => {
  try {
    const parsedData = SignInSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({
        message: "Invalid data",
      });
      return;
    }

    const { email, password } = req.body;

    const user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }

    const passwordMatch = bcrypt.compare(password, password);

    if (!passwordMatch) {
      res.status(401).json({
        message: "Invalid password",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET
    );

    res.json({
      message: "You are signed in",
      token,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Internal Server error",
    });
  }
});

// create a room
app.post("/room", authMiddleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }

  const userId = req.userId;

  if (!userId) {
    res.status(400).json({
      message: "User ID is required",
    });
    return;
  }

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (err) {
    res.status(411).json({
      message: "Room already exists with this name",
    });
  }
});

// get all previous chats of a room
app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch (err) {
    console.log(err);
    res.json({
      messages: [],
    });
  }
});


// get room id given slug
app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });
  res.json({
    room,
  });
});

app.listen(3001);
