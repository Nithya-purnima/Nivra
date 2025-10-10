import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminNGOVerification() {
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    api.get("/admin/ngos/pending").then(res => setNgos(res.data));
  }, []);

  const handleAction = async (id, action) => {
    await api.put(`/admin/ngo/${id}?action=${action}`);
    setNgos(ngos.filter(n => n.id !== id));
  };

  return (
    <div className="container mt-5">
      <h2>Pending NGO Certificates</h2>
      {ngos.map(n => (
        <div key={n.id} className="border p-3 mb-3">
          <p>Organization: {n.orgName}</p>
          <p>Email: {n.email}</p>
          <p>
            Certificate: <a 
  href={`http://localhost:8080/uploads/${n.certificatePath}`} 
  target="_blank" 
  rel="noopener noreferrer"
>
  View
</a>

          </p>
          <button className="btn btn-success me-2" onClick={() => handleAction(n.id, "approve")}>Approve</button>
          <button className="btn btn-danger" onClick={() => handleAction(n.id, "reject")}>Reject</button>
        </div>
      ))}
    </div>
  );
}
