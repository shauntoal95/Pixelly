import React, { useEffect, useMemo, useState } from 'react';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');

const defaultBooking = {
  clientName: '',
  phone: '',
  email: '',
  address: '',
  category: 'Residential',
  requestedDate: '',
  requestedTime: '',
};

function Navigation({ page, setPage }) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-mark">L</div>
        <div>
          <strong>LensLink</strong>
          <p>Marketplace + studio operations</p>
        </div>
      </div>
      <nav>
        <button className={page === 'find' ? 'nav-button active' : 'nav-button'} onClick={() => setPage('find')}>Find a media provider</button>
        <button className={page === 'studio' ? 'nav-button active' : 'nav-button'} onClick={() => setPage('studio')}>Studio login</button>
      </nav>
    </header>
  );
}

function Hero({ setPage }) {
  return (
    <section className="hero-surface">
      <div>
        <span className="eyebrow">Book local media professionals</span>
        <h1>Find trusted photographers, videographers and property media teams near you.</h1>
        <p>
          Search by postcode, browse profiles, check availability and send booking requests. Studios can manage clients,
          jobs, team schedules and subscriptions from one place.
        </p>
        <div className="hero-actions">
          <button onClick={() => setPage('find')}>Find a media provider</button>
          <button className="secondary" onClick={() => setPage('studio')}>Studio login</button>
        </div>
      </div>
      <div className="hero-card">
        <h3>Built around your workflow</h3>
        <ul>
          <li>Map view or list view from a simple postcode search</li>
          <li>Business owners accept or suggest alternative times</li>
          <li>Team calendars include jobs, editing, travel, holiday and sickness</li>
          <li>Extra team members are billed at £10 each per month</li>
        </ul>
      </div>
    </section>
  );
}

function SearchBar({ categories, search, setSearch, service, setService, view, setView }) {
  return (
    <div className="search-shell">
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Enter postcode or location" />
      <select value={service} onChange={(e) => setService(e.target.value)}>
        {categories.map((category) => <option key={category}>{category}</option>)}
      </select>
      <div className="segmented">
        <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>List view</button>
        <button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}>Map view</button>
      </div>
    </div>
  );
}

function ProviderCard({ provider, onOpen }) {
  return (
    <article className="panel provider-card">
      <div className="space-between align-start gap-sm">
        <div>
          <h3>{provider.name}</h3>
          <p className="muted">{provider.type} · {provider.location}</p>
        </div>
        <span className="pill">{provider.distanceMiles} miles away</span>
      </div>
      <p>{provider.bio}</p>
      <div className="tag-row">
        {provider.services.map((service) => <span className="tag" key={service}>{service}</span>)}
      </div>
      <p className="muted">Coverage radius: {provider.coverageRadius} miles</p>
      <button onClick={() => onOpen(provider)}>View profile & availability</button>
    </article>
  );
}

function MapPlaceholder({ providers }) {
  return (
    <div className="panel map-placeholder">
      <div>
        <h3>Map view</h3>
        <p className="muted">A live map would be connected in the production build. For now, each result is pinned in an example search area.</p>
      </div>
      <div className="map-canvas">
        {providers.slice(0, 4).map((provider, index) => (
          <div key={provider.id} className={`map-pin pin-${index + 1}`}>{provider.name}</div>
        ))}
      </div>
    </div>
  );
}

function BookingModal({ provider, onClose }) {
  const [form, setForm] = useState(defaultBooking);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (provider) {
      setForm((current) => ({ ...current, category: provider.services[0] || 'Residential' }));
      setMessage('');
    }
  }, [provider]);

  if (!provider) return null;

  async function submit(e) {
    e.preventDefault();
    setMessage('Sending booking request...');
    const response = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, providerId: provider.id }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || 'Unable to send booking request.');
      return;
    }
    setMessage(`${data.emailAction} Reference #${data.booking.id}`);
    setForm(defaultBooking);
  }

  return (
    <div className="modal-shell" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="space-between align-start gap-sm">
          <div>
            <h2>{provider.name}</h2>
            <p className="muted">{provider.profile.serviceArea}</p>
          </div>
          <button className="ghost" onClick={onClose}>Close</button>
        </div>
        <div className="modal-grid">
          <div>
            <p>{provider.profile.about}</p>
            <div className="tag-row">
              {provider.services.map((service) => <span key={service} className="tag">{service}</span>)}
            </div>
            <h4>Availability</h4>
            {provider.availability.map((entry) => (
              <div className="availability-card" key={entry.date}>
                <strong>{entry.date}</strong>
                <div className="tag-row compact">
                  {entry.slots.map((slot) => <span key={slot} className="pill soft">{slot}</span>)}
                </div>
              </div>
            ))}
          </div>
          <form className="panel form-panel" onSubmit={submit}>
            <h3>Request a booking</h3>
            <input placeholder="Your name" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
            <input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Shoot or property address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {provider.services.map((service) => <option key={service}>{service}</option>)}
            </select>
            <div className="two-up">
              <input type="date" value={form.requestedDate} onChange={(e) => setForm({ ...form, requestedDate: e.target.value })} />
              <input placeholder="Requested time" value={form.requestedTime} onChange={(e) => setForm({ ...form, requestedTime: e.target.value })} />
            </div>
            <button type="submit">Send booking request</button>
            {message ? <p className="success-text">{message}</p> : null}
          </form>
        </div>
      </div>
    </div>
  );
}

