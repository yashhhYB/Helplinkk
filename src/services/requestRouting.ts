// Request Routing Service for Patient-to-Doctor Communication
import { supabase } from './supabase';

export interface PatientRequest {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  requestType: 'consultation' | 'blood_request' | 'health_analysis' | 'emergency';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  healthData?: {
    hemoglobinLevel: number;
    ironLevel: number;
    weight: number;
    bloodType: string;
    symptoms?: string[];
  };
  requestDate: Date;
  assignedDate?: Date;
  completedDate?: Date;
  region: string;
  notes?: string;
  attachments?: string[];
}

export interface DoctorAssignment {
  doctorId: string;
  doctorName: string;
  specialization: string;
  region: string;
  currentLoad: number;
  maxCapacity: number;
  isTrainer: boolean;
}

class RequestRoutingService {
  // Route patient requests to appropriate doctors
  async routePatientRequest(request: Omit<PatientRequest, 'id' | 'requestDate' | 'status'>): Promise<PatientRequest> {
    try {
      // Find appropriate doctor based on region and specialization
      const assignedDoctor = await this.findBestDoctor(request.region, request.requestType, request.priority);
      
      const newRequest: PatientRequest = {
        ...request,
        id: `REQ-${Date.now()}`,
        requestDate: new Date(),
        status: 'pending',
        doctorId: assignedDoctor?.doctorId
      };

      // Store in Supabase
      const { data, error } = await supabase
        .from('patient_requests')
        .insert([{
          id: newRequest.id,
          patient_id: newRequest.patientId,
          patient_name: newRequest.patientName,
          doctor_id: newRequest.doctorId,
          request_type: newRequest.requestType,
          title: newRequest.title,
          description: newRequest.description,
          priority: newRequest.priority,
          status: newRequest.status,
          health_data: newRequest.healthData,
          request_date: newRequest.requestDate.toISOString(),
          region: newRequest.region,
          notes: newRequest.notes
        }])
        .select()
        .single();

      if (error) throw error;

      // Send notification to assigned doctor
      if (assignedDoctor) {
        await this.notifyDoctor(assignedDoctor.doctorId, newRequest);
      }

      return newRequest;
    } catch (error) {
      console.error('Error routing patient request:', error);
      throw error;
    }
  }

