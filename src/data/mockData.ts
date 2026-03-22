export const dummyBookings = [
  {
    bookingId: "BKG-1001",
    userId: "USR-001",
    panditId: "PND-001",
    status: "CONFIRMED",
    date: "2026-03-25T10:00:00Z",
  },
  {
    bookingId: "BKG-1002",
    userId: "USR-002",
    panditId: "PND-002",
    status: "PENDING",
    date: "2026-03-26T14:30:00Z",
  },
  {
    bookingId: "BKG-1003",
    userId: "USR-003",
    panditId: "PND-001",
    status: "CANCELLED",
    date: "2026-03-28T09:00:00Z",
  },
];

export const dummyCoupons = [
  {
    code: "WELCOME10",
    discountPercent: 10,
    status: "ACTIVE",
  },
  {
    code: "FESTIVAL20",
    discountPercent: 20,
    status: "EXPIRED",
  },
];

export const dummyMandirs = [
  {
    id: "MND-001",
    name: "Kashi Vishwanath",
    city: "Varanasi",
    state: "Uttar Pradesh",
    description:
      "One of the most famous Hindu temples dedicated to Lord Shiva.",
  },
  {
    id: "MND-002",
    name: "Somnath Temple",
    city: "Veraval",
    state: "Gujarat",
    description: "First among the twelve Aotirlinga shrines of Shiva.",
  },
];

export const dummyPandits = [
  {
    panditId: "PND-001",
    name: "Sharma Ji",
    phone: "+91-9876543210",
    status: "APPROVED",
  },
  {
    panditId: "PND-002",
    name: "Tiwari Ji",
    phone: "+91-8765432109",
    status: "PENDING",
  },
];

export const dummyPujas = [
  {
    id: "PJ-001",
    name: "Rudrabhishek",
    mandirId: "MND-001",
    amount: 1100,
    isVirtualAvailable: true,
  },
  {
    id: "PJ-002",
    name: "Satyanarayan Katha",
    mandirId: "MND-002",
    amount: 501,
    isVirtualAvailable: false,
  },
];

export const dummyUsers = [
  {
    userId: "USR-001",
    name: "Rahul Kumar",
    email: "rahul@example.com",
    phone: "+91-9999999999",
  },
  {
    userId: "USR-002",
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "+91-8888888888",
  },
  {
    userId: "USR-003",
    name: "Amit Patel",
    email: "amit@example.com",
    phone: "+91-7777777777",
  },
];
