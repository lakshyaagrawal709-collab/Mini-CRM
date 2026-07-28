// Mock / Standalone Demo Data for GitHub Pages static environment

const INITIAL_MOCK_LEADS = [
  {
    _id: 'lead_1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@acmecorp.io',
    phone: '+1 (555) 234-5678',
    company: 'Acme Technologies',
    source: 'Website',
    status: 'Converted',
    priority: 'High',
    estimatedValue: 24500,
    assignedTo: 'Alex Rivera',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: null,
    notes: [
      { text: 'Inquired about enterprise custom software development package.', author: 'Alex Rivera', createdAt: new Date(Date.now() - 118 * 24 * 60 * 60 * 1000).toISOString() },
      { text: 'Proposal sent and accepted! Signed contract.', author: 'Alex Rivera', createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    _id: 'lead_2',
    name: 'David Chen',
    email: 'david@vertexsolutions.com',
    phone: '+1 (555) 876-5432',
    company: 'Vertex Solutions',
    source: 'LinkedIn',
    status: 'Proposal Sent',
    priority: 'High',
    estimatedValue: 18000,
    assignedTo: 'Alex Rivera',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: [
      { text: 'Sent formal SLA and project timeline proposal.', author: 'Alex Rivera', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    _id: 'lead_3',
    name: 'Elena Rostova',
    email: 'elena@cyberpulse.net',
    phone: '+1 (555) 345-6789',
    company: 'CyberPulse Systems',
    source: 'Referral',
    status: 'Qualified',
    priority: 'Medium',
    estimatedValue: 12500,
    assignedTo: 'Alex Rivera',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: [
      { text: 'Passed technical discovery call. Next step: demo session.', author: 'Alex Rivera', createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    _id: 'lead_4',
    name: 'Marcus Vance',
    email: 'marcus@nexustech.co',
    phone: '+1 (555) 901-2345',
    company: 'Nexus Tech Co',
    source: 'Cold Call',
    status: 'Contacted',
    priority: 'Low',
    estimatedValue: 8000,
    assignedTo: 'Sales Team',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    notes: [
      { text: 'Left voicemail with introductory pitch deck link.', author: 'Alex Rivera', createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    _id: 'lead_5',
    name: 'Jessica Taylor',
    email: 'jessica@brightpath.org',
    phone: '+1 (555) 432-1098',
    company: 'Brightpath Digital',
    source: 'Website',
    status: 'New',
    priority: 'High',
    estimatedValue: 35000,
    assignedTo: 'Alex Rivera',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: []
  },
  {
    _id: 'lead_6',
    name: 'Robert Sterling',
    email: 'robert@sterlingcapital.com',
    phone: '+1 (555) 654-3210',
    company: 'Sterling Capital',
    source: 'Social Media',
    status: 'Converted',
    priority: 'High',
    estimatedValue: 42000,
    assignedTo: 'Alex Rivera',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    notes: [
      { text: 'Full mobile app design and API backend contract executed.', author: 'Alex Rivera', createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    _id: 'lead_7',
    name: 'Amara Okafor',
    email: 'amara@solargreen.africa',
    phone: '+1 (555) 888-9999',
    company: 'SolarGreen Global',
    source: 'Referral',
    status: 'Lost',
    priority: 'Medium',
    estimatedValue: 15000,
    assignedTo: 'Sales Team',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    notes: [
      { text: 'Budget frozen for Q3. Lead postponed indefinitely.', author: 'Alex Rivera', createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    _id: 'lead_8',
    name: 'Liam Gallagher',
    email: 'liam@oasisdigital.uk',
    phone: '+44 20 7946 0912',
    company: 'Oasis Digital UK',
    source: 'Website',
    status: 'Proposal Sent',
    priority: 'Medium',
    estimatedValue: 22000,
    assignedTo: 'Alex Rivera',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: [
      { text: 'Proposal delivered via email. Waiting on board review.', author: 'Alex Rivera', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

export const getStoredLeads = () => {
  const saved = localStorage.getItem('demo_leads');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem('demo_leads', JSON.stringify(INITIAL_MOCK_LEADS));
  return INITIAL_MOCK_LEADS;
};

export const setStoredLeads = (leads) => {
  localStorage.setItem('demo_leads', JSON.stringify(leads));
};
