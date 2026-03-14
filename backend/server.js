import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const categories = [
  'All',
  'Wedding / Proposal',
  'Residential',
  'Commercial',
  'Event',
  'Hospitality',
  'Social Media',
  'Landscape',
  'Product',
  'Corporate',
  'Drone Services',
];

const providers = [
  {
    id: 1,
    name: 'NorthNest Media',
    type: 'Company',
    location: 'Manchester M20',
    distanceMiles: 3,
    coverageRadius: 25,
    services: ['Residential', 'Commercial', 'Drone Services'],
    bio: 'Property-first media team for estate agents, developers and serviced accommodation brands.',
    availability: [
      { date: '2026-03-18', slots: ['09:00', '11:00', '14:00'] },
      { date: '2026-03-19', slots: ['10:00', '13:00', '15:00'] },
    ],
    profile: {
      responseTime: 'Usually replies within 1 hour',
      serviceArea: 'Manchester, Cheshire, Liverpool',
      about: 'Residential and commercial property visuals including photo, video, drone, floorplans and social clips.',
    },
  },
  {
    id: 2,
    name: 'Ever After Stories',
    type: 'Solo',
    location: 'Leeds LS1',
    distanceMiles: 7,
    coverageRadius: 60,
    services: ['Wedding / Proposal', 'Event'],
    bio: 'Relaxed wedding and proposal storytelling with photo and highlight film packages.',
    availability: [
      { date: '2026-03-20', slots: ['09:00', '12:00', '16:00'] },
      { date: '2026-03-21', slots: ['08:00', '11:00'] },
    ],
    profile: {
      responseTime: 'Usually replies same day',
      serviceArea: 'Yorkshire, Peak District, Lake District',
      about: 'Natural coverage for weddings, proposals, engagement sessions and intimate events.',
    },
  },
  {
    id: 3,
    name: 'Studio Forge',
    type: 'Company',
    location: 'Birmingham B1',
    distanceMiles: 12,
    coverageRadius: 40,
    services: ['Product', 'Commercial', 'Social Media', 'Hospitality'],
    bio: 'Product, menu and content production for brands, restaurants and hospitality groups.',
    availability: [
      { date: '2026-03-18', slots: ['13:00', '15:00'] },
      { date: '2026-03-22', slots: ['09:00', '10:00', '14:00'] },
    ],
    profile: {
      responseTime: 'Usually replies within 2 hours',
      serviceArea: 'Midlands and nationwide by quote',
      about: 'Studio and on-location production for menus, launches, campaigns and ecommerce.',
    },
  },
  {
    id: 4,
    name: 'Terrain Light',
    type: 'Solo',
    location: 'Sheffield S10',
    distanceMiles: 18,
    coverageRadius: 100,
    services: ['Landscape', 'Tourism', 'Social Media'],
    bio: 'Landscape and tourism media for destinations, outdoor brands and social campaigns.',
    availability: [
      { date: '2026-03-23', slots: ['Sunrise', '10:00', '15:00'] },
    ],
    profile: {
      responseTime: 'Usually replies same day',
      serviceArea: 'Nationwide',
      about: 'Stills and short-form video for tourism, destinations and outdoor projects.',
    },
  },
];

const bookings = [
  {
    id: 2001,
    providerId: 1,
    clientName: 'Harper Estates',
    phone: '07123456789',
    email: 'bookings@harperestates.co.uk',
    address: '12 Market Street, Manchester',
    category: 'Residential',
    requestedDate: '2026-03-18',
    requestedTime: '09:00',
    status: 'Pending review',
    suggestedTimes: [],
  },
  {
    id: 2002,
    providerId: 2,
    clientName: 'Ella Morgan',
    phone: '07999999999',
    email: 'ella@example.com',
    address: 'Roundhay Park, Leeds',
    category: 'Wedding / Proposal',
    requestedDate: '2026-03-20',
    requestedTime: '12:00',
    status: 'Confirmed',
    suggestedTimes: [],
  },
];

