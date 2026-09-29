import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export async function getProfessionals(req: Request, res: Response) {
  const { data, error } = await supabase.from('professionals').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function getProfessionalById(req: Request, res: Response) {
  const { data, error } = await supabase.from('professionals').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Profissional não encontrado' });
  return res.json(data);
}

export async function createProfessional(req: Request, res: Response) {
  const { name, specialty, phone, active = true } = req.body;

  if (!name || !specialty) {
    return res.status(400).json({ error: 'name e specialty são obrigatórios' });
  }

  const { data, error } = await supabase
    .from('professionals')
    .insert({ name, specialty, phone, active })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
}

export async function updateProfessional(req: Request, res: Response) {
  const { name, specialty, phone, active } = req.body;

  if (!name || !specialty) {
    return res.status(400).json({ error: 'name e specialty são obrigatórios' });
  }

  const { data, error } = await supabase
    .from('professionals')
    .update({ name, specialty, phone, active })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ error: 'Profissional não encontrado' });
  return res.json(data);
}

export async function deleteProfessional(req: Request, res: Response) {
  const { error } = await supabase.from('professionals').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(204).send();
}