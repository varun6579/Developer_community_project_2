function Challenges() {
  const challenges = [
    { title: "Build Todo App", level: "Easy" },
    { title: "REST API with Node", level: "Medium" },
    { title: "Full Stack App", level: "Hard" }
  ];

  return (
    <div className="container mt-4">
      <h2>🏆 Challenges</h2>

      {challenges.map((c, i) => (
        <div key={i} className="card p-3 my-2">
          <h5>{c.title}</h5>
          <p>Level: {c.level}</p>
        </div>
      ))}
    </div>
  );
}

export default Challenges;