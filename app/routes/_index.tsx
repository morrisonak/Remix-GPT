import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api.js";
//import { useUser } from "@clerk/clerk-react";
//import { faker } from "@faker-js/faker";
import { redirect } from "@remix-run/node";
//import type { LoaderFunction } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { createClerkClient } from '@clerk/remix/api.server';
import { useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Remix GPT Chat" },
    { name: "description", content: "Welcome To my app!" },
  ];
};export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  console.log(userId);
 
  if (!userId) {
    return redirect("/landing");
  }
 
  const user = await createClerkClient({secretKey: process.env.CLERK_SECRET_KEY}).users.getUser(userId);
  return { serialisedUser: JSON.stringify(user) };
};





export default function Index() {
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);
  const [newMessageText, setNewMessageText] = useState("");
  //const { isSignedIn, user } = useUser();
  //const NAME = faker.name.firstName();
  const { serialisedUser } = useLoaderData();
const user = JSON.parse(serialisedUser);
const NAME = user ? `${user.firstName} ${user.lastName} ` : "Unknown";


  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [messages]);


  return (
    <div className="container flex flex-col gap-8 p-6 mx-auto text-white rounded-lg shadow-lg" 
    style={{background: 'radial-gradient(circle, rgba(58, 58, 70, 1) 0%, rgba(0, 0, 10, 1) 100%)'}}
  >
  
    <h1 className="text-4xl font-bold text-center text-white">Remix GPT Chat</h1>
    <h2 className="text-xl font-semibold text-center text-gray-300">Use @gpt to call the LLM.</h2>
    <h2 className="text-xl font-semibold text-center text-gray-300">@memory to save a memory</h2>
    <h2 className="text-xl font-semibold text-center text-gray-300">@recall to display stored memories.</h2>
    <p className="text-center text-gray-400">
      Connected as <strong className="font-semibold text-white"> {NAME} </strong>
    </p>
    
    <div className="flex flex-col gap-4">
      {messages?.map((message) => (
        <article
          key={message._id}
          className={`p-4 border border-gray-700 rounded bg-opacity-90 ${message.author === NAME ? 'bg-gray-800' : 'bg-gray-700'}`}
        >
          <div className="font-semibold text-gray-300">{message.author}</div>
          <p className="text-lg text-gray-300">{message.body}</p>
        </article>
      ))}
    </div>
    
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await sendMessage({ body: newMessageText, author: NAME });
        setNewMessageText("");
      }}
      className="flex items-center gap-4"
    >
      <input
        value={newMessageText}
        onChange={(e) => setNewMessageText(e.target.value)}
        placeholder="Write a message…"
        className="flex-1 p-2 text-white bg-gray-800 border border-gray-700 rounded"
      />
      <button
        type="submit"
        disabled={!newMessageText}
        className={`py-2 px-4 bg-blue-600 text-white rounded ${!newMessageText ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Send
      </button>
    </form>
  </div>
  );
}
