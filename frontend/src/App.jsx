import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedStudio, setSelectedStudio] = useState(null);
const [studios, setStudios] = useState([]);
  const [bookingForm, setBookingForm] = useState({
  name: "",
  email: "",
  phone: "",
  shootType: "Residential",
  date: "",
  notes: ""
});


const [bookingMessage, setBookingMessage] = useState("");

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
  const [message, setMessage] = useState("");
  const [ownerData, setOwnerData] = useState(null);

  useEffect(() => {
  fetch(`${API_URL}/api/studios`)
    .then(res => res.json())
    .then(data => setStudios(data))
    .catch(err => console.error("Failed to load studios:", err));
}, []);

/* EXISTING OWNER LOGIN CHECK */
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
        });
    };

    loadBookings();

    const interval = setInterval(loadBookings, 5000);

    return () => clearInterval(interval);
  }
}, []);

  
  const onSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const onLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const onSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
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
        body: JSON.stringify(signupForm)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Signup failed");
        return;
      }

      setMessage(
        `Success. Your 14-day trial is active until ${new Date(
          data.trialEnds
        ).toLocaleDateString()}.`
      );
      setPage("login");
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
        body: JSON.stringify(loginForm)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      localStorage.setItem("pixelly_token", data.token);
      localStorage.setItem("pixelly_role", data.role);
      localStorage.setItem("pixelly_business_id", data.businessId || "");
      localStorage.setItem("pixelly_full_name", data.fullName || "");

      if (data.role === "business_owner") {
        setOwnerData({
          fullName: data.fullName || "Studio Owner",
          notifications: [
            { id: 1, client: "Harper Estates", category: "Residential", requested: "18 Mar 09:00" },
            { id: 2, client: "Ella Morgan", category: "Wedding / Proposal", requested: "20 Mar 12:00" }
          ],
          trialDaysRemaining: 14
        });
        setMessage("");
        setPage("owner");
      } else {
        setMessage(`Login successful as ${data.role}`);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("pixelly_token");
    localStorage.removeItem("pixelly_role");
    localStorage.removeItem("pixelly_business_id");
    localStorage.removeItem("pixelly_full_name");
    setOwnerData(null);
    setMessage("");
    setPage("home");
  };

  if (page === "owner" && ownerData) {
    return (
      <div style={pageStyle}>
        <TopNav
          onGoHome={() => setPage("home")}
          onSignup={() => setPage("signup")}
          onLogin={() => setPage("login")}
          showAuth={false}
        />
        <main style={containerStyle}>
          <section style={ownerHero}>
            <div>
              <div style={eyebrow}>STUDIO DASHBOARD</div>
              <h1 style={ownerTitle}>Welcome back, {ownerData.fullName}</h1>
              <p style={ownerText}>
                New bookings appear here first. From here you can review requests and then open the calendar to check availability.
              </p>
            </div>
            <button onClick={logout} style={secondaryDarkButton}>Log out</button>
          </section>

          <div style={ownerGrid}>
            <section style={ownerCard}>
              <div style={cardEyebrow}>NEW BOOKINGS</div>
              <h2 style={cardTitle}>Requests waiting for review</h2>
              {ownerData.notifications.map((item) => (
                <div key={item.id} style={rowStyle}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.client}</div>
                    <div style={{ color: "#637084" }}>{item.category}</div>
                  </div>
                  <div style={{ fontWeight: 600 }}>{item.requested}</div>
                </div>
              ))}
            </section>

            <section style={ownerCard}>
              <div style={cardEyebrow}>TRIAL STATUS</div>
              <h2 style={cardTitle}>{ownerData.trialDaysRemaining} days remaining</h2>
              <p style={mutedText}>Your studio is active and currently in the free trial period.</p>
              <button style={primaryDarkButton}>Open calendar</button>
            </section>
          </div>
        </main>
      </div>
    );
  }

  if (page === "signup") {
    return (
      <div style={pageStyle}>
        <TopNav
          onGoHome={() => setPage("home")}
          onSignup={() => setPage("signup")}
          onLogin={() => setPage("login")}
        />
        <main style={authPageWrap}>
          <section style={authCard}>
            <div style={eyebrow}>BUSINESS SIGNUP</div>
            <h1 style={authTitle}>Create your Pixelly studio account</h1>
            <p style={authText}>
              Start your 14-day free trial and set up your studio dashboard, bookings, and team management.
            </p>

            <form onSubmit={handleSignup} style={formGrid}>
              <input
                name="businessName"
                placeholder="Business / studio name"
                value={signupForm.businessName}
                onChange={onSignupChange}
                style={wideInput}
              />
              <input
                name="ownerName"
                placeholder="Your name"
                value={signupForm.ownerName}
                onChange={onSignupChange}
                style={wideInput}
              />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={signupForm.email}
                onChange={onSignupChange}
                style={wideInput}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={signupForm.password}
                onChange={onSignupChange}
                style={wideInput}
              />
              <input
                name="city"
                placeholder="City"
                value={signupForm.city}
                onChange={onSignupChange}
                style={wideInput}
              />
              <input
                name="postcode"
                placeholder="Postcode"
                value={signupForm.postcode}
                onChange={onSignupChange}
                style={wideInput}
              />

              <button type="submit" style={fullButton}>Start free trial</button>
            </form>

            {message && <div style={messageBox}>{message}</div>}
          </section>
        </main>
      </div>
    );
  }

  if (page === "login") {
    return (
      <div style={pageStyle}>
        <TopNav
          onGoHome={() => setPage("home")}
          onSignup={() => setPage("signup")}
          onLogin={() => setPage("login")}
        />
        <main style={authPageWrap}>
          <section style={authCard}>
            <div style={eyebrow}>BUSINESS LOGIN</div>
            <h1 style={authTitle}>Sign in to your Pixelly account</h1>
            <p style={authText}>
              Access your bookings, calendar, team schedules, and studio dashboard.
            </p>

            <form onSubmit={handleLogin} style={formGrid}>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={loginForm.email}
                onChange={onLoginChange}
                style={wideInput}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={onLoginChange}
                style={wideInput}
              />
              <button type="submit" style={fullButton}>Sign in</button>
            </form>

            {message && <div style={messageBox}>{message}</div>}
          </section>
        </main>
      </div>
    );
  }
  
