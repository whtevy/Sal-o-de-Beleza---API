import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export async function getCategories(req: Request, res: Response) {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function getCategoryById(req: Request, res: Response) {
  const { data, error } = await supabase.from('categories').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Categoria não encontrada' });
  return res.json(data);
}

export async function createCategory(req: Request, res: Response) {
  const { name, description, active = true } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'O nome da categoria é obrigatório' });
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, description, active })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
}

export async function updateCategory(req: Request, res: Response) {
  const { name, description, active } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'O nome da categoria é obrigatório' });
  }

  const { data, error } = await supabase
    .from('categories')
    .update({ name, description, active })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(404).json({ error: 'Categoria não encontrada' });
  return res.json(data);
}

export async function deleteCategory(req: Request, res: Response) {
  const { error } = await supabase.from('categories').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(204).send();
}