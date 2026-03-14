import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';

const navItems = [
  { label: 'Find a provider', href: '#marketplace' },
  { label: 'Studio login', href: '/login' },
];

function Shell({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <div className="brand-mark">P</div>
          <div>
            <div className="brand-name">Pixelly</div>
            <div className="brand-subtitle">Marketplace + studio operations</div>
          </div>
        </Link>
        <nav className="nav-links">
          {navItems.map((item) =>
            item.href.startsWith('/') ? (
              <Link key={item.label} className="button button-ghost" to={item.href}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} className="button button-ghost" href={item.href}>
                {item.label}
              </a>
            )
          )}
        </nav>
      </header>
      {children}
    </div>
  );
}

function HomePage() {
  return (
    <Shell>
      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">BOOK LOCAL MEDIA PROFESSIONALS</div>
            <h1>Find trusted photographers, videographers and property media teams near you.</h1>
            <p>
              Search by postcode, browse profiles, check availability and send booking requests.
              Studios can manage clients, jobs, team schedules and subscriptions from one place.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#marketplace">Find a media provider</a>
              <Link className="button button-secondary" to="/login">Studio login</Link>
            </div>
          </div>
          <div className="hero-panel">
            <h3>Built around your workflow</h3>
            <ul>
              <li>Map view or list view from a simple postcode search</li>
              <li>Business owners accept or suggest alternative times</li>
              <li>Team calendars include jobs, editing, travel, holiday and sickness</li>
              <li>Additional team members are billed at £10 each per month</li>
            </ul>
          </div>
        </section>

        <section id="marketplace" className="card-block">
          <div className="section-intro">
            <div className="eyebrow">CUSTOMER MARKETPLACE</div>
            <h2>Search by postcode, then filter only if you want to.</h2>
            <p>Pixelly is built as studio software first, with a customer booking marketplace layered on top.</p>
          </div>
          <div className="search-grid">
            <input className="input" placeholder="Enter postcode or location" />
            <select className="input">
              <option>All services</option>
              <option>Residential</option>
              <option>Wedding / Proposal</option>
              <option>Commercial</option>
              <option>Event</option>
              <option>Hospitality</option>
              <option>Social Media</option>
              <option>Landscape</option>
              <option>Product</option>
            </select>
            <div className="toggle-group">
              <button className="button button-primary small">List view</button>
              <button className="button button-secondary small">Map view</button>
            </div>
          </div>
          <div className="placeholder-panel">Provider results will go here in the marketplace build.</div>
        </section>

        <section className="grid-two">
          <div className="card-block">
            <div className="eyebrow">BUSINESS OWNER VIEW</div>
            <h2>New bookings first. Calendar next.</h2>
            <p>
              Business owners should first see notifications and incoming bookings, then review team availability in a proper calendar.
            </p>
            <div className="mini-list">
              <div className="mini-item"><strong>Pending booking</strong><span>Harper Estates · Residential · 18 Mar 09:00</span></div>
              <div className="mini-item"><strong>Pending booking</strong><span>Ella Morgan · Wedding / Proposal · 20 Mar 12:00</span></div>
              <div className="mini-item"><strong>Action</strong><span>Accept, decline, or suggest another time</span></div>
            </div>
            <Link to="/owner" className="button button-primary">Open owner dashboard shell</Link>
          </div>
          <div className="card-block">
            <div className="eyebrow">TEAM MEMBER VIEW</div>
            <h2>Today’s jobs and personal calendar only.</h2>
            <p>
              Team members do not need business admin. They need their schedule, job details, and quick status buttons.
            </p>
            <div className="mini-list">
              <div className="mini-item"><strong>09:00</strong><span>Riverside apartment shoot</span></div>
              <div className="mini-item"><strong>13:00</strong><span>Hotel social content package</span></div>
              <div className="mini-item"><strong>Status</strong><span>On my way / Completed</span></div>
            </div>
            <Link to="/team" className="button button-secondary">Open team dashboard shell</Link>
          </div>
        </section>
      </main>
    </Shell>
  );
}

function LoginPage() {
  return (
    <Shell>
      <main className="page narrow-page">
        <section className="card-block login-card">
          <div className="eyebrow">STUDIO LOGIN</div>
          <h1>Welcome to Pixelly</h1>
          <p>This is the fresh starting point for Build 1: roles, signup, login and trial handling.</p>
          <div className="form-grid">
            <input className="input" placeholder="Email address" />
            <input className="input" placeholder="Password" type="password" />
            <button className="button button-primary">Login</button>
            <button className="button button-secondary">Create business account</button>
          </div>
        </section>
      </main>
    </Shell>
  );
}

