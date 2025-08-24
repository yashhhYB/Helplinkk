export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const REGIONS = [
  'North', 'South', 'East', 'West', 'Central', 'Northeast', 'Northwest', 'Southeast', 'Southwest'
] as const;

export const URGENCY_LEVELS = {
  critical: { label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-50' },
  high: { label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  medium: { label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  low: { label: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' }
} as const;

export const REQUEST_STATUS = {
  pending: { label: 'Pending', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  approved: { label: 'Approved', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  fulfilled: { label: 'Fulfilled', color: 'text-green-600', bgColor: 'bg-green-50' },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-50' },
  cancelled: { label: 'Cancelled', color: 'text-gray-600', bgColor: 'bg-gray-50' }
} as const;

export const DONOR_TYPES = {
  emergency: { label: 'Emergency Donor', description: 'Available for critical situations' },
  bridge: { label: 'Bridge Donor', description: 'Regular voluntary donor' }
} as const;

export const API_ENDPOINTS = {
  auth: '/api/auth',
  users: '/api/users',
  patients: '/api/patients',
  donors: '/api/donors',
  doctors: '/api/doctors',
  requests: '/api/requests',
  notifications: '/api/notifications',
  ml: '/api/ml',
  reports: '/api/reports'
} as const;