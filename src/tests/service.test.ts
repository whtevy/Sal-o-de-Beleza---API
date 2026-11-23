import { describe, it, expect, vi } from 'vitest';
import { CrudService } from '../services/CrudService';
import { ApiError } from '../errors/ApiError';
const id = '11111111-1111-4111-8111-111111111111';
const fakeRepo = () => ({
  list: vi.fn().mockResolvedValue([{id, name:'Cabelos'}]),
  find: vi.fn().mockResolvedValue({id,name:'Cabelos'}),
  create: vi.fn(async (body:any) => ({id,...body})),
  update: vi.fn(async (_id:string,body:any) => ({id,...body})),
  delete: vi.fn().mockResolvedValue(true),
  overlappingAppointments: vi.fn().mockResolvedValue([])
});
describe('testes unitários do service', () => {
  it('lista, consulta, cria, edita e remove categoria', async () => {
    const repo=fakeRepo(); const service=new CrudService('categories',repo as any);
    expect(await service.list()).toHaveLength(1);
    expect((await service.get(id)).name).toBe('Cabelos');
    expect((await service.create({name:'Unhas'})).name).toBe('Unhas');
    expect((await service.update(id,{name:'Cabelos novos'})).name).toBe('Cabelos novos');
    await service.delete(id);
    expect(repo.delete).toHaveBeenCalledWith(id);
  });
  it('recusa campos inválidos', async () => {
    const service=new CrudService('categories',fakeRepo() as any);
    await expect(service.create({name:'  '})).rejects.toBeInstanceOf(ApiError);
    await expect(service.create({name:'Cabelos',extra:1})).rejects.toBeInstanceOf(ApiError);
    await expect(service.get('invalido')).rejects.toMatchObject({status:400});
  });
  it('retorna 404 para registro inexistente', async () => {
    const repo=fakeRepo();repo.find.mockResolvedValueOnce(null as any);
    const service=new CrudService('categories',repo as any);
    await expect(service.get(id)).rejects.toMatchObject({status:404});
  });
});