if (page === "search") {
  return (
    <div style={pageStyle}>
      <TopNav
        onGoHome={() => setPage("home")}
        onSignup={() => setPage("signup")}
        onLogin={() => setPage("login")}
      />

      <main style={containerStyle}>
        <h1 style={{ fontSize: 46, marginBottom: 30 }}>
          Studios near {search.location || "your area"}
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20
        }}>

          
          {studios.map((studio) => (
  <div key={studio.id} style={ownerCard}>
    <h3>{studio.business_name}</h3>

    <p style={mutedText}>Photography Studio</p>

    <button
      style={primaryDarkButton}
      onClick={() => {
        setSelectedStudio({
          name: studio.business_name,
          type: "Photography"
        });
        setPage("studio");
      }}
    >
      View Studio
    </button>
  </div>
))}

if (page === "studio" && selectedStudio) {
  return (
    <div style={pageStyle}>
      <TopNav
        onGoHome={() => setPage("home")}
        onSignup={() => setPage("signup")}
        onLogin={() => setPage("login")}
      />

      <main style={containerStyle}>
        <h1 style={{ fontSize: 52 }}>{selectedStudio.name}</h1>

        <p style={{ fontSize: 20, marginBottom: 20 }}>
          {selectedStudio.type}
        </p>

        <img
          src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd"
          style={{
            width: "100%",
            maxWidth: 700,
            borderRadius: 20,
            marginBottom: 30
          }}
        />

        <p style={mutedText}>
          Professional photography services available for bookings.
        </p>

        <div style={{ marginTop: 30, maxWidth: 500 }}>

  <h3>Request a booking</h3>
<input
  placeholder="Your name"
  value={bookingForm.name}
  onChange={(e) =>
    setBookingForm({ ...bookingForm, name: e.target.value })
  }
  style={wideInput}
/>

<input
  type="email"
  placeholder="Email address"
  value={bookingForm.email}
  onChange={(e) =>
    setBookingForm({ ...bookingForm, email: e.target.value })
  }
  style={wideInput}
/>

<input
  type="tel"
  placeholder="Phone number"
  value={bookingForm.phone}
  onChange={(e) =>
    setBookingForm({ ...bookingForm, phone: e.target.value })
  }
  style={wideInput}
/>


          
  <select
    value={bookingForm.shootType}
    onChange={(e) =>
      setBookingForm({ ...bookingForm, shootType: e.target.value })
    }
    style={wideInput}
  >
    <option>Residential</option>
    <option>Wedding</option>
    <option>Commercial</option>
    <option>Event</option>
    <option>Products</option>
  </select>

  <input
    type="date"
    value={bookingForm.date}
    onChange={(e) =>
      setBookingForm({ ...bookingForm, date: e.target.value })
    }
    style={wideInput}
  />

  <textarea
    placeholder="Additional details"
    value={bookingForm.notes}
    onChange={(e) =>
      setBookingForm({ ...bookingForm, notes: e.target.value })
    }
    style={{
      ...wideInput,
      height: 120
    }}
  />

  <button
    style={primaryDarkButton}
    onClick={async () => {

  if (!bookingForm.name || !bookingForm.email) {
    setBookingMessage("Please enter your name and email");
    return;
  }

  try {

    const res = await fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        studio: selectedStudio.name,
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        shootType: bookingForm.shootType,
        date: bookingForm.date,
        notes: bookingForm.notes
      })
    });

    if (!res.ok) {
      setBookingMessage("Failed to send booking request");
      return;
    }

    setBookingMessage("Booking request sent to studio!");

    setBookingForm({
      name: "",
      email: "",
      phone: "",
      shootType: "Residential",
      date: "",
      notes: ""
    });

  } catch (error) {
    setBookingMessage("Server connection failed");
  }

}}
>
  Send booking request
