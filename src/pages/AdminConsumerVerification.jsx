import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminConsumerVerification() {
  const [consumers, setConsumers] = useState([]);

  useEffect(() => {
    api.get("/admin/consumers/pending").then(res => setConsumers(res.data));
  }, []);

  const handleAction = async (id, action) => {
    await api.put(`/admin/consumer/${id}?action=${action}`);
    setConsumers(consumers.filter(c => c.id !== id));
  };

  return (
    <div className="container mt-5">
      <h2>Pending Consumer Certificates</h2>
      {consumers.map(c => (
        <div key={c.id} className="border p-3 mb-3">
          <p>Name: {c.name}</p>
          <p>Email: {c.email}</p>
          <p>
            Certificate: <a 
  href={`http://localhost:8080/uploads/${c.certificatePath}`} 
  target="_blank" 
  rel="noopener noreferrer"
>
  View
</a>

          </p>
          <button className="btn btn-success me-2" onClick={() => handleAction(c.id, "approve")}>Approve</button>
          <button className="btn btn-danger" onClick={() => handleAction(c.id, "reject")}>Reject</button>
        </div>
      ))}
    </div>
  );
}
