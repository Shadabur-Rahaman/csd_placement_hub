// Firestore Collection Schema

/*
Collection: categories
{
  id: string (auto-generated),
  name: string,
  description: string,
  icon: string,
  color: string,
  createdAt: timestamp,
  updatedAt: timestamp
}

Collection: services
{
  id: string (auto-generated),
  name: string,
  description: string,
  categoryId: string (reference to categories collection),
  basePrice: number,
  images: array of strings (URLs),
  features: array of strings,
  customizationOptions: array of {
    name: string,
    description: string,
    price: number
  },
  locations: array of strings,
  timeSlots: array of strings,
  duration: string,
  rating: number,
  reviewCount: number,
  discount: number (optional),
  createdAt: timestamp,
  updatedAt: timestamp
}

Collection: bookings
{
  id: string (auto-generated),
  userId: string (reference to users collection),
  serviceId: string (reference to services collection),
  status: string (enum: 'pending', 'confirmed', 'completed', 'cancelled'),
  date: timestamp,
  time: string,
  location: string,
  addOns: array of {
    name: string,
    price: number
  },
  basePrice: number,
  addOnsTotal: number,
  totalPrice: number,
  paymentStatus: string (enum: 'pending', 'paid', 'refunded'),
  paymentId: string,
  specialInstructions: string,
  createdAt: timestamp,
  updatedAt: timestamp
}

Collection: reviews
{
  id: string (auto-generated),
  userId: string (reference to users collection),
  serviceId: string (reference to services collection),
  bookingId: string (reference to bookings collection),
  rating: number,
  comment: string,
  images: array of strings (URLs),
  createdAt: timestamp,
  updatedAt: timestamp
}

Collection: users
{
  id: string (auto-generated),
  email: string,
  displayName: string,
  phoneNumber: string,
  role: string (enum: 'user', 'admin'),
  addresses: array of {
    type: string,
    address: string,
    city: string,
    state: string,
    pincode: string
  },
  createdAt: timestamp,
  updatedAt: timestamp
}

Collection: coupons
{
  id: string (auto-generated),
  code: string,
  description: string,
  discountType: string (enum: 'percentage', 'fixed'),
  discountValue: number,
  minOrderValue: number,
  maxDiscount: number,
  validFrom: timestamp,
  validUntil: timestamp,
  usageLimit: number,
  usageCount: number,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
*/

// Firestore Security Rules
export const securityRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Common functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Categories
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Services
    match /services/{serviceId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Bookings
    match /bookings/{bookingId} {
      allow create: if isAuthenticated();
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
      allow update: if isAuthenticated() && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
      allow delete: if isAdmin();
    }

    // Reviews
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated() && exists(
        /databases/$(database)/documents/bookings/$(request.resource.data.bookingId)
      );
      allow update, delete: if isAuthenticated() && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
    }

    // Users
    match /users/{userId} {
      allow read: if isAuthenticated() && (
        userId == request.auth.uid || isAdmin()
      );
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (
        userId == request.auth.uid || isAdmin()
      );
      allow delete: if isAdmin();
    }

    // Coupons
    match /coupons/{couponId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
`; 