</button>

  {bookingMessage && (
    <div style={{ marginTop: 15 }}>{bookingMessage}</div>
  )}

</div>

      </main>
    </div>
  );
}

  
  return (
    <div style={pageStyle}>
      <TopNav
        onGoHome={() => setPage("home")}
        onSignup={() => setPage("signup")}
        onLogin={() => setPage("login")}
      />

      <main>
        <section style={landingHero}>
          <div style={heroOverlay}>
            <div style={heroContent}>
              <div style={eyebrowLight}>FIND TRUSTED PHOTOGRAPHERS, VIDEOGRAPHERS AND MEDIA PROFESSIONALS</div>
              <h1 style={landingTitle}>
                Book the right creative for your shoot.
              </h1>
              <p style={landingText}>
                Search by location and type of shoot, compare local professionals, and find the right fit for your booking.
              </p>

              <div style={searchCard}>
                <div style={searchGrid}>
                  <input
                    name="location"
                    placeholder="Enter location or postcode"
                    value={search.location}
                    onChange={onSearchChange}
                    style={searchInput}
                  />
                  <select
                    name="shootType"
                    value={search.shootType}
                    onChange={onSearchChange}
                    style={searchInput}
                  >
                    <option>All</option>
                    <option>Residential</option>
                    <option>Wedding / Proposal</option>
                    <option>Commercial</option>
                    <option>Event</option>
                    <option>Hospitality</option>
                    <option>Social Media</option>
                    <option>Landscape</option>
                    <option>Products</option>
                  </select>
                  <button
  style={searchButton}
  onClick={() => setPage("search")}
>
  Book now
</button>

                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={sectionWrap}>
          <div style={infoGrid}>
            <div style={infoCard}>
              <div style={cardEyebrow}>HOW IT WORKS</div>
              <h2 style={cardTitle}>Search locally</h2>
              <p style={mutedText}>
                Enter your area and type of shoot to discover local creative professionals and media companies.
              </p>
            </div>
            <div style={infoCard}>
              <div style={cardEyebrow}>BOOKING</div>
              <h2 style={cardTitle}>Review availability later</h2>
              <p style={mutedText}>
                Dates and availability appear on the profile page, keeping the search step clean and simple.
              </p>
            </div>
            <div style={infoCard}>
              <div style={cardEyebrow}>FOR STUDIOS</div>
              <h2 style={cardTitle}>Run your business in one place</h2>
              <p style={mutedText}>
                Bookings, team schedules, blocked time, jobs and studio operations all live in one dashboard.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function TopNav({ onGoHome, onSignup, onLogin, showAuth = true }) {
  return (
    <header style={topNav}>
      <button onClick={onGoHome} style={brandButton}>
        <div style={logoStyle}>P</div>
        <div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#14213d", textAlign: "left" }}>Pixelly</div>
          <div style={{ color: "#637084", textAlign: "left" }}>Marketplace + studio operations</div>
        </div>
      </button>

      {showAuth && (
        <div style={authTopBox}>
          <button onClick={onSignup} style={primaryDarkButton}>Business signup</button>
          <button onClick={onLogin} style={lightButton}>Business login</button>
        </div>
      )}
    </header>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f6f1ea",
  color: "#14213d",
  fontFamily: "Inter, Arial, sans-serif"
};

const topNav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "24px 36px"
};

const brandButton = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  background: "transparent",
  border: "none",
  cursor: "pointer"
};

const authTopBox = {
  display: "flex",
  gap: 12,
  padding: 10,
  background: "rgba(255,255,255,0.92)",
  borderRadius: 22,
  boxShadow: "0 12px 30px rgba(20,33,61,0.08)"
};

const logoStyle = {
  width: 46,
  height: 46,
  borderRadius: 14,
  background: "#14213d",
  color: "white",
  display: "grid",
  placeItems: "center",
  fontWeight: 700,
  fontSize: 20
};