  // Find the best available doctor for the request
  private async findBestDoctor(region: string, requestType: string, priority: string): Promise<DoctorAssignment | null> {
    try {
      // Get available doctors in the region
      const { data: doctors, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('region', region)
        .eq('available_for_consultation', true);

      if (error) throw error;

      if (!doctors || doctors.length === 0) {
        // No doctors in region, find nearest region
        return await this.findNearestRegionDoctor(region, requestType);
      }

      // Calculate doctor scores based on specialization, load, and experience
      const scoredDoctors = doctors.map(doctor => ({
        ...doctor,
        score: this.calculateDoctorScore(doctor, requestType, priority)
      }));

      // Sort by score and return the best match
      const bestDoctor = scoredDoctors.sort((a, b) => b.score - a.score)[0];

      return {
        doctorId: bestDoctor.id,
        doctorName: `${bestDoctor.first_name} ${bestDoctor.last_name}`,
        specialization: bestDoctor.specialization,
        region: bestDoctor.region,
        currentLoad: bestDoctor.current_patients || 0,
        maxCapacity: bestDoctor.max_patients || 50,
        isTrainer: bestDoctor.role === 'trainer_doctor'
      };
    } catch (error) {
      console.error('Error finding doctor:', error);
      return null;
    }
  }

  // Calculate doctor matching score
  private calculateDoctorScore(doctor: any, requestType: string, priority: string): number {
    let score = 0;

    // Specialization match
    if (requestType === 'blood_request' && doctor.specialization.includes('Hematology')) score += 50;
    if (requestType === 'consultation' && doctor.specialization.includes('Hematology')) score += 40;
    if (requestType === 'emergency' && doctor.specialization.includes('Emergency')) score += 60;

    // Experience factor
    score += Math.min(doctor.experience_years * 2, 30);

    // Current load factor (prefer less loaded doctors)
    const loadFactor = (doctor.current_patients || 0) / (doctor.max_patients || 50);
    score += (1 - loadFactor) * 20;

    // Priority handling (trainers for critical cases)
    if (priority === 'critical' && doctor.role === 'trainer_doctor') score += 30;

    // Availability factor
    if (doctor.available_for_consultation) score += 10;

    return score;
  }

  // Find doctor in nearest region if none available locally
  private async findNearestRegionDoctor(region: string, requestType: string): Promise<DoctorAssignment | null> {
    const regionProximity: { [key: string]: string[] } = {
      'Maharashtra': ['Gujarat', 'Karnataka', 'Goa'],
      'Gujarat': ['Maharashtra', 'Rajasthan', 'Madhya Pradesh'],
      'Karnataka': ['Maharashtra', 'Tamil Nadu', 'Andhra Pradesh']
    };

    const nearbyRegions = regionProximity[region] || [];

    for (const nearbyRegion of nearbyRegions) {
      const doctor = await this.findBestDoctor(nearbyRegion, requestType, 'high');
      if (doctor) return doctor;
    }

    return null;
  }

  // Get all requests for a specific doctor
  async getDoctorRequests(doctorId: string): Promise<PatientRequest[]> {
    try {
      const { data, error } = await supabase
        .from('patient_requests')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('request_date', { ascending: false });

      if (error) throw error;

      return data.map(this.mapSupabaseToRequest);
    } catch (error) {
      console.error('Error fetching doctor requests:', error);
      return [];
    }
  }

  // Get all requests for a specific patient
  async getPatientRequests(patientId: string): Promise<PatientRequest[]> {
    try {
      const { data, error } = await supabase
        .from('patient_requests')
        .select('*')
        .eq('patient_id', patientId)
        .order('request_date', { ascending: false });

      if (error) throw error;

      return data.map(this.mapSupabaseToRequest);
    } catch (error) {
      console.error('Error fetching patient requests:', error);
      return [];
    }
  }

  // Update request status
  async updateRequestStatus(requestId: string, status: string, notes?: string): Promise<void> {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'assigned') updateData.assigned_date = new Date().toISOString();
      if (status === 'completed') updateData.completed_date = new Date().toISOString();
      if (notes) updateData.notes = notes;

      const { error } = await supabase
        .from('patient_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  }

  // Send notification to doctor about new request
  private async notifyDoctor(doctorId: string, request: PatientRequest): Promise<void> {
    try {
      const { data: doctor, error } = await supabase
        .from('doctors')
        .select('email, phone, first_name')
        .eq('id', doctorId)
        .single();

      if (error) throw error;

      // Create notification record
      await supabase
        .from('notifications')
        .insert([{
          recipient_id: doctorId,
          recipient_type: 'doctor',
          title: `New ${request.requestType} request`,
          message: `${request.patientName} has submitted a ${request.requestType} request with ${request.priority} priority.`,
          type: 'request_assignment',
          priority: request.priority,
          related_id: request.id,
          created_at: new Date().toISOString()
        }]);

      // In production, send actual email/SMS using Azure Communication Services
      console.log(`Notification sent to Dr. ${doctor.first_name} about request ${request.id}`);
    } catch (error) {
      console.error('Error notifying doctor:', error);
    }
  }

  // Map Supabase data to PatientRequest interface
  private mapSupabaseToRequest(data: any): PatientRequest {
    return {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name,
      doctorId: data.doctor_id,
      requestType: data.request_type,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      healthData: data.health_data,
      requestDate: new Date(data.request_date),
      assignedDate: data.assigned_date ? new Date(data.assigned_date) : undefined,
      completedDate: data.completed_date ? new Date(data.completed_date) : undefined,
      region: data.region,
      notes: data.notes,
      attachments: data.attachments || []
    };
  }

  // Get doctor workload statistics
  async getDoctorWorkload(doctorId: string): Promise<{
    totalRequests: number;
    pendingRequests: number;
    completedToday: number;
    averageResponseTime: number;
  }> {
    try {
      const { data: requests, error } = await supabase
        .from('patient_requests')
        .select('*')
        .eq('doctor_id', doctorId);

      if (error) throw error;

      const totalRequests = requests.length;
      const pendingRequests = requests.filter(r => r.status === 'pending').length;
      const today = new Date().toISOString().split('T')[0];
      const completedToday = requests.filter(r => 
        r.status === 'completed' && 
        r.completed_date?.startsWith(today)
      ).length;

      // Calculate average response time (mock calculation)
      const averageResponseTime = 2.5; // hours

      return {
        totalRequests,
        pendingRequests,
        completedToday,
        averageResponseTime
      };
    } catch (error) {
      console.error('Error calculating doctor workload:', error);
      return { totalRequests: 0, pendingRequests: 0, completedToday: 0, averageResponseTime: 0 };
    }
  }
}

export const requestRoutingService = new RequestRoutingService();
export default requestRoutingService;