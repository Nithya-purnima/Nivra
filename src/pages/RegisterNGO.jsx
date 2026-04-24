  import { useState } from "react";
  import { toast } from "react-toastify";
  import api from "../api/api";
  import { validatePassword, validatePhone, validateEmail } from "../utils/validation";

  export default function RegisterNGO() {
    const [form, setForm] = useState({ orgName: "", email: "", phone: "", address: "", password: "", certificate: null });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ password: "", phone: "", email: "" });

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === "certificate") {
        setForm(prev => ({ ...prev, certificate: files[0] || null }));
        return;
      }
      setForm(prev => ({ ...prev, [name]: value }));
      switch (name) {
        case "password": setErrors(prev => ({ ...prev, password: validatePassword(value) })); break;
        case "phone":    setErrors(prev => ({ ...prev, phone: validatePhone(value) })); break;
        case "email":    setErrors(prev => ({ ...prev, email: validateEmail(value) })); break;
        default: break;
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = {
        password: validatePassword(form.password),
        phone: validatePhone(form.phone),
        email: validateEmail(form.email)
      };
      setErrors(validationErrors);
      if (Object.values(validationErrors).some(v => v !== "")) return;

      try {
        const data = new FormData();
        data.append("orgName", form.orgName);   // ✅ matches backend @RequestParam("orgName")
        data.append("email", form.email);
        data.append("phone", form.phone);
        data.append("address", form.address);
        data.append("password", form.password);
        if (form.certificate) data.append("certificate", form.certificate);

        // ✅ POST to /api/register/ngo — let axios set Content-Type automatically (with boundary)
        await api.post("/register/ngo", data);
        toast.success("NGO registered successfully! Please wait for admin verification.");
        setForm({ orgName: "", email: "", phone: "", address: "", password: "", certificate: null });
      } catch (err) {
        toast.error(err.response?.data?.message || err.response?.data || "Registration failed.");
      }
    };

    const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 64px)", padding: "2rem" };
    const formStyle = { width: "100%", maxWidth: "550px", padding: "2rem", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" };

    return (
      <div style={containerStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <h2 style={{ marginBottom: "2rem", color: "#333", textAlign: "center", fontSize: "1.75rem" }}>NGO Registration</h2>

          <div className="mb-3">
            <input type="text" name="orgName" placeholder="Organization Name" onChange={handleChange} value={form.orgName} className="form-control" required />
          </div>
          <div className="mb-3">
            <input type="email" name="email" placeholder="Email" onChange={handleChange} value={form.email} className={`form-control ${errors.email ? "is-invalid" : ""}`} required />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3" style={{ position: "relative" }}>
            <input type={showPassword ? "text" : "password"} name="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} placeholder="Password" onChange={handleChange} value={form.password} required />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#666",
                fontSize: "18px"
              }}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            <small className="form-text text-muted">Min 8 chars, uppercase, lowercase, number, special char (@$!%*?&)</small>
          </div>
          <div className="mb-3">
            <input type="text" name="phone" placeholder="Phone (10 digits)" onChange={handleChange} value={form.phone} className={`form-control ${errors.phone ? "is-invalid" : ""}`} required />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
          <div className="mb-3">
            <input type="text" name="address" placeholder="Address" onChange={handleChange} value={form.address} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Verification Certificate <span className="text-danger">*</span></label>
            <input type="file" name="certificate" onChange={handleChange} className="form-control" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" required />
            <small className="form-text text-muted">Accepted: PDF, DOC, DOCX, JPG, JPEG, PNG</small>
          </div>

          <button type="submit" className="btn btn-primary w-100"
            disabled={Object.values(errors).some(v => v !== "")}
            style={{ padding: "12px", fontSize: "1rem", borderRadius: "8px", backgroundColor: "#008080", border: "none", marginTop: "1rem" }}>
            Register
          </button>
        </form>
      </div>
    );
  }