function StudioDashboard({ dashboard, admin, refresh }) {
  const [suggestTimes, setSuggestTimes] = useState('2026-03-18 11:00, 2026-03-18 14:00');
  const [feedback, setFeedback] = useState('');
  const [blockForm, setBlockForm] = useState({ assignedTo: 'Amy Reed', title: 'Holiday', date: '2026-03-27' });
  const [jobMessage, setJobMessage] = useState('');

  if (!dashboard || !admin) return <div className="panel">Loading studio dashboard…</div>;

  async function respondToBooking(id, action) {
    const payload = action === 'suggest'
      ? { action, suggestedTimes: suggestTimes.split(',').map((item) => item.trim()).filter(Boolean) }
      : { action };

    const response = await fetch(`${API_URL}/api/bookings/${id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setFeedback(data.emailAction || data.message);
    refresh();
  }

  async function blockTime(e) {
    e.preventDefault();
    const response = await fetch(`${API_URL}/api/calendar/block-time`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blockForm),
    });
    const data = await response.json();
    setFeedback(`Blocked ${data.title} for ${data.assignedTo} on ${data.date}.`);
    refresh();
  }

  async function updateJobStatus(jobId, status) {
    const response = await fetch(`${API_URL}/api/jobs/${jobId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    setJobMessage(data.clientMessage || `${status} recorded.`);
    refresh();
  }

  return (
    <div className="studio-grid">
      <div className="panel stats-panel">
        <span className="eyebrow dark">Subscription</span>
        <h3>£{dashboard.pricing.monthlyTotal}/month</h3>
        <p className="muted">Base plan is £49 for the business owner. Each additional team member adds £10/month.</p>
        <ul className="clean-list">
          <li>Owner included: {dashboard.pricing.ownerIncluded ? 'Yes' : 'No'}</li>
          <li>Extra team members: {dashboard.pricing.extraMembers}</li>
          <li>Your own business account: {admin.ownerBillingStatus}</li>
        </ul>
      </div>
      <div className="panel stats-panel">
        <span className="eyebrow dark">Platform owner tools</span>
        <h3>Super admin controls</h3>
        <p className="muted">This is where you would manage the platform without touching code.</p>
        <div className="tag-row compact">
          {admin.editableSettings.map((item) => <span className="pill soft" key={item}>{item}</span>)}
        </div>
      </div>

      <div className="panel full-span">
        <div className="space-between wrap gap-sm">
          <div>
            <span className="eyebrow dark">Bookings</span>
            <h3>Accept, decline or suggest another time</h3>
          </div>
          {feedback ? <p className="success-text">{feedback}</p> : null}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Category</th>
                <th>Requested</th>
                <th>Status</th>
                <th>Suggested times</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.clientName}</td>
                  <td>{booking.category}</td>
                  <td>{booking.requestedDate} · {booking.requestedTime}</td>
                  <td>{booking.status}</td>
                  <td>{booking.suggestedTimes.length ? booking.suggestedTimes.join(', ') : '—'}</td>
                  <td>
                    <div className="inline-actions">
                      <button className="small" onClick={() => respondToBooking(booking.id, 'accept')}>Accept</button>
                      <button className="small ghost" onClick={() => respondToBooking(booking.id, 'decline')}>Decline</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="suggest-box">
          <input value={suggestTimes} onChange={(e) => setSuggestTimes(e.target.value)} />
          <button onClick={() => respondToBooking(dashboard.bookings[0]?.id, 'suggest')}>Suggest new time(s) for first pending booking</button>
        </div>
      </div>

      <div className="panel">
        <span className="eyebrow dark">Team members</span>
        <h3>Add by email and invite them</h3>
        <ul className="clean-list">
          {dashboard.teamMembers.map((member) => (
            <li key={member.id}><strong>{member.name}</strong> · {member.role} · {member.email} · {member.status}</li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <span className="eyebrow dark">Block out calendar time</span>
        <h3>Holiday, sickness and unavailable time</h3>
        <form className="form-stack" onSubmit={blockTime}>
          <select value={blockForm.assignedTo} onChange={(e) => setBlockForm({ ...blockForm, assignedTo: e.target.value })}>
            {dashboard.teamMembers.filter((member) => member.access === 'Team').map((member) => <option key={member.id}>{member.name}</option>)}
          </select>
          <select value={blockForm.title} onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}>
            <option>Holiday</option>
            <option>Sickness</option>
            <option>Training</option>
            <option>Admin Day</option>
          </select>
          <input type="date" value={blockForm.date} onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })} />
          <button type="submit">Block time</button>
        </form>
      </div>

      <div className="panel full-span">
        <span className="eyebrow dark">Calendar & jobs</span>
        <h3>Jobs, editing, travel and status tracking</h3>
        <div className="split-grid">
          <div>
            <h4>Calendar items</h4>
            <ul className="clean-list bordered">
              {dashboard.calendarItems.map((item) => (
                <li key={item.id}><strong>{item.date}</strong> · {item.assignedTo} · {item.type} · {item.title}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Assigned jobs</h4>
            <ul className="clean-list bordered">
              {dashboard.jobs.map((job) => (
                <li key={job.id}>
                  <div className="space-between wrap gap-sm">
                    <div>
                      <strong>{job.title}</strong>
                      <p className="muted">{job.assignedTo} · {job.date} at {job.time}</p>
                      <p className="muted">{job.servicesNeeded.join(', ')}</p>
                    </div>
                    <div className="inline-actions">
                      <button className="small" onClick={() => updateJobStatus(job.id, 'On my way')}>On my way</button>
                      <button className="small ghost" onClick={() => updateJobStatus(job.id, 'Completed')}>Completed</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {jobMessage ? <p className="success-text">{jobMessage}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('find');
  const [categories, setCategories] = useState(['All']);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [search, setSearch] = useState('Manchester');
  const [service, setService] = useState('All');
  const [view, setView] = useState('list');
  const [dashboard, setDashboard] = useState(null);
  const [admin, setAdmin] = useState(null);

  async function loadProviders() {
    const params = new URLSearchParams({ search, service });
    const response = await fetch(`${API_URL}/api/providers?${params.toString()}`);
    const data = await response.json();
    setProviders(data);
  }

  async function loadStudioData() {
    const [dashboardResponse, adminResponse] = await Promise.all([
      fetch(`${API_URL}/api/dashboard`),
      fetch(`${API_URL}/api/platform-admin`),
    ]);
    setDashboard(await dashboardResponse.json());
    setAdmin(await adminResponse.json());
  }

  useEffect(() => {
    fetch(`${API_URL}/api/categories`).then((response) => response.json()).then(setCategories);
  }, []);

  useEffect(() => {
    loadProviders();
  }, [search, service]);

  useEffect(() => {
    if (page === 'studio') {
      loadStudioData();
    }
  }, [page]);

  const summaryText = useMemo(() => {
    if (!providers.length) return 'No providers found yet for this search.';
    return `${providers.length} media provider${providers.length > 1 ? 's' : ''} found near ${search || 'your search area'}.`;
  }, [providers, search]);

  return (
    <div className="app-shell">
      <Navigation page={page} setPage={setPage} />
      <main className="content-wrap">
        <Hero setPage={setPage} />

        {page === 'find' ? (
          <section className="section-stack">
            <div className="section-heading">
              <div>
                <span className="eyebrow dark">Customer marketplace</span>
                <h2>Search by postcode, then filter only if you want to.</h2>
              </div>
              <p className="muted">{summaryText}</p>
            </div>
            <SearchBar
              categories={categories}
              search={search}
              setSearch={setSearch}
              service={service}
              setService={setService}
              view={view}
              setView={setView}
            />
            {view === 'map' ? <MapPlaceholder providers={providers} /> : null}
            <div className="provider-grid">
              {providers.map((provider) => <ProviderCard key={provider.id} provider={provider} onOpen={setSelectedProvider} />)}
            </div>
          </section>
        ) : (
          <section className="section-stack">
            <div className="section-heading">
              <div>
                <span className="eyebrow dark">Studio dashboard</span>
                <h2>One place for bookings, clients, team schedules and subscription billing.</h2>
              </div>
              <p className="muted">Business owner included in the £49 base plan. Additional team members are £10 each.</p>
            </div>
            <StudioDashboard dashboard={dashboard} admin={admin} refresh={loadStudioData} />
          </section>
        )}
      </main>
      <BookingModal provider={selectedProvider} onClose={() => setSelectedProvider(null)} />
    </div>
  );
}
