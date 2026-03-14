import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    password: ""
  });
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("Creating your Pixelly account...");

    try {
      const res = await fetch(`${API_URL}/api/auth/signup/business`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Signup failed");
        return;
      }

      setMessage(`Success. Your 14-day trial is active until ${new Date(data.trialEnds).toLocaleDateString()}.`);
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging you in...");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(login)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      localStorage.setItem("pixelly_token", data.token);
      localStorage.setItem("pixelly_role", data.role);

      if (data.role === "business_owner") {
        setMessage("Login successful. Owner dashboard is next.");
      } else if (data.role === "team_member") {
        setMessage("Login successful. Team dashboard is next.");
      } else if (data.role === "platform_owner") {
        setMessage("Login successful. Admin dashboard is next.");
      } else {
        setMessage("Login successful.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f2ec", color: "#14213d", fontFamily: "Inter, Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#14213d",
            color: "white",
            display: "grid",
            placeItems: "center",
            fontWeight: 700
          }}>
            P
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>Pixelly</div>
            <div style={{ color: "#5f6b7a" }}>Marketplace + studio operations</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setMode("signup")} style={tabStyle(mode === "signup")}>Business signup</button>
          <button onClick={() => setMode("login")} style={tabStyle(mode === "login")}>Studio login</button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px 60px" }}>
        <section style={{
          background: "#24324b",
          color: "white",
          borderRadius: 28,
          padding: 36,
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 28
        }}>
          <div>
            <div style={{ letterSpacing: 2, fontSize: 12, marginBottom: 18, opacity: 0.85 }}>
              RUN YOUR MEDIA BUSINESS IN ONE PLACE
            </div>
            <h1 style={{ fontSize: 64, lineHeight: 1.02, margin: "0 0 18px", fontWeight: 800 }}>
              Sign up to Pixelly and start your 14-day free trial.
            </h1>
            <p style={{ fontSize: 20, lineHeight: 1.5, opacity: 0.92 }}>
              Manage bookings, team calendars, jobs, blocked time, and studio operations from one platform.
            </p>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 24
          }}>
            {mode === "signup" ? (
              <form onSubmit={handleSignup} style={{ display: "grid", gap: 14 }}>
                <h2 style={{ margin: 0 }}>Create your business account</h2>
                <input name="businessName" placeholder="Business name" value={form.businessName} onChange={onChange} style={inputStyle} />
                <input name="ownerName" placeholder="Owner name" value={form.ownerName} onChange={onChange} style={inputStyle} />
                <input name="email" type="email" placeholder="Email address" value={form.email} onChange={onChange} style={inputStyle} />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} style={inputStyle} />
                <button type="submit" style={primaryButton}>Start free trial</button>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
                  £49/month for the owner account after trial. Add team members later for £10/month each.
                </p>
              </form>
            ) : (
              <form onSubmit={handleLogin} style={{ display: "grid", gap: 14 }}>
                <h2 style={{ margin: 0 }}>Studio login</h2>
                <input name="email" type="email" placeholder="Email address" value={login.email} onChange={onLoginChange} style={inputStyle} />
                <input name="password" type="password" placeholder="Password" value={login.password} onChange={onLoginChange} style={inputStyle} />
                <button type="submit" style={primaryButton}>Log in</button>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
                  Business owners, team members and platform admin will be routed to the correct dashboard next.
                </p>
              </form>
            )}
          </div>
        </section>

        {message && (
          <div style={{
            marginTop: 24,
            background: "white",
            border: "1px solid #d9d4ca",
            borderRadius: 18,
            padding: 18,
            fontSize: 16
          }}>
            {message}
          </div>
        )}
      </main>
    </div>
  );
}

function tabStyle(active) {
  return {
    background: active ? "#14213d" : "white",
    color: active ? "white" : "#14213d",
    border: "1px solid #d9d4ca",
    padding: "12px 18px",
    borderRadius: 16,
    cursor: "pointer",
    fontWeight: 600
  };
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #d9d4ca",
  fontSize: 16
};

const primaryButton = {
  background: "#14213d",
  color: "white",
  border: "none",
  padding: "14px 18px",
  borderRadius: 16,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer"
};
