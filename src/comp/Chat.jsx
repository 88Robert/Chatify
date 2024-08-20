import { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../ContextProvider/ContextProvider";
import "../styles/Chat.css";

const Chat = () => {
  const {
    username,
    avatarUrl,
    setMessages,
    fetchMessages,
    sendMessage,
    deleteMessage,
    messages,
    decodedToken,
    users,
    sendInvitation,
    switchConversation,
    conversations,
    currentConversationId,
  } = useContext(Context);
  const [messageContent, setMessageContent] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    // Fetch messages when the current conversation changes
    if (currentConversationId) {
      switchConversation(currentConversationId);
    }
  }, [currentConversationId]);

  const handleSendMessage = async () => {
    if (messageContent.trim()) {
      const result = await sendMessage(messageContent);
      if (result.success) {
        setMessages([...messages, result.latestMessage]);
        setMessageContent("");
        setError("");
      } else {
        setError(result.errors.message || "Failed to send message.");
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const handleDeleteMessage = async (msgId) => {
    const result = await deleteMessage(msgId);
    if (!result.success) {
      setError(result.errors.message || "Failed to delete message.");
    }
  };

  const handleInvite = (userId) => {
    sendInvitation(userId);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Welcome to chat {username}!</h2>
      </div>
      <div className="conversation-switcher">
        <label htmlFor="conversations">Select a conversation:</label>
        <select
          id="conversations"
          onChange={(e) => switchConversation(e.target.value)}
          value={currentConversationId}
        >
          {conversations.map((conversation) => (
            <option
              key={conversation.conversationId}
              value={conversation.conversationId}
            >
              {conversation.username}
            </option>
          ))}
        </select>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              username === username ? "message-right" : "message-left"
            }`}
          >
            <img
              src={decodedToken.avatar || avatarUrl}
              alt="avatar"
              className="message-avatar"
            />
            <div className="message-content">
              <strong className="message-username">{username}</strong>
              <div className="message-bubble">
                <p>{message.text}</p>
                {username === username && (
                  <span
                    onClick={() => handleDeleteMessage(message.id)}
                    className="delete-icon"
                    title="Delete message"
                  >
                    &times;
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          className="input-field"
          type="text"
          placeholder="Type a message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="users-container">
        <h3>Users</h3>
        <input
          className="user-search"
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <img src={user.avatar} alt="avatar" className="user-avatar" />
              <span>{user.username}</span>
              <button
                className="invite-button"
                onClick={() => handleInvite(user.userId)}
              >
                Invite
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;

{
  /* <img
            src={message.avatar || avatarUrl}
            alt="avatar"
            className="message-avatar"
           useEffect(() => {
    if (decodedToken) {
      setPic(decodedToken.avatar || "default-avatar-url.png"); 
    }
  }, [decodedToken]);
         
         
            /> */
}
