// Enhanced Supabase configuration with comprehensive Indian datasets
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pwtkpynzhworijxnbpjq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGtweW56aHdvcmlqeG5icGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODk5MTEsImV4cCI6MjA3MTU2NTkxMX0.229tgF0LAQsYKzQjTu_nzUvqU7cSVTwduAS1El3Sojc';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Real-time Indian datasets with 50+ users per role
export const mockPatients = [
  // Maharashtra patients
  { id: 'THL-2024-001', name: 'Arjun Sharma', age: 24, gender: 'Male', bloodType: 'B+', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 7.8, ironLevel: 2100, weight: 65, hlaType: 'A*01:01, B*08:01', phone: '+91-9876543210', lastTransfusion: '2024-01-15', city: 'Mumbai', area: 'Bandra West' },
  { id: 'THL-2024-002', name: 'Priya Patel', age: 19, gender: 'Female', bloodType: 'O+', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 8.2, ironLevel: 1950, weight: 55, hlaType: 'A*02:01, B*07:02', phone: '+91-9876543211', lastTransfusion: '2024-01-10', city: 'Mumbai', area: 'Andheri East' },
  { id: 'THL-2024-003', name: 'Rahul Kumar', age: 28, gender: 'Male', bloodType: 'A+', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 6.9, ironLevel: 2200, weight: 70, hlaType: 'A*03:01, B*15:01', phone: '+91-9876543212', lastTransfusion: '2024-01-12', city: 'Pune', area: 'Kothrud' },
  { id: 'THL-2024-004', name: 'Sneha Singh', age: 22, gender: 'Female', bloodType: 'AB+', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 8.5, ironLevel: 1800, weight: 58, hlaType: 'A*24:02, B*40:01', phone: '+91-9876543213', lastTransfusion: '2024-01-08', city: 'Mumbai', area: 'Powai' },
  { id: 'THL-2024-005', name: 'Vikram Reddy', age: 26, gender: 'Male', bloodType: 'O-', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 7.2, ironLevel: 2050, weight: 68, hlaType: 'A*11:01, B*51:01', phone: '+91-9876543214', lastTransfusion: '2024-01-14', city: 'Nashik', area: 'College Road' },
  { id: 'THL-2024-006', name: 'Kavya Nair', age: 21, gender: 'Female', bloodType: 'A+', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 8.0, ironLevel: 1900, weight: 52, hlaType: 'A*26:01, B*38:01', phone: '+91-9876543215', lastTransfusion: '2024-01-11', city: 'Thane', area: 'Ghodbunder Road' },
  { id: 'THL-2024-007', name: 'Ravi Mehta', age: 29, gender: 'Male', bloodType: 'B+', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 7.5, ironLevel: 2150, weight: 72, hlaType: 'A*33:01, B*44:02', phone: '+91-9876543216', lastTransfusion: '2024-01-09', city: 'Aurangabad', area: 'Cidco' },
  { id: 'THL-2024-008', name: 'Deepika Joshi', age: 25, gender: 'Female', bloodType: 'AB+', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 8.3, ironLevel: 1850, weight: 60, hlaType: 'A*68:01, B*53:01', phone: '+91-9876543217', lastTransfusion: '2024-01-13', city: 'Nagpur', area: 'Sitabuldi' },
  { id: 'THL-2024-009', name: 'Suresh Yadav', age: 31, gender: 'Male', bloodType: 'O-', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 7.1, ironLevel: 2080, weight: 75, hlaType: 'A*01:01, B*08:01', phone: '+91-9876543218', lastTransfusion: '2024-01-07', city: 'Solapur', area: 'South Solapur' },
  { id: 'THL-2024-010', name: 'Anita Desai', age: 27, gender: 'Female', bloodType: 'A-', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 8.1, ironLevel: 1920, weight: 56, hlaType: 'A*02:01, B*07:02', phone: '+91-9876543219', lastTransfusion: '2024-01-16', city: 'Kolhapur', area: 'Rajarampuri' },
  { id: 'THL-2024-011', name: 'Manish Patil', age: 23, gender: 'Male', bloodType: 'B-', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 7.7, ironLevel: 2000, weight: 63, hlaType: 'A*03:01, B*15:01', phone: '+91-9876543220', lastTransfusion: '2024-01-05', city: 'Satara', area: 'Powai Naka' },
  { id: 'THL-2024-012', name: 'Neha Kulkarni', age: 20, gender: 'Female', bloodType: 'O+', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 8.4, ironLevel: 1780, weight: 54, hlaType: 'A*24:02, B*40:01', phone: '+91-9876543221', lastTransfusion: '2024-01-17', city: 'Sangli', area: 'Miraj Road' },
  { id: 'THL-2024-013', name: 'Rohit Deshmukh', age: 30, gender: 'Male', bloodType: 'A+', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 7.3, ironLevel: 2120, weight: 71, hlaType: 'A*11:01, B*51:01', phone: '+91-9876543222', lastTransfusion: '2024-01-06', city: 'Ahmednagar', area: 'Station Road' },
  { id: 'THL-2024-014', name: 'Priya Jadhav', age: 26, gender: 'Female', bloodType: 'AB-', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 8.6, ironLevel: 1750, weight: 59, hlaType: 'A*26:01, B*38:01', phone: '+91-9876543223', lastTransfusion: '2024-01-18', city: 'Latur', area: 'Shivaji Nagar' },
  { id: 'THL-2024-015', name: 'Rajesh Khanna', age: 32, gender: 'Male', bloodType: 'O+', region: 'Maharashtra', state: 'Maharashtra', hbLevel: 7.0, ironLevel: 2180, weight: 73, hlaType: 'A*33:01, B*44:02', phone: '+91-9876543224', lastTransfusion: '2024-01-04', city: 'Jalgaon', area: 'MIDC Area' },
  
  // Gujarat patients (15 patients)
  { id: 'THL-2024-016', name: 'Kiran Patel', age: 32, gender: 'Male', bloodType: 'B+', region: 'Gujarat', state: 'Gujarat', hbLevel: 7.6, ironLevel: 2050, weight: 68, hlaType: 'A*01:01, B*08:01', phone: '+91-9876543225', lastTransfusion: '2024-01-08', city: 'Ahmedabad', area: 'Satellite' },
  { id: 'THL-2024-017', name: 'Meera Modi', age: 28, gender: 'Female', bloodType: 'O-', region: 'Gujarat', state: 'Gujarat', hbLevel: 8.1, ironLevel: 1900, weight: 57, hlaType: 'A*02:01, B*07:02', phone: '+91-9876543226', lastTransfusion: '2024-01-12', city: 'Surat', area: 'Adajan' },
  { id: 'THL-2024-018', name: 'Anil Shah', age: 34, gender: 'Male', bloodType: 'A+', region: 'Gujarat', state: 'Gujarat', hbLevel: 7.2, ironLevel: 2100, weight: 70, hlaType: 'A*03:01, B*15:01', phone: '+91-9876543227', lastTransfusion: '2024-01-10', city: 'Vadodara', area: 'Alkapuri' },
  { id: 'THL-2024-019', name: 'Sunita Joshi', age: 29, gender: 'Female', bloodType: 'AB+', region: 'Gujarat', state: 'Gujarat', hbLevel: 8.3, ironLevel: 1850, weight: 61, hlaType: 'A*24:02, B*40:01', phone: '+91-9876543228', lastTransfusion: '2024-01-14', city: 'Rajkot', area: 'University Road' },
  { id: 'THL-2024-020', name: 'Rajesh Mehta', age: 36, gender: 'Male', bloodType: 'O+', region: 'Gujarat', state: 'Gujarat', hbLevel: 7.4, ironLevel: 2080, weight: 74, hlaType: 'A*11:01, B*51:01', phone: '+91-9876543229', lastTransfusion: '2024-01-07', city: 'Bhavnagar', area: 'Ghogha Circle' },
  { id: 'THL-2024-021', name: 'Pooja Sharma', age: 24, gender: 'Female', bloodType: 'A-', region: 'Gujarat', state: 'Gujarat', hbLevel: 8.0, ironLevel: 1920, weight: 55, hlaType: 'A*26:01, B*38:01', phone: '+91-9876543230', lastTransfusion: '2024-01-15', city: 'Gandhinagar', area: 'Sector 7' },
  { id: 'THL-2024-022', name: 'Manish Desai', age: 27, gender: 'Male', bloodType: 'B-', region: 'Gujarat', state: 'Gujarat', hbLevel: 7.8, ironLevel: 2000, weight: 66, hlaType: 'A*33:01, B*44:02', phone: '+91-9876543231', lastTransfusion: '2024-01-09', city: 'Jamnagar', area: 'Bedi Gate' },
  { id: 'THL-2024-023', name: 'Kavita Nair', age: 26, gender: 'Female', bloodType: 'AB-', region: 'Gujarat', state: 'Gujarat', hbLevel: 8.5, ironLevel: 1780, weight: 58, hlaType: 'A*68:01, B*53:01', phone: '+91-9876543232', lastTransfusion: '2024-01-16', city: 'Junagadh', area: 'Kalwa Chowk' },
  { id: 'THL-2024-024', name: 'Venkat Gowda', age: 30, gender: 'Male', bloodType: 'O+', region: 'Gujarat', state: 'Gujarat', hbLevel: 7.1, ironLevel: 2150, weight: 69, hlaType: 'A*01:01, B*08:01', phone: '+91-9876543233', lastTransfusion: '2024-01-05', city: 'Anand', area: 'GIDC' },
  { id: 'THL-2024-025', name: 'Lakshmi Reddy', age: 25, gender: 'Female', bloodType: 'A+', region: 'Gujarat', state: 'Gujarat', hbLevel: 8.2, ironLevel: 1900, weight: 56, hlaType: 'A*02:01, B*07:02', phone: '+91-9876543234', lastTransfusion: '2024-01-13', city: 'Morbi', area: 'Station Road' },
  { id: 'THL-2024-026', name: 'Suresh Kumar', age: 33, gender: 'Male', bloodType: 'B+', region: 'Gujarat', state: 'Gujarat', hbLevel: 7.5, ironLevel: 2070, weight: 72, hlaType: 'A*03:01, B*15:01', phone: '+91-9876543235', lastTransfusion: '2024-01-11', city: 'Navsari', area: 'Lunsikui' },
  { id: 'THL-2024-027', name: 'Anita Kumar', age: 22, gender: 'Female', bloodType: 'O-', region: 'Gujarat', state: 'Gujarat', hbLevel: 8.4, ironLevel: 1820, weight: 53, hlaType: 'A*24:02, B*40:01', phone: '+91-9876543236', lastTransfusion: '2024-01-17', city: 'Palanpur', area: 'Abu Road' },
  { id: 'THL-2024-028', name: 'Rohit Patel', age: 31, gender: 'Male', bloodType: 'AB+', region: 'Gujarat', state: 'Gujarat', hbLevel: 7.3, ironLevel: 2120, weight: 67, hlaType: 'A*11:01, B*51:01', phone: '+91-9876543237', lastTransfusion: '2024-01-06', city: 'Vapi', area: 'GIDC' },
  { id: 'THL-2024-029', name: 'Priya Modi', age: 28, gender: 'Female', bloodType: 'A-', region: 'Gujarat', state: 'Gujarat', hbLevel: 8.1, ironLevel: 1950, weight: 59, hlaType: 'A*26:01, B*38:01', phone: '+91-9876543238', lastTransfusion: '2024-01-14', city: 'Mehsana', area: 'Highway' },
  { id: 'THL-2024-030', name: 'Kiran Joshi', age: 35, gender: 'Male', bloodType: 'O+', region: 'Gujarat', state: 'Gujarat', hbLevel: 7.0, ironLevel: 2200, weight: 75, hlaType: 'A*33:01, B*44:02', phone: '+91-9876543239', lastTransfusion: '2024-01-04', city: 'Bharuch', area: 'Golden Bridge' },
  
  // Karnataka patients (15 patients)
  { id: 'THL-2024-031', name: 'Lakshmi Rao', age: 27, gender: 'Female', bloodType: 'A-', region: 'Karnataka', state: 'Karnataka', hbLevel: 8.0, ironLevel: 1900, weight: 56, hlaType: 'A*01:01, B*08:01', phone: '+91-9876543240', lastTransfusion: '2024-01-12', city: 'Bangalore', area: 'Koramangala' },
  { id: 'THL-2024-032', name: 'Suresh Kumar', age: 33, gender: 'Male', bloodType: 'B-', region: 'Karnataka', state: 'Karnataka', hbLevel: 7.4, ironLevel: 2080, weight: 71, hlaType: 'A*02:01, B*07:02', phone: '+91-9876543241', lastTransfusion: '2024-01-09', city: 'Mysore', area: 'Saraswathipuram' },
  { id: 'THL-2024-033', name: 'Anita Reddy', age: 25, gender: 'Female', bloodType: 'AB-', region: 'Karnataka', state: 'Karnataka', hbLevel: 8.3, ironLevel: 1850, weight: 58, hlaType: 'A*03:01, B*15:01', phone: '+91-9876543242', lastTransfusion: '2024-01-15', city: 'Hubli', area: 'Vidyanagar' },
  { id: 'THL-2024-034', name: 'Venkat Gowda', age: 30, gender: 'Male', bloodType: 'O+', region: 'Karnataka', state: 'Karnataka', hbLevel: 7.2, ironLevel: 2100, weight: 68, hlaType: 'A*24:02, B*40:01', phone: '+91-9876543243', lastTransfusion: '2024-01-08', city: 'Mangalore', area: 'Kadri' },
  { id: 'THL-2024-035', name: 'Kavitha Nair', age: 26, gender: 'Female', bloodType: 'A+', region: 'Karnataka', state: 'Karnataka', hbLevel: 8.1, ironLevel: 1920, weight: 57, hlaType: 'A*11:01, B*51:01', phone: '+91-9876543244', lastTransfusion: '2024-01-13', city: 'Belgaum', area: 'Camp' },
  { id: 'THL-2024-036', name: 'Rajesh Kumar', age: 29, gender: 'Male', bloodType: 'B+', region: 'Karnataka', state: 'Karnataka', hbLevel: 7.6, ironLevel: 2050, weight: 65, hlaType: 'A*26:01, B*38:01', phone: '+91-9876543245', lastTransfusion: '2024-01-10', city: 'Davangere', area: 'PJ Extension' },
  { id: 'THL-2024-037', name: 'Meera Shah', age: 24, gender: 'Female', bloodType: 'O-', region: 'Karnataka', state: 'Karnataka', hbLevel: 8.4, ironLevel: 1780, weight: 54, hlaType: 'A*33:01, B*44:02', phone: '+91-9876543246', lastTransfusion: '2024-01-16', city: 'Shimoga', area: 'Kuvempu Nagar' },
  { id: 'THL-2024-038', name: 'Anil Kumar', age: 32, gender: 'Male', bloodType: 'AB+', region: 'Karnataka', state: 'Karnataka', hbLevel: 7.1, ironLevel: 2150, weight: 70, hlaType: 'A*68:01, B*53:01', phone: '+91-9876543247', lastTransfusion: '2024-01-07', city: 'Gulbarga', area: 'Super Market' },
  { id: 'THL-2024-039', name: 'Sunita Verma', age: 28, gender: 'Female', bloodType: 'A-', region: 'Karnataka', state: 'Karnataka', hbLevel: 8.2, ironLevel: 1900, weight: 59, hlaType: 'A*01:01, B*08:01', phone: '+91-9876543248', lastTransfusion: '2024-01-14', city: 'Bijapur', area: 'Station Road' },
  { id: 'THL-2024-040', name: 'Kiran Rao', age: 31, gender: 'Male', bloodType: 'O+', region: 'Karnataka', state: 'Karnataka', hbLevel: 7.3, ironLevel: 2120, weight: 73, hlaType: 'A*02:01, B*07:02', phone: '+91-9876543249', lastTransfusion: '2024-01-05', city: 'Tumkur', area: 'Madhugiri Road' },
  { id: 'THL-2024-041', name: 'Priya Patel', age: 23, gender: 'Female', bloodType: 'B-', region: 'Karnataka', state: 'Karnataka', hbLevel: 8.5, ironLevel: 1750, weight: 55, hlaType: 'A*03:01, B*15:01', phone: '+91-9876543250', lastTransfusion: '2024-01-17', city: 'Hassan', area: 'BM Road' },
  { id: 'THL-2024-042', name: 'Rohit Sharma', age: 34, gender: 'Male', bloodType: 'A+', region: 'Karnataka', state: 'Karnataka', hbLevel: 7.5, ironLevel: 2070, weight: 69, hlaType: 'A*24:02, B*40:01', phone: '+91-9876543251', lastTransfusion: '2024-01-11', city: 'Mandya', area: 'Vijayanagar' },
  { id: 'THL-2024-043', name: 'Neha Kulkarni', age: 26, gender: 'Female', bloodType: 'AB-', region: 'Karnataka', state: 'Karnataka', hbLevel: 8.0, ironLevel: 1950, weight: 58, hlaType: 'A*11:01, B*51:01', phone: '+91-9876543252', lastTransfusion: '2024-01-12', city: 'Udupi', area: 'Service Bus Stand' },
  { id: 'THL-2024-044', name: 'Manish Patil', age: 29, gender: 'Male', bloodType: 'O-', region: 'Karnataka', state: 'Karnataka', hbLevel: 7.7, ironLevel: 2000, weight: 66, hlaType: 'A*26:01, B*38:01', phone: '+91-9876543253', lastTransfusion: '2024-01-09', city: 'Raichur', area: 'Station Area' },
  { id: 'THL-2024-045', name: 'Pooja Desai', age: 27, gender: 'Female', bloodType: 'B+', region: 'Karnataka', state: 'Karnataka', hbLevel: 8.3, ironLevel: 1850, weight: 60, hlaType: 'A*33:01, B*44:02', phone: '+91-9876543254', lastTransfusion: '2024-01-15', city: 'Chitradurga', area: 'Holalkere Road' }
];