const teamMembers = [
  { id: 1, name: 'Shaun Owner', email: 'owner@lenslink.test', role: 'Business Owner', access: 'Admin', status: 'Active' },
  { id: 2, name: 'Amy Reed', email: 'amy@northnest.test', role: 'Photographer', access: 'Team', status: 'Active' },
  { id: 3, name: 'Jay Patel', email: 'jay@northnest.test', role: 'Videographer', access: 'Team', status: 'Active' },
  { id: 4, name: 'Leah Moss', email: 'leah@northnest.test', role: 'Editor', access: 'Team', status: 'Invited' },
];

const calendarItems = [
  { id: 1, type: 'Job', title: 'Riverside apartment shoot', assignedTo: 'Amy Reed', date: '2026-03-18', time: '09:00', status: 'Assigned' },
  { id: 2, type: 'Travel', title: 'Travel to Salford', assignedTo: 'Amy Reed', date: '2026-03-18', time: '08:15', status: 'Planned' },
  { id: 3, type: 'Editing', title: 'Twilight edit batch', assignedTo: 'Jay Patel', date: '2026-03-19', time: '15:00', status: 'Scheduled' },
  { id: 4, type: 'Blocked Time', title: 'Holiday', assignedTo: 'Amy Reed', date: '2026-03-25', time: 'All day', status: 'Blocked' },
  { id: 5, type: 'Blocked Time', title: 'Sickness', assignedTo: 'Jay Patel', date: '2026-03-26', time: 'All day', status: 'Blocked' },
];

const jobs = [
  {
    id: 3101,
    title: 'Riverside apartment marketing pack',
    clientName: 'Harper Estates',
    phone: '07123456789',
    email: 'bookings@harperestates.co.uk',
    address: '12 Market Street, Manchester',
    category: 'Residential',
    servicesNeeded: ['Photography', 'Video', 'Floorplan'],
    assignedTo: 'Amy Reed',
    date: '2026-03-18',
    time: '09:00',
    checklist: ['On my way', 'Completed'],
  },
  {
    id: 3102,
    title: 'Hotel launch social package',
    clientName: 'Elm House Hotel',
    phone: '07000000000',
    email: 'events@elmhousehotel.co.uk',
    address: '8 Cathedral Square, Manchester',
    category: 'Hospitality',
    servicesNeeded: ['Photography', 'Social Clips'],
    assignedTo: 'Jay Patel',
    date: '2026-03-19',
    time: '13:00',
    checklist: ['On my way', 'Completed'],
  },
];

const platformAdmin = {
  ownerBusinessAccount: 'NorthNest Media',
  ownerBillingStatus: 'Complimentary',
  platformMetrics: {
    activeStudios: 24,
    activeCustomers: 412,
    monthlyRevenue: 1686,
    openSupportTickets: 5,
  },
  editableSettings: [
    'Homepage headline and text',
    'Service categories',
    'Pricing plans',
    'Email templates',
    'Featured providers',
    'Account approvals',
  ],
};

function getDashboardPayload() {
  const extraMembers = Math.max(teamMembers.filter((member) => member.access === 'Team').length, 0);
  return {
    pricing: {
      basePrice: 49,
      includedUsers: 1,
      additionalSeatPrice: 10,
      ownerIncluded: true,
      extraMembers,
      monthlyTotal: 49 + extraMembers * 10,
    },
    owner: {
      name: 'Shaun Owner',
      businessName: 'NorthNest Media',
      complimentaryAccount: true,
    },
    sections: ['Dashboard', 'Bookings', 'Clients', 'Team', 'Calendar', 'Jobs', 'Notifications', 'Services', 'Billing', 'Settings'],
    bookings,
    teamMembers,
    calendarItems,
    jobs,
    serviceCategories: categories,
    customServiceExamples: ['Photography', 'Video', 'Drone', 'Floorplan', 'EPC', 'Editing', 'Travel time'],
  };
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/', (_req, res) => {
  res.status(200).send('LensLink API running');
});

