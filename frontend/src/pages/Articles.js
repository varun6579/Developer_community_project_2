function Articles() {
  const articles = [
    { title: "How to Learn React", author: "John" },
    { title: "Node.js Best Practices", author: "Doe" }
  ];

  return (
    <div className="container mt-4">
      <h2>📰 Articles</h2>

      {articles.map((a, i) => (
        <div key={i} className="card p-3 my-2">
          <h5>{a.title}</h5>
          <p>By {a.author}</p>
        </div>
      ))}
    </div>
  );
}

export default Articles;