import React, { useState } from 'react';

const Chatbox = ({ textContent }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [conversation, setConversation] = useState([
    { role: 'system', content: 'Hey, do you have any questions about the PDF?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (inputMessage.trim() === '') return;

    setConversation([...conversation, { role: 'user', content: inputMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textContent, userMessage: inputMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        setConversation([...conversation, { role: 'assistant', content: data.answer }]);
      } else {
        console.error('Error:', response.status, response.statusText);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbox">
      <div className="conversation">
        {conversation.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-blue-500 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
      <div className="input">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
};

export default Chatbox;