const landingHero = {
  minHeight: "78vh",
  margin: "0 36px",
  borderRadius: 34,
  overflow: "hidden",
  backgroundImage:
    "linear-gradient(rgba(18,28,48,0.52), rgba(18,28,48,0.58)), url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center"
};

const heroOverlay = {
  width: "100%",
  padding: "60px 54px"
};

const heroContent = {
  maxWidth: 920
};

const eyebrowLight = {
  letterSpacing: 2,
  fontSize: 12,
  color: "rgba(255,255,255,0.88)",
  marginBottom: 16
};

const landingTitle = {
  fontSize: 76,
  lineHeight: 0.98,
  color: "white",
  margin: "0 0 20px",
  maxWidth: 800
};

const landingText = {
  fontSize: 22,
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.92)",
  maxWidth: 760,
  marginBottom: 28
};

const searchCard = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: 26,
  padding: 18,
  maxWidth: 980,
  boxShadow: "0 18px 40px rgba(0,0,0,0.14)"
};

const searchGrid = {
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr auto",
  gap: 14
};

const searchInput = {
  width: "100%",
  minWidth: 0,
  padding: "18px 20px",
  borderRadius: 18,
  border: "1px solid #ddd6c9",
  fontSize: 17,
  background: "white"
};

const searchButton = {
  background: "#14213d",
  color: "white",
  border: "none",
  borderRadius: 18,
  padding: "18px 26px",
  fontSize: 17,
  fontWeight: 700,
  cursor: "pointer"
};

const sectionWrap = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "34px 36px 60px"
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 22
};

const infoCard = {
  background: "white",
  border: "1px solid #e4ddd1",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 10px 24px rgba(20,33,61,0.04)"
};

const authPageWrap = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "30px 24px 70px"
};

const authCard = {
  background: "white",
  borderRadius: 30,
  padding: 34,
  border: "1px solid #e4ddd1",
  boxShadow: "0 18px 40px rgba(20,33,61,0.06)"
};

const authTitle = {
  fontSize: 48,
  lineHeight: 1.05,
  margin: "0 0 14px"
};

const authText = {
  fontSize: 18,
  lineHeight: 1.5,
  color: "#637084",
  marginBottom: 24
};

const formGrid = {
  display: "grid",
  gap: 16
};

const wideInput = {
  width: "100%",
  padding: "18px 20px",
  borderRadius: 18,
  border: "1px solid #d9d4ca",
  fontSize: 17,
  boxSizing: "border-box"
};

const fullButton = {
  width: "100%",
  background: "#14213d",
  color: "white",
  border: "none",
  padding: "18px 20px",
  borderRadius: 18,
  fontSize: 17,
  fontWeight: 700,
  cursor: "pointer"
};

const messageBox = {
  marginTop: 20,
  background: "#f8f7f3",
  border: "1px solid #ddd6c9",
  borderRadius: 18,
  padding: 18,
  fontSize: 16
};

const ownerHero = {
  background: "#24324b",
  color: "white",
  borderRadius: 28,
  padding: 34,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 24
};

const containerStyle = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "20px 36px 60px"
};

const ownerGrid = {
  display: "grid",
  gridTemplateColumns: "1.3fr 1fr",
  gap: 24,
  marginTop: 24
};

const ownerCard = {
  background: "white",
  borderRadius: 24,
  padding: 24,
  border: "1px solid #e4ddd1"
};

const ownerTitle = {
  fontSize: 52,
  margin: "0 0 14px"
};

const ownerText = {
  fontSize: 19,
  lineHeight: 1.5,
  margin: 0,
  maxWidth: 720
};

const eyebrow = {
  letterSpacing: 2,
  fontSize: 12,
  color: "#4f6da3",
  marginBottom: 12
};

const cardEyebrow = {
  letterSpacing: 2,
  fontSize: 12,
  color: "#4f6da3",
  marginBottom: 10
};

const cardTitle = {
  fontSize: 28,
  margin: "0 0 14px"
};

const mutedText = {
  color: "#637084",
  lineHeight: 1.6
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 0",
  borderBottom: "1px solid #ece7dd"
};

const primaryDarkButton = {
  background: "#14213d",
  color: "white",
  border: "none",
  padding: "14px 20px",
  borderRadius: 16,
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer"
};

const secondaryDarkButton = {
  background: "white",
  color: "#14213d",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "14px 18px",
  borderRadius: 16,
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer"
};

const lightButton = {
  background: "white",
  color: "#14213d",
  border: "1px solid #d9d4ca",
  padding: "14px 20px",
  borderRadius: 16,
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer"
};
