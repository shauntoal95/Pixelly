import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {

  const [page, setPage] = useState("home");
  const [studios, setStudios] = useState([]);
  const [selectedStudio, setSelectedStudio] = useState(null);

  const [search, setSearch] = useState({
    location: "",
    shootType: "All"
  });

  const [signupForm, setSignupForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    password: "",
    city: "",
    postcode: ""
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    shootType: "Residential",
    date: "",
    notes: ""
  });

  const [bookingMessage, setBookingMessage] = useState("");
  const [message, setMessage] = useState("");
  const [ownerData, setOwnerData] = useState(null);

  /* ---------------- LOAD STUDIOS ---------------- */

  useEffect(() => {
    fetch(`${API_URL}/api/studios`)
      .then(res => res.json())
      .then(data => setStudios(data))
      .catch(err => console.error("Studio load error:", err));
  }, []);

  /* ---------------- OWNER AUTO LOGIN ---------------- */

  useEffect(() => {

    const role = localStorage.getItem("pixelly_role");

    if (role === "business_owner") {

      setPage("owner");

      const loadBookings = () => {

        fetch(`${API_URL}/api/bookings`)
          .then(res => res.json())
          .then(data => {

            const formatted = data.map(b => ({
              id: b.id,
              client: b.name,
              category: b.shootType,
              requested: b.date,
              status: b.status
            }));

            setOwnerData({
              fullName: localStorage.getItem("pixelly_full_name") || "Studio Owner",
              notifications: formatted,
              trialDaysRemaining: 14
            });

          })
          .catch(err => console.error(err));

      };

      loadBookings();

      const interval = setInterval(loadBookings, 5000);

      return () => clearInterval(interval);

    }

  }, []);

  /* ---------------- INPUT HANDLERS ---------------- */

  const onSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const onLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const onSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  /* ---------------- SIGNUP ---------------- */

  const handleSignup = async (e) => {

    e.preventDefault();
    setMessage("Creating your Pixelly account...");

    try {

      const res = await fetch(`${API_URL}/api/auth/signup/business`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signupForm)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Signup failed");
        return;
      }

      setMessage(
        `Success. Your trial ends ${new Date(data.trialEnds).toLocaleDateString()}`
      );

      setPage("login");

    } catch {
      setMessage("Server error during signup.");
    }

  };

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async (e) => {

    e.preventDefault();
    setMessage("Logging you in...");

    try {

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginForm)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      localStorage.setItem("pixelly_token", data.token);
      localStorage.setItem("pixelly_role", data.role);
      localStorage.setItem("pixelly_full_name", data.fullName || "");

      setPage("owner");

    } catch {
      setMessage("Login server error.");
    }

  };

  const logout = () => {
    localStorage.clear();
    setOwnerData(null);
    setPage("home");
  };

  /* ---------------- OWNER DASHBOARD ---------------- */

  if (page === "owner" && ownerData) {

    return (
      <div style={pageStyle}>

        <TopNav onGoHome={() => setPage("home")} />

        <main style={containerStyle}>

          <h1>Welcome back, {ownerData.fullName}</h1>

          {ownerData.notifications.map((item) => (

            <div key={item.id} style={cardStyle}>
              <strong>{item.client}</strong>
              <div>{item.category}</div>
              <div>{item.requested}</div>
            </div>

          ))}

          <button onClick={logout} style={primaryButton}>
            Logout
          </button>

        </main>

      </div>
    );

  }

  /* ---------------- SIGNUP PAGE ---------------- */

  if (page === "signup") {

    return (
      <div style={pageStyle}>

        <TopNav onGoHome={() => setPage("home")} />

        <main style={containerStyle}>

          <h1>Create your Pixelly studio</h1>

          <form onSubmit={handleSignup} style={formGrid}>

            <input name="businessName" placeholder="Business name" onChange={onSignupChange} style={inputStyle} />
            <input name="ownerName" placeholder="Your name" onChange={onSignupChange} style={inputStyle} />
            <input name="email" placeholder="Email" onChange={onSignupChange} style={inputStyle} />
            <input name="password" type="password" placeholder="Password" onChange={onSignupChange} style={inputStyle} />
            <input name="city" placeholder="City" onChange={onSignupChange} style={inputStyle} />
            <input name="postcode" placeholder="Postcode" onChange={onSignupChange} style={inputStyle} />

            <button style={primaryButton}>Start free trial</button>

          </form>

          {message && <div style={{ marginTop: 20 }}>{message}</div>}

        </main>

      </div>
    );

  }

  /* ---------------- LOGIN PAGE ---------------- */

  if (page === "login") {

    return (
      <div style={pageStyle}>

        <TopNav onGoHome={() => setPage("home")} />

        <main style={containerStyle}>

          <h1>Studio login</h1>

          <form onSubmit={handleLogin} style={formGrid}>

            <input name="email" placeholder="Email" onChange={onLoginChange} style={inputStyle} />
            <input name="password" type="password" placeholder="Password" onChange={onLoginChange} style={inputStyle} />

            <button style={primaryButton}>Login</button>

          </form>

          {message && <div style={{ marginTop: 20 }}>{message}</div>}

        </main>

      </div>
    );

  }

  /* ---------------- SEARCH PAGE ---------------- */

  if (page === "search") {

    return (
      <div style={pageStyle}>

        <TopNav onGoHome={() => setPage("home")} />

        <main style={containerStyle}>

          <h1>Studios near {search.location || "your area"}</h1>

          <div style={gridStyle}>

            {studios.map(studio => (

              <div key={studio.id} style={cardStyle}>

                <h3>{studio.business_name}</h3>

                <button
                  style={primaryButton}
                  onClick={() => {
                    setSelectedStudio(studio);
                    setPage("studio");
                  }}
                >
                  View studio
                </button>

              </div>

            ))}

          </div>

        </main>

      </div>
    );

  }

  /* ---------------- STUDIO PAGE ---------------- */

  if (page === "studio" && selectedStudio) {

    return (
      <div style={pageStyle}>

        <TopNav onGoHome={() => setPage("home")} />

        <main style={containerStyle}>

          <h1>{selectedStudio.business_name}</h1>

          <h3>Request a booking</h3>

          <input
            placeholder="Your name"
            style={inputStyle}
            value={bookingForm.name}
            onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
          />

          <input
            placeholder="Email"
            style={inputStyle}
            value={bookingForm.email}
            onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })}
          />

          <button style={primaryButton}>
            Send booking request
          </button>

          {bookingMessage && <div>{bookingMessage}</div>}

        </main>

      </div>
    );

  }

  /* ---------------- HOME ---------------- */

  return (
    <div style={pageStyle}>

      <TopNav onGoHome={() => setPage("home")} />

      <main style={containerStyle}>

        <h1>Find photographers and creative professionals</h1>

        <input
          name="location"
          placeholder="Enter location or postcode"
          onChange={onSearchChange}
          style={inputStyle}
        />

        <button style={primaryButton} onClick={() => setPage("search")}>
          Search
        </button>

      </main>

    </div>
  );

}

/* ---------------- NAV ---------------- */

function TopNav({ onGoHome }) {

  return (
    <header style={{ padding: 24 }}>
      <button onClick={onGoHome} style={{ fontSize: 22 }}>
        Pixelly
      </button>
    </header>
  );

}

/* ---------------- STYLES ---------------- */

const pageStyle = {
  minHeight: "100vh",
  background: "#f6f1ea",
  fontFamily: "Inter, Arial"
};

const containerStyle = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: 40
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 20
};

const cardStyle = {
  background: "white",
  padding: 24,
  borderRadius: 16
};

const inputStyle = {
  width: "100%",
  padding: 16,
  marginBottom: 12,
  borderRadius: 10,
  border: "1px solid #ddd"
};

const primaryButton = {
  padding: 16,
  background: "#14213d",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer"
};

const formGrid = {
  display: "grid",
  gap: 12
};
