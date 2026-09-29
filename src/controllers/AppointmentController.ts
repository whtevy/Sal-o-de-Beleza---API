import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export async function getAppointments(req: Request, res: Response) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, services(name), professionals(name, specialty)')
    .order('appointment_date')
    .order('appointment_time');

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function getAppointmentById(req: Request, res: Response) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, services(name), professionals(name, specialty)')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Agendamento não encontrado' });
  return res.json(data);
}

export async function createAppointment(req: Request, res: Response) {
  const {
    service_id,
    professional_id,
    client_name,
    client_phone,
    appointment_date,
    appointment_time,
    status = 'agendado'
  } = req.body;

  if (!service_id || !professional_id || !client_name || !client_phone ||
      !appointment_date || !appointment_time) {
    return res.status(400).json({
      error: 'service_id, professional_id, client_name, client_phone, appointment_date e appointment_time são obrigatórios'
    });
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      service_id,
      professional_id,
      client_name,
      client_phone,
      appointment_date,
      appointment_time,
      status
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
}

export async function updateAppointment(req: Request, res: Response) {
  const {
    service_id,
    professional_id,
    client_name,
    client_phone,
    appointment_date,
    appointment_time,
    status
  } = req.body;

  if (!service_id || !professional_id || !client_name || !client_phone ||
      !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'Todos os dados do agendamento são obrigatórios' });
  }

  const { data, error } = await supabase
    .from('appointments')
    .update({
      service_id,
      professional_id,
      client_name,
      client_phone,
      appointment_date,
      appointment_time,
      status
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ error: 'Agendamento não encontrado' });
  return res.json(data);
}

export async function deleteAppointment(req: Request, res: Response) {
  const { error } = await supabase.from('appointments').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(204).send();
}