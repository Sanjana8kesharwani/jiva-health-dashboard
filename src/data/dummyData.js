export const initialUsers = [
  {
    id: "1",
    name: "Alice Williams",
    email: "alice.williams@email.com",
    phone: "+91 98765 43210",
    role: "Patient",
    status: "Active",
    joinedDate: "1/15/2025",
    lastActive: "4/2/2026",
    appointmentsCount: 5,
    isPrime: false,
    gender: "Female",
    dob: "5/15/1990",
    bloodGroup: "O+",
    avatar: "AW",
    addresses: [
      {
        id: "addr-1",
        type: "Home",
        isDefault: true,
        street: "Flat 301, Sunshine Apartments, MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400001",
        country: "India"
      },
      {
        id: "addr-2",
        type: "Home",
        isDefault: false,
        street: "Flat 301, Sunshine Apartments, MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400001",
        country: "India"
      }
    ],
    familyMembers: [
      { id: "fm-1", name: "John Williams", relationship: "Spouse", dob: "1988-08-12", phone: "+91 98765 43211" },
      { id: "fm-2", name: "Emily Williams", relationship: "Daughter", dob: "2015-04-20", phone: "N/A" },
      { id: "fm-3", name: "Leo Williams", relationship: "Son", dob: "2018-11-02", phone: "N/A" },
      { id: "fm-4", name: "Robert Williams", relationship: "Father", dob: "1960-01-15", phone: "+91 98765 43212" },
      { id: "fm-5", name: "Mary Williams", relationship: "Mother", dob: "1963-06-25", phone: "+91 98765 43213" },
      { id: "fm-6", name: "Sarah Williams", relationship: "Sister", dob: "1992-09-18", phone: "+91 98765 43214" },
      { id: "fm-7", name: "James Williams", relationship: "Brother", dob: "1995-12-05", phone: "+91 98765 43215" },
      { id: "fm-8", name: "Grandpa Williams", relationship: "Grandfather", dob: "1938-03-10", phone: "N/A" },
      { id: "fm-9", name: "Grandma Williams", relationship: "Grandmother", dob: "1942-07-22", phone: "N/A" },
      { id: "fm-10", name: "Arthur Williams", relationship: "Uncle", dob: "1965-02-14", phone: "+91 98765 43216" }
    ],
    orders: [
      {
        id: "ORD-92837",
        date: "4/1/2026",
        items: [
          { name: "Paracetamol 500mg", quantity: 2, price: 150.00 },
          { name: "Amoxicillin 250mg", quantity: 1, price: 1200.00 }
        ],
        amount: 1500.00,
        status: "Delivered",
        shippingAddress: "Flat 301, Sunshine Apartments, MG Road, Mumbai, Maharashtra 400001",
        paymentInfo: "UPI - Paid",
        deliveryStatus: "Delivered successfully on 4/2/2026"
      },
      {
        id: "ORD-91283",
        date: "3/10/2026",
        items: [
          { name: "Multivitamin Tablets", quantity: 3, price: 500.00 },
          { name: "Omega 3 Capsules", quantity: 2, price: 1750.00 }
        ],
        amount: 5000.00,
        status: "Delivered",
        shippingAddress: "Flat 301, Sunshine Apartments, MG Road, Mumbai, Maharashtra 400001",
        paymentInfo: "Visa Card ending in 4242",
        deliveryStatus: "Delivered successfully on 3/12/2026"
      },
      {
        id: "ORD-89472",
        date: "2/15/2026",
        items: [
          { name: "Calcium Supplements", quantity: 4, price: 350.00 },
          { name: "Blood Pressure Monitor", quantity: 1, price: 1600.00 }
        ],
        amount: 3000.00,
        status: "Delivered",
        shippingAddress: "Flat 301, Sunshine Apartments, MG Road, Mumbai, Maharashtra 400001",
        paymentInfo: "Net Banking - HDFC",
        deliveryStatus: "Delivered successfully on 2/17/2026"
      },
      {
        id: "ORD-88123",
        date: "1/20/2026",
        items: [
          { name: "Diabetic Care Powder", quantity: 5, price: 800.00 },
          { name: "Glucometer Test Strips", quantity: 3, price: 1000.00 }
        ],
        amount: 7000.00,
        status: "Delivered",
        shippingAddress: "Flat 301, Sunshine Apartments, MG Road, Mumbai, Maharashtra 400001",
        paymentInfo: "Visa Card ending in 4242",
        deliveryStatus: "Delivered successfully on 1/22/2026"
      },
      {
        id: "ORD-87401",
        date: "12/5/2025",
        items: [
          { name: "Ayurvedic Cough Syrup", quantity: 10, price: 200.00 },
          { name: "Digital Thermometer", quantity: 4, price: 1000.00 }
        ],
        amount: 6000.00,
        status: "Delivered",
        shippingAddress: "Flat 301, Sunshine Apartments, MG Road, Mumbai, Maharashtra 400001",
        paymentInfo: "Visa Card ending in 4242",
        deliveryStatus: "Delivered successfully on 12/7/2025"
      },
      {
        id: "ORD-85124",
        date: "10/12/2025",
        items: [
          { name: "Whey Protein 1kg", quantity: 1, price: 2000.00 }
        ],
        amount: 2000.00,
        status: "Delivered",
        shippingAddress: "Flat 301, Sunshine Apartments, MG Road, Mumbai, Maharashtra 400001",
        paymentInfo: "UPI - Paid",
        deliveryStatus: "Delivered successfully on 10/14/2025"
      }
    ],
    payments: [
      { id: "TXN-92837", date: "4/1/2026", amount: 1500.00, method: "UPI", status: "Success" },
      { id: "TXN-91283", date: "3/10/2026", amount: 5000.00, method: "Card", status: "Success" },
      { id: "TXN-89472", date: "2/15/2026", amount: 3000.00, method: "Net Banking", status: "Success" },
      { id: "TXN-88123", date: "1/20/2026", amount: 7000.00, method: "Card", status: "Success" },
      { id: "TXN-87401", date: "12/5/2025", amount: 6000.00, method: "Card", status: "Success" },
      { id: "TXN-85124", date: "10/12/2025", amount: 2000.00, method: "UPI", status: "Success" }
    ]
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@email.com",
    phone: "+1 555 0199",
    role: "Patient",
    status: "Active",
    joinedDate: "2/10/2025",
    lastActive: "5/12/2026",
    appointmentsCount: 8,
    isPrime: true,
    gender: "Male",
    dob: "9/18/1985",
    bloodGroup: "A+",
    avatar: "BS",
    addresses: [
      {
        id: "addr-3",
        type: "Work",
        isDefault: true,
        street: "456 Tech Boulevard",
        city: "San Jose",
        state: "California",
        zip: "95110",
        country: "USA"
      }
    ],
    familyMembers: [
      { id: "fm-11", name: "Jane Smith", relationship: "Spouse", dob: "1987-10-14", phone: "+1 555 0198" },
      { id: "fm-12", name: "Tommy Smith", relationship: "Son", dob: "2016-07-09", phone: "N/A" }
    ],
    orders: [
      {
        id: "ORD-93021",
        date: "5/10/2026",
        items: [{ name: "Allergy Pills", quantity: 2, price: 400.00 }],
        amount: 800.00,
        status: "Delivered",
        shippingAddress: "456 Tech Boulevard, San Jose, California",
        paymentInfo: "Apple Pay",
        deliveryStatus: "Delivered on 5/11/2026"
      }
    ],
    payments: [
      { id: "TXN-93021", date: "5/10/2026", amount: 800.00, method: "Apple Pay", status: "Success" }
    ]
  },
  {
    id: "3",
    name: "Dr. Charlie Davis",
    email: "charlie.davis@jivahealth.com",
    phone: "+91 98765 00003",
    role: "Doctor",
    status: "Active",
    joinedDate: "6/1/2024",
    lastActive: "5/24/2026",
    appointmentsCount: 24,
    isPrime: false,
    gender: "Male",
    dob: "3/22/1978",
    bloodGroup: "B+",
    avatar: "CD",
    addresses: [
      {
        id: "addr-4",
        type: "Work",
        isDefault: true,
        street: "Jiva Hospital, OPD Cabin 4, Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400050",
        country: "India"
      }
    ],
    familyMembers: [],
    orders: [],
    payments: []
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana.prince@email.com",
    phone: "+1 555 0144",
    role: "Patient",
    status: "Inactive",
    joinedDate: "11/12/2025",
    lastActive: "12/1/2025",
    appointmentsCount: 1,
    isPrime: false,
    gender: "Female",
    dob: "11/25/1993",
    bloodGroup: "O-",
    avatar: "DP",
    addresses: [],
    familyMembers: [
      { id: "fm-13", name: "Hippolyta Prince", relationship: "Mother", dob: "1950-01-01", phone: "N/A" }
    ],
    orders: [
      {
        id: "ORD-84192",
        date: "11/20/2025",
        items: [{ name: "First Aid Kit Pro", quantity: 1, price: 850.00 }],
        amount: 850.00,
        status: "Delivered",
        shippingAddress: "789 Amazonia Way, Themyscira",
        paymentInfo: "Card - Visa",
        deliveryStatus: "Delivered on 11/23/2025"
      }
    ],
    payments: [
      { id: "TXN-84192", date: "11/20/2025", amount: 850.00, method: "Card", status: "Success" }
    ]
  },
  {
    id: "5",
    name: "Dr. Evan Wright",
    email: "evan.wright@jivahealth.com",
    phone: "+1 555 0188",
    role: "Admin",
    status: "Active",
    joinedDate: "8/18/2024",
    lastActive: "5/25/2026",
    appointmentsCount: 0,
    isPrime: true,
    gender: "Male",
    dob: "7/12/1982",
    bloodGroup: "AB+",
    avatar: "EW",
    addresses: [
      {
        id: "addr-5",
        type: "Work",
        isDefault: true,
        street: "Jiva HQ, Level 8, BKC",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400051",
        country: "India"
      }
    ],
    familyMembers: [
      { id: "fm-14", name: "Clara Wright", relationship: "Spouse", dob: "1985-04-18", phone: "+1 555 0189" }
    ],
    orders: [
      {
        id: "ORD-90212",
        date: "2/20/2026",
        items: [{ name: "Ergonomic Office Chair", quantity: 1, price: 4500.00 }],
        amount: 4500.00,
        status: "Delivered",
        shippingAddress: "Jiva HQ, Level 8, BKC, Mumbai",
        paymentInfo: "Company Corporate Card",
        deliveryStatus: "Delivered on 2/22/2026"
      }
    ],
    payments: [
      { id: "TXN-90212", date: "2/20/2026", amount: 4500.00, method: "Card", status: "Success" }
    ]
  },
  {
    id: "6",
    name: "Fiona Gallagher",
    email: "fiona.g@email.com",
    phone: "+1 555 0167",
    role: "Patient",
    status: "Active",
    joinedDate: "3/20/2025",
    lastActive: "5/20/2026",
    appointmentsCount: 4,
    isPrime: false,
    gender: "Female",
    dob: "6/14/1995",
    bloodGroup: "B-",
    avatar: "FG",
    addresses: [
      {
        id: "addr-6",
        type: "Home",
        isDefault: true,
        street: "2110 N Hoyne Ave",
        city: "Chicago",
        state: "Illinois",
        zip: "60647",
        country: "USA"
      }
    ],
    familyMembers: [
      { id: "fm-15", name: "Lip Gallagher", relationship: "Brother", dob: "1997-03-24", phone: "N/A" },
      { id: "fm-16", name: "Ian Gallagher", relationship: "Brother", dob: "1999-05-10", phone: "N/A" },
      { id: "fm-17", name: "Debbie Gallagher", relationship: "Sister", dob: "2001-08-12", phone: "N/A" },
      { id: "fm-18", name: "Carl Gallagher", relationship: "Brother", dob: "2003-10-02", phone: "N/A" }
    ],
    orders: [
      {
        id: "ORD-90111",
        date: "3/25/2026",
        items: [
          { name: "Antiseptic Cream", quantity: 3, price: 400.00 },
          { name: "Pain Relief Spray", quantity: 2, price: 2500.00 }
        ],
        amount: 6200.00,
        status: "Delivered",
        shippingAddress: "2110 N Hoyne Ave, Chicago, IL",
        paymentInfo: "Cash on Delivery",
        deliveryStatus: "Delivered on 3/28/2026"
      }
    ],
    payments: [
      { id: "TXN-90111", date: "3/25/2026", amount: 6200.00, method: "Cash", status: "Success" }
    ]
  },
  {
    id: "7",
    name: "George Green",
    email: "george.green@email.com",
    phone: "+1 555 0107",
    role: "Patient",
    status: "Inactive",
    joinedDate: "4/5/2025",
    lastActive: "4/10/2025",
    appointmentsCount: 0,
    isPrime: false,
    gender: "Male",
    dob: "2/10/1968",
    bloodGroup: "A-",
    avatar: "GG",
    addresses: [],
    familyMembers: [],
    orders: [],
    payments: []
  }
];

export const mockDashboardStats = {
  activeConsultations: 12,
  labBookingsToday: 4,
  medicineOrdersPending: 3,
  ambulanceAvailable: 5
};