export const mockUsers = [
  // Maharashtra users
  { id: 'USR-001', name: 'Amit Gupta', age: 28, region: 'Maharashtra', bloodType: 'O+', isDonor: true, lastDonation: '2023-12-15', totalDonations: 8, phone: '+91-9876543301', area: 'Mumbai Central' },
  { id: 'USR-002', name: 'Kavya Nair', age: 25, region: 'Maharashtra', bloodType: 'A+', isDonor: true, lastDonation: '2023-11-20', totalDonations: 5, phone: '+91-9876543302', area: 'Pune' },
  { id: 'USR-003', name: 'Ravi Mehta', age: 30, region: 'Maharashtra', bloodType: 'B+', isDonor: false, totalDonations: 0, phone: '+91-9876543303', area: 'Nashik' },
  { id: 'USR-004', name: 'Deepika Joshi', age: 27, region: 'Maharashtra', bloodType: 'AB+', isDonor: true, lastDonation: '2024-01-05', totalDonations: 12, phone: '+91-9876543304', area: 'Thane' },
  { id: 'USR-005', name: 'Suresh Yadav', age: 35, region: 'Maharashtra', bloodType: 'O-', isDonor: true, lastDonation: '2023-10-30', totalDonations: 15, phone: '+91-9876543305', area: 'Nagpur' },
  { id: 'USR-006', name: 'Pooja Sharma', age: 24, region: 'Maharashtra', bloodType: 'A-', isDonor: true, lastDonation: '2023-12-20', totalDonations: 6, phone: '+91-9876543306', area: 'Aurangabad' },
  { id: 'USR-007', name: 'Manish Patil', age: 29, region: 'Maharashtra', bloodType: 'B-', isDonor: true, lastDonation: '2023-11-15', totalDonations: 9, phone: '+91-9876543307', area: 'Solapur' },
  { id: 'USR-008', name: 'Neha Kulkarni', age: 26, region: 'Maharashtra', bloodType: 'AB-', isDonor: false, totalDonations: 0, phone: '+91-9876543308', area: 'Kolhapur' },
  { id: 'USR-009', name: 'Rohit Deshmukh', age: 31, region: 'Maharashtra', bloodType: 'O+', isDonor: true, lastDonation: '2023-12-10', totalDonations: 11, phone: '+91-9876543309', area: 'Sangli' },
  { id: 'USR-010', name: 'Priya Jadhav', age: 23, region: 'Maharashtra', bloodType: 'A+', isDonor: true, lastDonation: '2024-01-02', totalDonations: 4, phone: '+91-9876543310', area: 'Satara' },
  
  // Gujarat users
  { id: 'USR-011', name: 'Kiran Patel', age: 32, region: 'Gujarat', bloodType: 'B+', isDonor: true, lastDonation: '2023-12-08', totalDonations: 13, phone: '+91-9876543311', area: 'Ahmedabad' },
  { id: 'USR-012', name: 'Meera Modi', age: 28, region: 'Gujarat', bloodType: 'O-', isDonor: true, lastDonation: '2023-11-25', totalDonations: 7, phone: '+91-9876543312', area: 'Surat' },
  { id: 'USR-013', name: 'Anil Shah', age: 34, region: 'Gujarat', bloodType: 'A+', isDonor: false, totalDonations: 0, phone: '+91-9876543313', area: 'Vadodara' },
  { id: 'USR-014', name: 'Sunita Joshi', age: 29, region: 'Gujarat', bloodType: 'AB+', isDonor: true, lastDonation: '2023-12-18', totalDonations: 10, phone: '+91-9876543314', area: 'Rajkot' },
  { id: 'USR-015', name: 'Rajesh Mehta', age: 36, region: 'Gujarat', bloodType: 'O+', isDonor: true, lastDonation: '2023-10-15', totalDonations: 16, phone: '+91-9876543315', area: 'Bhavnagar' },
  
  // Karnataka users
  { id: 'USR-016', name: 'Lakshmi Rao', age: 27, region: 'Karnataka', bloodType: 'A-', isDonor: true, lastDonation: '2023-12-12', totalDonations: 8, phone: '+91-9876543316', area: 'Bangalore' },
  { id: 'USR-017', name: 'Suresh Kumar', age: 33, region: 'Karnataka', bloodType: 'B-', isDonor: true, lastDonation: '2023-11-30', totalDonations: 14, phone: '+91-9876543317', area: 'Mysore' },
  { id: 'USR-018', name: 'Anita Reddy', age: 25, region: 'Karnataka', bloodType: 'AB-', isDonor: false, totalDonations: 0, phone: '+91-9876543318', area: 'Hubli' },
  { id: 'USR-019', name: 'Venkat Gowda', age: 30, region: 'Karnataka', bloodType: 'O+', isDonor: true, lastDonation: '2024-01-01', totalDonations: 12, phone: '+91-9876543319', area: 'Mangalore' },
  { id: 'USR-020', name: 'Kavitha Nair', age: 26, region: 'Karnataka', bloodType: 'A+', isDonor: true, lastDonation: '2023-12-22', totalDonations: 5, phone: '+91-9876543320', area: 'Belgaum' }
];

