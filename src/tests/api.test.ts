import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
const db = vi.hoisted(() => ({ tables: {} as Record<string, any[]> }));
vi.mock('../config/supabase', () => {
  function query(table: string) {
    let id: string | undefined; let excludedId: string | undefined;
    let filters: Record<string, any> = {}; let operation: 'select'|'insert'|'update'|'delete' = 'select'; let payload: any;
    const q: any = {
      select: (_fields?: string) => q, order: () => q,
      eq: (key: string, val: any) => { if (key === 'id') id = val; else filters[key] = val; return q; },
      neq: (key: string, val: any) => { if (key === 'id') excludedId = val; else filters['!'+key] = val; return q; },
      insert: (value: any) => { operation='insert'; payload=value; return q; },
      update: (value: any) => { operation='update'; payload=value; return q; },
      delete: () => { operation='delete'; return q; },
      single: () => execute(true), maybeSingle: () => execute(true),
      then: (resolve: any, reject: any) => Promise.resolve(execute(false)).then(resolve,reject)
    };
    function execute(single: boolean) {
      const rows = db.tables[table] ?? (db.tables[table] = []);
      const matches = (r:any) => (!id || r.id===id) && (!excludedId || r.id!==excludedId) && Object.entries(filters).every(([k,v]) => k.startsWith('!') ? r[k.slice(1)]!==v : r[k]===v);
      const found = rows.filter(matches);
      if (operation==='insert') { const record = {id: crypto.randomUUID(), ...payload}; rows.push(record); return {data:single?record:[record],error:null}; }
      if (operation==='update') { for(const row of found) Object.assign(row,payload); return {data:single?(found[0]??null):found,error:null}; }
      if (operation==='delete') { for(const row of found) rows.splice(rows.indexOf(row),1); return {data:found,error:null}; }
      return {data:single?(found[0]??null):found,error:null};
    }
    return q;
  }
  return {supabase: {from: query}};
});
import app from '../app';
const ids = { category:'11111111-1111-4111-8111-111111111111', service:'22222222-2222-4222-8222-222222222222', professional:'33333333-3333-4333-8333-333333333333' };
const inputs: Record<string,any> = {
 categories:{name:'Cabelos',active:true},
 services:{category_id:ids.category,name:'Corte',price:40,duration_minutes:30},
 professionals:{name:'Ana',specialty:'Cabelo'},
 appointments:{service_id:ids.service,professional_id:ids.professional,client_name:'Cliente',client_phone:'41999999999',appointment_date:'2026-12-10',appointment_time:'10:00'}
};
beforeEach(() => { db.tables = {categories:[{id:ids.category,...inputs.categories}],services:[{id:ids.service,...inputs.services}],professionals:[{id:ids.professional,...inputs.professionals}],appointments:[]}; });
describe.each(['categories','services','professionals','appointments'])('%s CRUD integration', table => {
 it('POST, GET lista, GET id, PUT e DELETE', async () => {
  const created = await request(app).post('/'+table).send(inputs[table]);
  expect(created.status).toBe(201);
  const id=created.body.id;
  expect((await request(app).get('/'+table)).status).toBe(200);
  expect((await request(app).get('/'+table+'/'+id)).status).toBe(200);
  expect((await request(app).put('/'+table+'/'+id).send(inputs[table])).status).toBe(200);
  expect((await request(app).delete('/'+table+'/'+id)).status).toBe(204);
  expect((await request(app).get('/'+table+'/'+id)).status).toBe(404);
 });
 it('rejeita corpo vazio e UUID inválido', async () => {
  expect((await request(app).post('/'+table).send({})).status).toBe(400);
  expect((await request(app).get('/'+table+'/abc')).status).toBe(400);
 });
 it('rejeita update inexistente e delete inexistente', async () => {
  const id='99999999-9999-4999-8999-999999999999';
  expect((await request(app).put('/'+table+'/'+id).send(inputs[table])).status).toBe(404);
  expect((await request(app).delete('/'+table+'/'+id)).status).toBe(404);
 });
});
describe('regras de negócio', () => {
 it('rejeita preço negativo, duração zero e referência inválida', async () => {
  expect((await request(app).post('/services').send({...inputs.services,price:-1})).status).toBe(400);
  expect((await request(app).post('/services').send({...inputs.services,duration_minutes:0})).status).toBe(400);
  expect((await request(app).post('/services').send({...inputs.services,category_id:'99999999-9999-4999-8999-999999999999'})).status).toBe(400);
 });
 it('impede sobreposição e permite horários consecutivos', async () => {
  expect((await request(app).post('/appointments').send(inputs.appointments)).status).toBe(201);
  expect((await request(app).post('/appointments').send({...inputs.appointments,appointment_time:'10:15'})).status).toBe(409);
  expect((await request(app).post('/appointments').send({...inputs.appointments,appointment_time:'10:30'})).status).toBe(201);
 });
 it('valida data, hora, status e ativo', async () => {
  expect((await request(app).post('/appointments').send({...inputs.appointments,appointment_date:'2026-02-30'})).status).toBe(400);
  expect((await request(app).post('/appointments').send({...inputs.appointments,appointment_time:'25:00'})).status).toBe(400);
  expect((await request(app).post('/appointments').send({...inputs.appointments,status:'outro'})).status).toBe(400);
  expect((await request(app).post('/categories').send({name:'x',active:'yes'})).status).toBe(400);
 });
 it('documentação e 404', async () => {
  expect((await request(app).get('/api-docs/')).status).toBe(200);
  expect((await request(app).get('/inexistente')).status).toBe(404);
 });
});
