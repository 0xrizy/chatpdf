import React, { useState } from "react";

const Chatbox = ({ textContent }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [conversation, setConversation] = useState([
    {
      role: "system",
      content: "Hey, do you have any questions about the PDF?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = { role: "user", content: inputMessage };

    // Update the conversation state by merging the new user message
    setConversation((prevConversation) => [...prevConversation, userMessage]);

    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textContent, userMessage: inputMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);

        const assistantMessage = { role: "assistant", content: data.answer };

        // Update the conversation state by merging the new assistant message
        setConversation((prevConversation) => [
          ...prevConversation,
          assistantMessage,
        ]);
      } else {
        console.error("Error:", response.status, response.statusText);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbox">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        CHAT WITH{"    "}
        <span className="text-blue-600 dark:text-blue-500">PDF</span>
      </h1>

      <div className="conversation bg-gray-100 p-4 rounded-lg shadow-md text-lg font-semibold text-white">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`message p-3 mb-2 rounded-lg ${
              message.role === "user" ? "bg-green-500 text-white" : "bg-blue-400"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="message bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-blue-500 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.086 5.842 2.882 8.037l3.12-3.746z"
                ></path>
              </svg>
              <span>Loading...</span>
            </div>
          </div>
        )}
      </div>
      <div className="input mt-4 flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-50"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
