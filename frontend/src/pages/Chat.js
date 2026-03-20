import { useState } from "react";

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if (!message) return;
    setChat([...chat, message]);
    setMessage("");
  };

  return (
    <div className="container mt-4">
      <h2>💬 Chat</h2>

      <div className="border p-3 mb-3" style={{ height: "300px", overflowY: "scroll" }}>
        {chat.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      <input
        className="form-control"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />

      <button className="btn btn-success mt-2" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}

export default Chat;