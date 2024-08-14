import { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../ContextProvider/ContextProvider";
import '../styles/Chat.css';

const Chat = () => {
  const { username, decodedToken } = useContext(Context);
  const [pic, setPic] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
 
 
  useEffect(() => {
    if (decodedToken) {
      setPic(decodedToken.avatar || "default-avatar-url.png"); 
    }
  }, [decodedToken]);

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      setMessages([...messages, { text: currentMessage, sender: username, avatar: pic }]);
      setCurrentMessage(""); // Clear the input field
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <div className="chat-container">
    <div className="chat-header">
      <h2>Welcome, {username} to Chatify!</h2>
    </div>

    {/* Messages Display */}
    <div className="messages-container">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${
            message.sender === username ? "message-right" : "message-left"
          }`}
        >
          {message.sender !== username && (
            <img
              src={message.avatar}
              alt={`${message.sender}'s avatar`}
              className="message-avatar"
              style={{ marginRight: "10px" }}
            />
          )}
          <div className="message-bubble">
            <strong>{message.sender}</strong>
            <p style={{ margin: "5px 0" }}>{message.text}</p>
          </div>
          {message.sender === username && (
            <img
              src={message.avatar}
              alt={`${message.sender}'s avatar`}
              className="message-avatar"
              style={{ marginLeft: "10px" }}
            />
          )}
        </div>
      ))}
    </div>

    {/* Chat Input and Send Button */}
    <div className="input-container">
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        placeholder="Type your message here..."
        className="input-field"
      />
      <button onClick={handleSendMessage} className="send-button">
        Send
      </button>
    </div>
  </div>
);
};
    
export default Chat;