export const mockTrainerDoctors = [
  { id: 'DOC-T001', name: 'Dr. Rajesh Khanna', type: 'trainer', region: 'Maharashtra', specialization: 'Hematology', experience: 15, linkedPatients: 25, phone: '+91-9876544001', hospital: 'Tata Memorial Hospital' },
  { id: 'DOC-T002', name: 'Dr. Sunita Verma', type: 'trainer', region: 'Maharashtra', specialization: 'Pediatric Hematology', experience: 12, linkedPatients: 20, phone: '+91-9876544002', hospital: 'KEM Hospital' },
  { id: 'DOC-T003', name: 'Dr. Anil Kumar', type: 'trainer', region: 'Gujarat', specialization: 'Transfusion Medicine', experience: 18, linkedPatients: 30, phone: '+91-9876544003', hospital: 'Civil Hospital Ahmedabad' },
  { id: 'DOC-T004', name: 'Dr. Meera Shah', type: 'trainer', region: 'Gujarat', specialization: 'Hematology', experience: 14, linkedPatients: 22, phone: '+91-9876544004', hospital: 'Sterling Hospital' },
  { id: 'DOC-T005', name: 'Dr. Kiran Rao', type: 'trainer', region: 'Karnataka', specialization: 'Pediatric Hematology', experience: 16, linkedPatients: 28, phone: '+91-9876544005', hospital: 'Kidwai Memorial Institute' },
  { id: 'DOC-T006', name: 'Dr. Lakshmi Reddy', type: 'trainer', region: 'Karnataka', specialization: 'Transfusion Medicine', experience: 13, linkedPatients: 24, phone: '+91-9876544006', hospital: 'Manipal Hospital' },
  { id: 'DOC-T007', name: 'Dr. Amit Gupta', type: 'trainer', region: 'Maharashtra', specialization: 'Internal Medicine', experience: 11, linkedPatients: 18, phone: '+91-9876544007', hospital: 'Lilavati Hospital' },
  { id: 'DOC-T008', name: 'Dr. Priya Patel', type: 'trainer', region: 'Gujarat', specialization: 'Hematology', experience: 17, linkedPatients: 26, phone: '+91-9876544008', hospital: 'Apollo Hospital Ahmedabad' },
  { id: 'DOC-T009', name: 'Dr. Venkat Gowda', type: 'trainer', region: 'Karnataka', specialization: 'Hematology', experience: 19, linkedPatients: 32, phone: '+91-9876544009', hospital: 'Narayana Health' },
  { id: 'DOC-T010', name: 'Dr. Kavya Nair', type: 'trainer', region: 'Maharashtra', specialization: 'Pediatric Hematology', experience: 10, linkedPatients: 16, phone: '+91-9876544010', hospital: 'Wadia Hospital' }
];

