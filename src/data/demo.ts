import type { FeedItem, UserProfile } from '../types';

export const demoUser: UserProfile = {
  id: 'demo-user',
  name: 'Patrik Builder',
  handle: 'patrik',
  email: 'demo@goodfeel.local',
  headline: 'Full-stack developer · AI builder',
  location: 'Praha, CZ'
};

const alex: UserProfile = {
  id: 'alex',
  name: 'Alex Chen',
  handle: 'alex',
  email: 'alex@example.com',
  headline: 'Co-founder @ PixelForm',
  location: 'Berlin, DE'
};

const priya: UserProfile = {
  id: 'priya',
  name: 'Priya Desai',
  handle: 'priya',
  email: 'priya@example.com',
  headline: 'Product designer · Open to freelance',
  location: 'Lisbon, PT'
};

const marcus: UserProfile = {
  id: 'marcus',
  name: 'Marcus Lee',
  handle: 'marcus',
  email: 'marcus@example.com',
  headline: 'Independent brand strategist',
  location: 'London, UK'
};

export const demoFeed: FeedItem[] = [
  {
    id: 'demo-project-1',
    kind: 'project',
    author: alex,
    createdAt: '2026-09-30T12:10:00.000Z',
    title: 'PixelForm v2',
    body: 'Právě jsme dokončili druhou verzi nástroje pro spolupráci designérských týmů. Největší posun je v rychlosti společné práce a jednodušším onboardingu.',
    tags: ['Product Design', 'SaaS', 'Collaboration'],
    likes: 142,
    comments: 28,
    verification: 'verified',
    status: 'completed'
  },
  {
    id: 'demo-project-2',
    kind: 'project',
    author: priya,
    createdAt: '2026-09-29T16:30:00.000Z',
    title: 'Nova AI mobile redesign',
    body: 'Kompletní redesign mobilní aplikace od výzkumu po prototyp. Klient potvrdil dokončení projektu a předání všech výstupů.',
    tags: ['UX Research', 'Mobile', 'Product Design'],
    likes: 96,
    comments: 17,
    verification: 'verified',
    status: 'completed'
  },
  {
    id: 'demo-service-1',
    kind: 'service',
    author: marcus,
    createdAt: '2026-09-29T09:45:00.000Z',
    title: 'Brand strategy sprint',
    body: 'Nabízím dvoutýdenní sprint pro malé produktové týmy: positioning, messaging, vizuální směr a konkrétní plán dalších kroků.',
    tags: ['Branding', 'Strategy', 'Consulting'],
    likes: 51,
    comments: 8,
    verification: 'none',
    status: 'active'
  },
  {
    id: 'demo-job-1',
    kind: 'job',
    author: alex,
    createdAt: '2026-09-28T14:00:00.000Z',
    title: 'Hledáme React developera na spolupráci',
    body: 'Remote spolupráce na 2–3 měsíce. Hledáme člověka, který umí React, TypeScript a zvládne převzít odpovědnost za jednu produktovou část.',
    tags: ['React', 'TypeScript', 'Remote'],
    likes: 34,
    comments: 19,
    verification: 'none',
    status: 'open'
  }
];
