export interface Appointment {
  id?: string;
  service_id: string;
  professional_id: string;
  client_name: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
  status?: string;
}