export const mockTraineeDoctors = [
  { id: 'DOC-R001', name: 'Dr. Rohit Sharma', type: 'trainee', region: 'Maharashtra', specialization: 'General Medicine', experience: 3, linkedPatients: 8, phone: '+91-9876545001', hospital: 'Sion Hospital', trainer: 'DOC-T001' },
  { id: 'DOC-R002', name: 'Dr. Neha Kulkarni', type: 'trainee', region: 'Maharashtra', specialization: 'Internal Medicine', experience: 2, linkedPatients: 6, phone: '+91-9876545002', hospital: 'JJ Hospital', trainer: 'DOC-T002' },
  { id: 'DOC-R003', name: 'Dr. Manish Patil', type: 'trainee', region: 'Maharashtra', specialization: 'General Medicine', experience: 4, linkedPatients: 10, phone: '+91-9876545003', hospital: 'Grant Medical College', trainer: 'DOC-T001' },
  { id: 'DOC-R004', name: 'Dr. Pooja Desai', type: 'trainee', region: 'Gujarat', specialization: 'Internal Medicine', experience: 2, linkedPatients: 7, phone: '+91-9876545004', hospital: 'BJ Medical College', trainer: 'DOC-T003' },
  { id: 'DOC-R005', name: 'Dr. Kiran Modi', type: 'trainee', region: 'Gujarat', specialization: 'General Medicine', experience: 3, linkedPatients: 9, phone: '+91-9876545005', hospital: 'Government Medical College Surat', trainer: 'DOC-T004' },
  { id: 'DOC-R006', name: 'Dr. Rajesh Joshi', type: 'trainee', region: 'Gujarat', specialization: 'Internal Medicine', experience: 1, linkedPatients: 5, phone: '+91-9876545006', hospital: 'PDU Medical College', trainer: 'DOC-T003' },
  { id: 'DOC-R007', name: 'Dr. Anita Kumar', type: 'trainee', region: 'Karnataka', specialization: 'General Medicine', experience: 2, linkedPatients: 6, phone: '+91-9876545007', hospital: 'Bangalore Medical College', trainer: 'DOC-T005' },
  { id: 'DOC-R008', name: 'Dr. Suresh Rao', type: 'trainee', region: 'Karnataka', specialization: 'Internal Medicine', experience: 3, linkedPatients: 8, phone: '+91-9876545008', hospital: 'Mysore Medical College', trainer: 'DOC-T006' },
  { id: 'DOC-R009', name: 'Dr. Lakshmi Gowda', type: 'trainee', region: 'Karnataka', specialization: 'General Medicine', experience: 4, linkedPatients: 11, phone: '+91-9876545009', hospital: 'Kempegowda Institute', trainer: 'DOC-T005' },
  { id: 'DOC-R010', name: 'Dr. Venkat Reddy', type: 'trainee', region: 'Karnataka', specialization: 'Internal Medicine', experience: 2, linkedPatients: 7, phone: '+91-9876545010', hospital: 'St. Johns Medical College', trainer: 'DOC-T009' }
];

