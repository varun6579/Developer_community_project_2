function Tags() {
  const tags = ["React", "JavaScript", "Node.js", "MongoDB", "CSS"];

  return (
    <div className="container mt-4">
      <h2>🏷 Tags</h2>

      <div className="mt-3">
        {tags.map((tag, index) => (
          <span key={index} className="badge bg-primary me-2 p-2">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Tags;