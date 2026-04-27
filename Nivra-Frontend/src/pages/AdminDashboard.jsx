import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // ✅ fetch pending users
  const fetchPending = async () => {
    try {
      const res = await api.get("/users/admin/pending");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching users");
    }
  };

  // 🔐 protect route (no admin = redirect)
  useEffect(() => {
    const admin = localStorage.getItem("admin");

    if (!admin) {
      navigate("/admin/login");
      return;
    }

    fetchPending();
  }, []);

  // ✅ approve user
  const handleApprove = async (id) => {
    try {
      await api.put(`/users/admin/approve/${id}`);
      toast.success("Approved!");
      fetchPending();
    } catch (err) {
      toast.error("Error approving user");
    }
  };

  // ❌ reject user
  const handleReject = async (id) => {
    try {
      await api.delete(`/users/admin/reject/${id}`);
      toast.success("Rejected!");
      fetchPending();
    } catch (err) {
      toast.error("Error rejecting user");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <p>Pending Buyer & NGO Approvals</p>

      {users.length === 0 ? (
        <p>No pending users</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>

              {/* ✅ ADD THIS */}
              <th>Certificate</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.buyerType || u.role}</td>
                <td>
  {u.incomeCertificate || u.ngoCertificate ? (
    <a
      href={`http://localhost:8080/files/${u.incomeCertificate || u.ngoCertificate}`}
      target="_blank"
      rel="noreferrer"
    >
      View Certificate
    </a>
  ) : (
    "No Certificate"
  )}
</td> 

                <td>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleApprove(u.id)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(u.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}