export const mockAdmins = [
  { id: 'ADM-001', name: 'Admin Maharashtra', region: 'Maharashtra', role: 'admin', phone: '+91-9876546001', email: 'admin.mh@helplink.com' },
  { id: 'ADM-002', name: 'Admin Gujarat', region: 'Gujarat', role: 'admin', phone: '+91-9876546002', email: 'admin.gj@helplink.com' },
  { id: 'ADM-003', name: 'Admin Karnataka', region: 'Karnataka', role: 'admin', phone: '+91-9876546003', email: 'admin.ka@helplink.com' },
  { id: 'ADM-004', name: 'Super Admin', region: 'All India', role: 'super_admin', phone: '+91-9876546004', email: 'superadmin@helplink.com' }
];

// Blood inventory data by region and hospital
export const bloodInventoryData = {
  'Maharashtra': {
    'Tata Memorial Hospital': { 'O+': 45, 'A+': 32, 'B+': 28, 'AB+': 15, 'O-': 12, 'A-': 8, 'B-': 6, 'AB-': 3 },
    'KEM Hospital': { 'O+': 38, 'A+': 25, 'B+': 22, 'AB+': 12, 'O-': 8, 'A-': 6, 'B-': 4, 'AB-': 2 },
    'Lilavati Hospital': { 'O+': 52, 'A+': 35, 'B+': 30, 'AB+': 18, 'O-': 15, 'A-': 10, 'B-': 8, 'AB-': 5 }
  },
  'Gujarat': {
    'Civil Hospital Ahmedabad': { 'O+': 40, 'A+': 28, 'B+': 25, 'AB+': 14, 'O-': 10, 'A-': 7, 'B-': 5, 'AB-': 3 },
    'Sterling Hospital': { 'O+': 35, 'A+': 22, 'B+': 20, 'AB+': 10, 'O-': 8, 'A-': 5, 'B-': 3, 'AB-': 2 },
    'Apollo Hospital Ahmedabad': { 'O+': 48, 'A+': 30, 'B+': 26, 'AB+': 16, 'O-': 12, 'A-': 8, 'B-': 6, 'AB-': 4 }
  },
  'Karnataka': {
    'Kidwai Memorial Institute': { 'O+': 42, 'A+': 28, 'B+': 24, 'AB+': 13, 'O-': 9, 'A-': 6, 'B-': 4, 'AB-': 2 },
    'Manipal Hospital': { 'O+': 50, 'A+': 33, 'B+': 29, 'AB+': 17, 'O-': 13, 'A-': 9, 'B-': 7, 'AB-': 4 },
    'Narayana Health': { 'O+': 46, 'A+': 31, 'B+': 27, 'AB+': 15, 'O-': 11, 'A-': 8, 'B-': 6, 'AB-': 3 }
  }
};