app.get('/api/categories', (_req, res) => {
  res.json(categories);
});

app.get('/api/providers', (req, res) => {
  const service = req.query.service?.toString().toLowerCase();
  const search = req.query.search?.toString().toLowerCase();

  let result = [...providers];

  if (service && service !== 'all') {
    result = result.filter((provider) =>
      provider.services.some((item) => item.toLowerCase().includes(service))
    );
  }

  if (search) {
    result = result.filter((provider) =>
      [provider.name, provider.location, provider.bio, provider.profile.about, ...provider.services]
        .join(' ')
        .toLowerCase()
        .includes(search)
    );
  }

  res.json(result);
});

app.get('/api/providers/:id', (req, res) => {
  const provider = providers.find((item) => item.id === Number(req.params.id));
  if (!provider) return res.status(404).json({ message: 'Provider not found' });
  res.json(provider);
});

app.get('/api/dashboard', (_req, res) => {
  res.json(getDashboardPayload());
});

app.get('/api/platform-admin', (_req, res) => {
  res.json(platformAdmin);
});

app.post('/api/bookings', (req, res) => {
  const { clientName, phone, email, address, category, requestedDate, requestedTime, providerId } = req.body;
  if (!clientName || !phone || !address || !category || !requestedDate || !requestedTime || !providerId) {
    return res.status(400).json({ message: 'Please complete the booking details.' });
  }

  const booking = {
    id: Date.now(),
    providerId: Number(providerId),
    clientName,
    phone,
    email,
    address,
    category,
    requestedDate,
    requestedTime,
    status: 'Pending review',
    suggestedTimes: [],
  };

  bookings.unshift(booking);
  return res.status(201).json({
    booking,
    emailAction: 'Booking request received. Provider can accept, decline or suggest new times.',
  });
});

app.post('/api/bookings/:id/respond', (req, res) => {
  const booking = bookings.find((item) => item.id === Number(req.params.id));
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const { action, suggestedTimes = [] } = req.body;

  if (action === 'accept') {
    booking.status = 'Confirmed';
    booking.suggestedTimes = [];
    return res.json({ booking, emailAction: 'Confirmation email sent to client.' });
  }

  if (action === 'decline') {
    booking.status = 'Declined';
    booking.suggestedTimes = [];
    return res.json({ booking, emailAction: 'Decline email sent to client.' });
  }

  if (action === 'suggest') {
    if (!Array.isArray(suggestedTimes) || suggestedTimes.length === 0) {
      return res.status(400).json({ message: 'Add at least one suggested time.' });
    }
    booking.status = 'Awaiting client response';
    booking.suggestedTimes = suggestedTimes;
    return res.json({ booking, emailAction: 'Alternative time email sent to client.' });
  }

  return res.status(400).json({ message: 'Invalid action.' });
});

app.post('/api/jobs/:id/status', (req, res) => {
  const job = jobs.find((item) => item.id === Number(req.params.id));
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const { status } = req.body;
  if (!['On my way', 'Completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  job.lastStatus = status;

  return res.json({
    job,
    clientMessage: status === 'On my way' && job.phone ? 'Client text would be sent: your media professional is on the way.' : null,
  });
});

app.post('/api/calendar/block-time', (req, res) => {
  const { assignedTo, title, date } = req.body;
  if (!assignedTo || !title || !date) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const item = {
    id: Date.now(),
    type: 'Blocked Time',
    title,
    assignedTo,
    date,
    time: 'All day',
    status: 'Blocked',
  };

  calendarItems.unshift(item);
  return res.status(201).json(item);
});

app.listen(PORT, () => {
  console.log(`LensLink API running on http://localhost:${PORT}`);
});
