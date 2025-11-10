import {
  Appointment,
  AppointmentStatus,
  PersonalInformation,
  ServiceInformation,
} from '../models/Appointment';
import { Feedback, Sentiment } from '../models/Feedback';
import { Schedule } from '../models/Schedule';

export const SAMPLE_FEEDBACKS: Feedback[] = [
  {
    id: 'fb1',
    name: 'Christopher Johnathon',
    profile: 'https://avatar.iran.liara.run/public/boy',
    uid: 'user001',
    sentiment: Sentiment.VerySatisfied,
    comment: 'Brilliant presentation! Really well done.',
    allowFollowUp: true,
    submittedAt: new Date('2023-04-01'),
  },
  {
    id: 'fb2',
    name: 'Maria Gonzales',
    profile: 'https://avatar.iran.liara.run/public/girl',
    uid: 'user002',
    sentiment: Sentiment.Satisfied,
    comment: 'Loved the new dashboard layout. Very intuitive.',
    allowFollowUp: false,
    submittedAt: new Date('2023-04-03'),
  },
  {
    id: 'fb3',
    name: 'Liam Tan',
    profile: 'https://avatar.iran.liara.run/public/boy',
    uid: 'user003',
    sentiment: Sentiment.Neutral,
    comment: 'The system works fine, but could be faster.',
    allowFollowUp: true,
    submittedAt: new Date('2023-04-05'),
  },
  {
    id: 'fb4',
    name: 'Ayesha Malik',
    profile: 'https://avatar.iran.liara.run/public/girl',
    uid: 'user004',
    sentiment: Sentiment.Dissatisfied,
    comment: 'Had trouble logging in multiple times.',
    allowFollowUp: false,
    submittedAt: new Date('2023-04-06'),
  },
  {
    id: 'fb5',
    name: 'Jared Cruz',
    profile: 'https://avatar.iran.liara.run/public/boy',
    uid: 'user005',
    sentiment: Sentiment.VerySatisfied,
    comment: 'Support team was very responsive. Thanks!',
    allowFollowUp: true,
    submittedAt: new Date('2023-04-07'),
  },
  {
    id: 'fb6',
    name: 'Sofia Reyes',
    profile: 'https://avatar.iran.liara.run/public/girl',
    uid: 'user006',
    sentiment: Sentiment.Satisfied,
    comment: 'Looking forward to the next update.',
    allowFollowUp: false,
    submittedAt: new Date('2023-04-08'),
  },
  {
    id: 'fb7',
    name: 'Nathaniel Blake',
    profile: 'https://avatar.iran.liara.run/public/boy',
    uid: 'user007',
    sentiment: Sentiment.VeryDissatisfied,
    comment: 'Some features are buggy on mobile.',
    allowFollowUp: true,
    submittedAt: new Date('2023-04-09'),
  },
  {
    id: 'fb8',
    name: 'Emily Zhang',
    profile: 'https://avatar.iran.liara.run/public/girl',
    uid: 'user008',
    sentiment: Sentiment.VerySatisfied,
    comment: 'Great job on the analytics module!',
    allowFollowUp: true,
    submittedAt: new Date('2023-04-10'),
  },
  {
    id: 'fb9',
    name: 'Carlos Mendoza',
    profile: 'https://avatar.iran.liara.run/public/boy',
    uid: 'user009',
    sentiment: Sentiment.Neutral,
    comment: 'Still learning the system, but it’s okay so far.',
    allowFollowUp: false,
    submittedAt: new Date('2023-04-11'),
  },
  {
    id: 'fb10',
    name: 'Hannah Lee',
    profile: 'https://avatar.iran.liara.run/public/girl',
    uid: 'user010',
    sentiment: Sentiment.Satisfied,
    comment: 'Very clean UI and easy to navigate.',
    allowFollowUp: true,
    submittedAt: new Date('2023-04-12'),
  },
];
export const SAMPLE_SCHEDULES: Schedule[] = [
  {
    id: '1',
    date: '2025-11-15',
    time: '09:00 AM',
    slots: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    date: '2025-11-16',
    time: '11:00 AM',
    slots: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    date: '2025-11-18',
    time: '10:00 AM',
    slots: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    date: '2025-11-20',
    time: '02:00 PM',
    slots: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    date: '2025-11-22',
    time: '09:30 AM',
    slots: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    date: '2025-11-25',
    time: '01:00 PM',
    slots: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    date: '2025-12-01',
    time: '08:00 AM',
    slots: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    date: '2025-12-05',
    time: '12:00 PM',
    slots: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '9',
    date: '2025-12-10',
    time: '10:30 AM',
    slots: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '10',
    date: '2025-12-15',
    time: '03:00 PM',
    slots: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function generateAppointmentId(length: number = 11): string {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += Math.floor(Math.random() * 10);
  }
  return id;
}

// TESDA sample services
const SERVICES: ServiceInformation[] = [
  {
    id: 'svc1',
    name: 'Bread & Pastry Production NC II',
    image: 'assets/services/bread_pastry.png',
  },
  {
    id: 'svc2',
    name: 'Electrical Installation & Maintenance NC II',
    image: 'assets/services/electrical_installation.png',
  },
  {
    id: 'svc3',
    name: 'Automotive Servicing NC II',
    image: 'assets/services/automotive_servicing.png',
  },
  {
    id: 'svc4',
    name: 'Caregiving NC II',
    image: 'assets/services/caregiving.png',
  },
  {
    id: 'svc5',
    name: 'Beauty Care (Nail Care) Services NC II',
    image: 'assets/services/beauty_care_nail.png',
  },
  {
    id: 'svc6',
    name: 'Housekeeping NC II',
    image: 'assets/services/housekeeping.png',
  },
  {
    id: 'svc7',
    name: 'Front Office Services NC II',
    image: 'assets/services/front_office.png',
  },
  { id: 'svc8', name: 'Plumbing NC II', image: 'assets/services/plumbing.png' },
  {
    id: 'svc9',
    name: 'Computer System Servicing NC II',
    image: 'assets/services/computer_system_servicing.png',
  },
  {
    id: 'svc10',
    name: 'Food & Beverage Services NC II',
    image: 'assets/services/food_beverage_services.png',
  },
];

// Sample personal info
const NAMES: PersonalInformation[] = [
  { name: 'John Doe', email: 'john@example.com', contact: '09123456789' },
  { name: 'Jane Smith', email: 'jane@example.com', contact: '09987654321' },
  { name: 'Alice Johnson', email: 'alice@example.com', contact: '09234567890' },
  { name: 'Bob Williams', email: 'bob@example.com', contact: '09345678901' },
];

// Random date generator (Nov 15 → Dec 31, 2025)
function randomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Random time generator (8AM–3PM)
function randomTime(): string {
  const hours = Math.floor(Math.random() * 8) + 8;
  const minutes = Math.random() < 0.5 ? '00' : '30';
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHour = hours > 12 ? hours - 12 : hours;
  return `${formattedHour}:${minutes} ${period}`;
}

// Generate 10 sample appointments
export const SAMPLE_APPOINTMENTS: Appointment[] = Array.from({
  length: 10,
}).map((_, i) => ({
  id: generateAppointmentId(),
  uid: 'aXt1APcHQbddczQ4Cit4bfdMU5l2', // same UID
  personalInformation: NAMES[i % NAMES.length],
  serviceInformation: SERVICES[i % SERVICES.length],
  date: randomDate(new Date(2025, 10, 15), new Date(2025, 11, 31)),
  time: randomTime(),
  location: `Clinic Room ${Math.floor(Math.random() * 5) + 1}`,
  status:
    Object.values(AppointmentStatus)[
      Math.floor(Math.random() * Object.values(AppointmentStatus).length)
    ],
  notes: Math.random() < 0.5 ? 'Bring previous medical records.' : '',
  createdAt: new Date(),
  updatedAt: new Date(),
}));
