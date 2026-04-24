import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import { validatePassword, validatePhone, validateEmail } from "../utils/validation";

export default function RegisterConsumer() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    address: "", 
    password: "", 
    certificate: null 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    phone: "",
    email: ""
  });

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 64px)',
    padding: '2rem'
  };

  const formStyle = {
    width: '100%',
    maxWidth: '550px',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '0 auto'
  };

  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === "certificate") {
      if (files && files[0]) {
        const file = files[0];
        const allowedTypes = ["image/jpeg", "image/png"];

        if (!allowedTypes.includes(file.type)) {
          toast.error("Only JPG or PNG files are allowed for certificate");
          e.target.value = "";
          return;
        }

        setForm(prev => ({ ...prev, certificate: file }));
      }
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));

    // Validation
    switch (name) {
      case "password":
        setErrors(prev => ({ ...prev, password: validatePassword(value) }));
        break;
      case "phone":
        setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
        break;
      case "email":
        setErrors(prev => ({ ...prev, email: validateEmail(value) }));
        break;
      default:
        break;
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

    if (Object.values(validationErrors).some(error => error !== "")) return;

    if (!form.certificate) {
      toast.error("Please upload a certificate (JPG or PNG).");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("phone", form.phone);
    data.append("address", form.address);
    data.append("password", form.password);
    data.append("certificate", form.certificate);

    try {
      // ✅ FIXED: removed manual headers
      await api.post("/register/consumer", data);

      toast.success("Consumer registered successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        certificate: null
      });

    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);

      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ marginBottom: '2rem', color: '#333', textAlign: 'center' }}>
          Consumer Registration
        </h2>

        <div className="mb-4">
          <input 
            type="text" 
            name="name" 
            className="form-control" 
            placeholder="Name" 
            value={form.name}
            onChange={handleChange} 
            required
          />
        </div>

        <div className="mb-4">
          <input 
            type="email" 
            name="email" 
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="Email" 
            value={form.email}
            onChange={handleChange} 
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-4" style={{ position: "relative" }}>
          <input 
            type={showPassword ? "text" : "password"}
            name="password" 
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Password" 
            value={form.password}
            onChange={handleChange} 
            required
          />
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
        </div>

        <div className="mb-3">
          <input 
            type="text" 
            name="phone" 
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            placeholder="Phone (10 digits)" 
            value={form.phone}
            onChange={handleChange} 
            required
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        <div className="mb-3">
          <input 
            type="text" 
            name="address" 
            className="form-control" 
            placeholder="Address" 
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Income Certificate</label>
          <input 
            type="file" 
            name="certificate" 
            className="form-control" 
            onChange={handleChange} 
            accept=".jpg,.jpeg,.png"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={Object.values(errors).some(error => error !== "")}
        >
          Register
        </button>
      </form>
    </div>
  );
}