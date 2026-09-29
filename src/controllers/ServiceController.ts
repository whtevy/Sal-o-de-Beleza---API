import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export async function getServices(req: Request, res: Response) {
  const { data, error } = await supabase
    .from('services')
    .select('*, categories(name)')
    .order('name');

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function getServiceById(req: Request, res: Response) {
  const { data, error } = await supabase
    .from('services')
    .select('*, categories(name)')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Serviço não encontrado' });
  return res.json(data);
}

export async function createService(req: Request, res: Response) {
  const { category_id, name, description, price, duration_minutes, active = true } = req.body;

  if (!category_id || !name || price === undefined || duration_minutes === undefined) {
    return res.status(400).json({
      error: 'category_id, name, price e duration_minutes são obrigatórios'
    });
  }

  if (Number(price) < 0 || Number(duration_minutes) <= 0) {
    return res.status(400).json({ error: 'Preço e duração devem possuir valores válidos' });
  }

  const { data, error } = await supabase
    .from('services')
    .insert({
      category_id,
      name,
      description,
      price: Number(price),
      duration_minutes: Number(duration_minutes),
      active
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
}

export async function updateService(req: Request, res: Response) {
  const { category_id, name, description, price, duration_minutes, active } = req.body;

  if (!category_id || !name || price === undefined || duration_minutes === undefined) {
    return res.status(400).json({
      error: 'category_id, name, price e duration_minutes são obrigatórios'
    });
  }

  const { data, error } = await supabase
    .from('services')
    .update({
      category_id,
      name,
      description,
      price: Number(price),
      duration_minutes: Number(duration_minutes),
      active
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ error: 'Serviço não encontrado' });
  return res.json(data);
}

export async function deleteService(req: Request, res: Response) {
  const { error } = await supabase.from('services').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(204).send();
}