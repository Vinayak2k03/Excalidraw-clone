"use client";

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRef } from "react";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const signup=async(email:string,password:string,name:string)=>{
        const response=await axios.post(`${HTTP_BACKEND}/signup`,{
          email,
          password,
          name
        })
        return response;
  }

  const signin=async(email:string,password:string)=>{
    const response=await axios.post(`${HTTP_BACKEND}/signin`,{
      email,
      password
    })

    return response;
}

  const handleSubmit = () => {
    const email = emailRef.current?.value;
    const password = passRef.current?.value;
    const name=nameRef.current?.value;

    if (email && password) {
      let res;
      if (!isSignin && name) {
        res=signup(email,password,name);
      } else {
        res=signin(email,password)
      }
      console.log(res);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black opacity-85">
      <div className="p-6 bg-primary rounded">
        <div className="p-2">
          <input
            ref={emailRef}
            type="text"
            className="p-2"
            placeholder="Email"
          ></input>
        </div>
        <div className="p-2">
          <input
            ref={passRef}
            type="text"
            className="p-2"
            placeholder="Password"
          ></input>
        </div>

        {!isSignin && (<div className="p-2"><input
            ref={nameRef}
            type="text"
            className="p-2"
            placeholder="Name"
          ></input></div>
        )}

        <div className="pt-2 flex justify-center items-center">
          <button
            className="bg-black rounded p-2 text-white"
            onClick={() => {
              handleSubmit
            }}
          >
            {isSignin ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
