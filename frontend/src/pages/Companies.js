function Companies() {
  const companies = ["Google", "Microsoft", "Amazon", "Infosys"];

  return (
    <div className="container mt-4">
      <h2>🏢 Companies</h2>

      <ul className="list-group mt-3">
        {companies.map((c, i) => (
          <li key={i} className="list-group-item">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Companies;