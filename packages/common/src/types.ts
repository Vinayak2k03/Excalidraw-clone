import {z} from 'zod';

export const CreateUserSchema=z.object({
    password:z.string(),
    name:z.string(),
    email:z.string().email(),
    photo:z.string().url().optional()
})

export const SignInSchema=z.object({
    email:z.string().email(),
    password:z.string()
})

export const CreateRoomSchema=z.object({
    name:z.string(),
})