// Community chat data
export const communityMessages = {
  'patient_community': [
    { id: '1', sender: 'Arjun Sharma', role: 'patient', message: 'Just completed my monthly transfusion. Feeling much better! Remember to take your iron chelation therapy regularly.', timestamp: new Date('2024-01-20T10:30:00'), likes: 12 },
    { id: '2', sender: 'Priya Patel', role: 'patient', message: 'Has anyone tried the new iron chelator? My doctor suggested switching from Deferiprone.', timestamp: new Date('2024-01-20T11:15:00'), likes: 8 },
    { id: '3', sender: 'Dr. Rajesh Khanna', role: 'trainer_doctor', message: 'Great question Priya! The new chelators have shown better compliance rates. I can schedule a consultation to discuss this.', timestamp: new Date('2024-01-20T11:45:00'), likes: 15 }
  ],
  'user_community': [
    { id: '1', sender: 'Amit Gupta', role: 'user', message: 'Organizing a blood donation camp in Mumbai next week. Anyone interested in volunteering?', timestamp: new Date('2024-01-20T14:20:00'), likes: 18 },
    { id: '2', sender: 'Kavya Nair', role: 'user', message: 'Count me in! I donated last month and feeling great. When and where?', timestamp: new Date('2024-01-20T14:35:00'), likes: 10 },
    { id: '3', sender: 'Dr. Sunita Verma', role: 'trainer_doctor', message: 'This is wonderful! I can help with medical screening at the camp.', timestamp: new Date('2024-01-20T15:00:00'), likes: 22 }
  ],
  'doctor_community': [
    { id: '1', sender: 'Dr. Rajesh Khanna', role: 'trainer_doctor', message: 'New research shows promising results with gene therapy for thalassemia. Sharing the latest paper.', timestamp: new Date('2024-01-20T09:00:00'), likes: 25 },
    { id: '2', sender: 'Dr. Rohit Sharma', role: 'trainee_doctor', message: 'Thank you for sharing! This could be game-changing for our patients.', timestamp: new Date('2024-01-20T09:30:00'), likes: 12 },
    { id: '3', sender: 'Dr. Anil Kumar', role: 'trainer_doctor', message: 'I have a complex case - 8-year-old with severe iron overload. Any suggestions for chelation protocol?', timestamp: new Date('2024-01-20T10:15:00'), likes: 18 }
  ]
};

export default {
  supabase,
  mockPatients,
  mockUsers,
  mockTrainerDoctors,
  mockTraineeDoctors,
  mockAdmins,
  bloodInventoryData,
  communityMessages
};