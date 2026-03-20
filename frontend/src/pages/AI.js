import { useState } from "react";

function AI() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = () => {
    // later connect to backend / OpenAI
    setResponse("AI response will appear here...");
  };

  return (
    <div className="container mt-4">
      <h2>🤖 AI Assistant</h2>

      <textarea
        className="form-control my-3"
        rows="4"
        placeholder="Ask coding doubts..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleAsk}>
        Ask AI
      </button>

      {response && (
        <div className="alert alert-info mt-3">
          {response}
        </div>
      )}
    </div>
  );
}

export default AI;