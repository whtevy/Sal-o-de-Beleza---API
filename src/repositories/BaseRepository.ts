import { supabase } from '../config/supabase';
import { ApiError } from '../errors/ApiError';

export class BaseRepository {
  constructor(public readonly table: string) {}
  async list() {
    const { data, error } = await supabase.from(this.table).select('*').order('id');
    if (error) throw new ApiError(500, error.message);
    return data;
  }
  async find(id: string) {
    const { data, error } = await supabase.from(this.table).select('*').eq('id', id).maybeSingle();
    if (error) throw new ApiError(400, error.message);
    return data;
  }
  async create(payload: Record<string, unknown>) {
    const { data, error } = await supabase.from(this.table).insert(payload).select().single();
    if (error) throw new ApiError(400, error.message);
    return data;
  }
  async update(id: string, payload: Record<string, unknown>) {
    const { data, error } = await supabase.from(this.table).update(payload).eq('id', id).select().maybeSingle();
    if (error) throw new ApiError(400, error.message);
    return data;
  }
  async delete(id: string) {
    // Check existence first: Supabase delete without returning rows does not distinguish absent IDs.
    const { data, error } = await supabase.from(this.table).delete().eq('id', id).select('id');
    if (error) throw new ApiError(400, error.message);
    return (data?.length ?? 0) > 0;
  }
  async overlappingAppointments(professionalId: string, date: string, excludeId?: string) {
    let query = supabase.from('appointments').select('id, appointment_time, status, services(duration_minutes)')
      .eq('professional_id', professionalId).eq('appointment_date', date).neq('status', 'cancelado');
    if (excludeId) query = query.neq('id', excludeId);
    const { data, error } = await query;
    if (error) throw new ApiError(400, error.message);
    return data ?? [];
  }
}
