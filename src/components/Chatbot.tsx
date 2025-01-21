


import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../shadcn-ui/button";
import { Input } from "../shadcn-ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../shadcn-ui/card";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  created_at: string;
  session_id: string;
};

type UserData = {
  name?: string;
  age?: string;
  phone?: string;
  email?: string;
  address?: string;
  session_id: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [conversationStep, setConversationStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    session_id: "", // Always ensure session_id is set
  });
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const storedSessionId = localStorage.getItem("chatbot_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
      setUserData((prev) => ({ ...prev, session_id: storedSessionId }));
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem("chatbot_session_id", newSessionId);
      setSessionId(newSessionId);
      setUserData((prev) => ({ ...prev, session_id: newSessionId }));
    }

    const initialMessage: Message = {
      id: 1,
      sender: "bot",
      text: "Hello! My name is SK-Gen, welcome to SK-Homes. What is your name?",
      created_at: new Date().toISOString(),
      session_id: sessionId,
    };
    setMessages([initialMessage]);
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue,
      created_at: new Date().toISOString(),
      session_id: sessionId,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const botResponse = getBotResponse(inputValue);

    if (botResponse) {
      const botMessage: Message = {
        id: userMessage.id + 1,
        sender: "bot",
        text: botResponse,
        created_at: new Date().toISOString(),
        session_id: sessionId,
      };
      setMessages((prev) => [...prev, botMessage]);

      await storeMessage(userMessage);
      await storeMessage(botMessage);
    }
  };

  const getBotResponse = (userInput: string): string | null => {
    let response = "";

    switch (conversationStep) {
      case 0:
        setUserData((prev) => ({ ...prev, name: userInput }));
        response = "Great! How old are you?";
        setConversationStep(1);
        break;
      case 1:
        setUserData((prev) => ({ ...prev, age: userInput }));
        response = "Thanks! What is your phone number?";
        setConversationStep(2);
        break;
      case 2:
        setUserData((prev) => ({ ...prev, phone: userInput }));
        response = "What is your email address?";
        setConversationStep(3);
        break;
      case 3:
        setUserData((prev) => ({ ...prev, email: userInput }));
        response = "Where do you reside? Please provide your address.";
        setConversationStep(4);
        break;
      case 4:
        setUserData((prev) => ({ ...prev, address: userInput }));
        response = `Thank you, ${userData.name}! Your information has been recorded.`;

        // Storing updated user data once all fields are filled
        storeUserData({ ...userData, address: userInput });
        setConversationStep(5);
        break;
      default:
        response = "I am here to help. How can I assist you further?";
    }

    return response;
  };

  const storeMessage = async (message: Message) => {
    try {
      await axios.post("http://localhost:5000/api/messages", message);
    } catch (error) {
      console.error("Error storing message:", error);
    }
  };

  // Logging user data before sending it
  const storeUserData = async (userData: UserData) => {
    // Log userData to check if data is ready
    console.log("Sending user data:", userData);

  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Chatbot</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-lg ${
                  message.sender === "user" ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button className="bg-purple-700 hover:bg-purple-500" onClick={handleSendMessage}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
