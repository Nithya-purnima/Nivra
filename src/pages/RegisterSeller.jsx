import { useState } from "react";
import api from "../api/api";
import { validatePassword, validatePhone, validateEmail } from "../utils/validation";

export default function RegisterSeller() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Validate fields on change
    switch(name) {
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

    // Validate all fields before submission
    const validationErrors = {
      password: validatePassword(form.password),
      phone: validatePhone(form.phone),
      email: validateEmail(form.email)
    };

    setErrors(validationErrors);

    // Check if there are any validation errors
    if (Object.values(validationErrors).some(error => error !== "")) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);

      await api.post("/register/seller", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Seller registered successfully!");
      setForm({ name: "", email: "", phone: "", password: "" });
    } catch (err) {
      alert(err.response?.data || "Registration failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ marginBottom: '2rem', color: '#333', textAlign: 'center', fontSize: '1.75rem' }}>
          Seller Registration
        </h2>
        <div className="mb-3">
          <input
            type="text"
            name="name"
            value={form.name}
            className="form-control"
            placeholder="Name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            value={form.email}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            value={form.password}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          <small className="form-text text-muted">
            Password must contain at least 8 characters, one uppercase letter, one lowercase letter, 
            one number, and one special character (@$!%*?&)
          </small>
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="phone"
            value={form.phone}
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            placeholder="Phone (10 digits)"
            onChange={handleChange}
            required
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={Object.values(errors).some(error => error !== "")}
          style={{
            padding: '12px',
            fontSize: '1rem',
            borderRadius: '8px',
            backgroundColor: '#008080',
            border: 'none',
            marginTop: '1rem',
            transition: 'background-color 0.2s ease'
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}