function CalendarLegend() {
  const items = [
    ['Job', 'swatch-job'],
    ['Travel', 'swatch-travel'],
    ['Editing', 'swatch-editing'],
    ['Holiday', 'swatch-holiday'],
    ['Sickness', 'swatch-sickness'],
    ['Available', 'swatch-available'],
  ];
  return (
    <div className="legend">
      {items.map(([label, className]) => (
        <div key={label} className="legend-item"><span className={`swatch ${className}`}></span>{label}</div>
      ))}
    </div>
  );
}

function CalendarGrid({ title }) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const cells = Array.from({ length: 35 }, (_, i) => i + 1);
  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <div>
          <div className="eyebrow">CALENDAR</div>
          <h2>{title}</h2>
        </div>
        <div className="toolbar">
          <button className="button button-secondary small">Month</button>
          <button className="button button-ghost small">Week</button>
          <button className="button button-ghost small">Day</button>
        </div>
      </div>
      <CalendarLegend />
      <div className="calendar-grid">
        {days.map((day) => <div key={day} className="calendar-dayname">{day}</div>)}
        {cells.map((day) => (
          <div key={day} className="calendar-cell">
            <div className="cell-date">{day}</div>
            {day === 4 && <div className="event-pill job">Amy · Riverside shoot</div>}
            {day === 5 && <div className="event-pill available">Jay · Available</div>}
            {day === 9 && <div className="event-pill sickness">Leah · Sickness</div>}
            {day === 12 && <div className="event-pill holiday">Amy · Holiday</div>}
            {day === 18 && <div className="event-pill editing">Jay · Editing</div>}
            {day === 19 && <div className="event-pill travel">Owner · Travel</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function OwnerDashboard() {
  return (
    <Shell>
      <main className="page owner-layout">
        <section className="owner-overview card-block">
          <div className="calendar-header">
            <div>
              <div className="eyebrow">BUSINESS OWNER DASHBOARD</div>
              <h1>Notifications first. Team availability next.</h1>
            </div>
            <div className="toolbar">
              <button className="button button-primary small">New booking</button>
              <button className="button button-secondary small">Invite team member</button>
            </div>
          </div>
          <div className="notification-grid">
            <div className="notice-card">
              <strong>New booking request</strong>
              <span>Harper Estates · Residential · 18 Mar 09:00</span>
              <div className="button-row">
                <button className="button button-primary small">View calendar</button>
                <button className="button button-secondary small">Suggest time</button>
              </div>
            </div>
            <div className="notice-card">
              <strong>New booking request</strong>
              <span>Ella Morgan · Wedding / Proposal · 20 Mar 12:00</span>
              <div className="button-row">
                <button className="button button-primary small">Accept</button>
                <button className="button button-ghost small">Decline</button>
              </div>
            </div>
            <div className="notice-card">
              <strong>Trial status</strong>
              <span>14 day free trial running · 10 days remaining</span>
              <button className="button button-secondary small">View billing</button>
            </div>
          </div>
        </section>
        <section className="sidebar card-block">
          <div className="eyebrow">TEAM</div>
          <h2>View by person</h2>
          <div className="mini-list">
            <div className="mini-item active-item"><strong>All team</strong><span>Month overview</span></div>
            <div className="mini-item"><strong>Shaun Owner</strong><span>Business owner calendar</span></div>
            <div className="mini-item"><strong>Amy Reed</strong><span>Photographer</span></div>
            <div className="mini-item"><strong>Jay Patel</strong><span>Videographer</span></div>
            <div className="mini-item"><strong>Leah Moss</strong><span>Editor</span></div>
          </div>
          <div className="eyebrow spacing-top">BLOCK TIME</div>
          <div className="form-grid">
            <select className="input"><option>Amy Reed</option></select>
            <select className="input"><option>Holiday</option><option>Sickness</option><option>Unavailable</option></select>
            <input className="input" type="date" />
            <input className="input" type="date" />
            <button className="button button-primary">Save range</button>
          </div>
        </section>
        <section className="main-calendar">
          <CalendarGrid title="All team month view" />
        </section>
      </main>
    </Shell>
  );
}

function TeamDashboard() {
  return (
    <Shell>
      <main className="page narrow-page">
        <section className="card-block">
          <div className="calendar-header">
            <div>
              <div className="eyebrow">TEAM MEMBER DASHBOARD</div>
              <h1>Today’s jobs and my calendar.</h1>
            </div>
            <div className="toolbar">
              <button className="button button-primary small">On my way</button>
              <button className="button button-secondary small">Completed</button>
            </div>
          </div>
          <div className="notification-grid team-grid">
            <div className="notice-card">
              <strong>09:00 · Riverside apartment marketing pack</strong>
              <span>Photography, video, floorplan</span>
            </div>
            <div className="notice-card">
              <strong>13:00 · Hotel launch social package</strong>
              <span>Photography, social clips</span>
            </div>
          </div>
        </section>
        <CalendarGrid title="My month calendar" />
      </main>
    </Shell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/owner" element={<OwnerDashboard />} />
      <Route path="/team" element={<TeamDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
