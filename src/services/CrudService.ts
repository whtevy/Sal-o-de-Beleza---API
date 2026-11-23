import { ApiError } from '../errors/ApiError';
import { BaseRepository } from '../repositories/BaseRepository';

type RecordData = Record<string, any>;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (v: unknown) => typeof v === 'string' && v.trim().length > 0;
const dateValid = (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v;
const minutes = (v: string) => { const [h,m] = v.split(':').map(Number); return h * 60 + m; };
const timeValid = (v: unknown) => typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(v);

export class CrudService {
  constructor(public readonly table: string, private repo: BaseRepository = new BaseRepository(table)) {}
  private ensureId(id: string) { if (!uuid.test(id)) throw new ApiError(400, 'ID deve ser um UUID válido'); }
  private validate(body: RecordData) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ApiError(400, 'Envie um objeto JSON válido');
    const fields: Record<string, string[]> = {
      categories: ['name'], professionals: ['name','specialty'],
      services: ['category_id','name','price','duration_minutes'],
      appointments: ['service_id','professional_id','client_name','client_phone','appointment_date','appointment_time']
    };
    const allowed: Record<string, string[]> = {
      categories: ['name','description','active'], professionals: ['name','specialty','phone','active'],
      services: ['category_id','name','description','price','duration_minutes','active'],
      appointments: ['service_id','professional_id','client_name','client_phone','appointment_date','appointment_time','status']
    };
    if (Object.keys(body).some(k => !allowed[this.table].includes(k))) throw new ApiError(400, 'Campo não permitido no JSON');
    for (const key of fields[this.table]) if (body[key] === undefined || body[key] === null || body[key] === '') throw new ApiError(400, `${key} é obrigatório`);
    for (const key of ['name','specialty','client_name','client_phone']) if (key in body && !text(body[key])) throw new ApiError(400, `${key} deve ser um texto não vazio`);
    for (const key of ['description','phone']) if (body[key] != null && typeof body[key] !== 'string') throw new ApiError(400, `${key} deve ser texto`);
    if ('active' in body && typeof body.active !== 'boolean') throw new ApiError(400, 'active deve ser booleano');
    for (const key of ['category_id','service_id','professional_id']) if (key in body && !uuid.test(body[key])) throw new ApiError(400, `${key} deve ser UUID válido`);
    if ('price' in body && (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0)) throw new ApiError(400, 'Preço deve ser número não negativo');
    if ('duration_minutes' in body && (!Number.isInteger(body.duration_minutes) || body.duration_minutes <= 0)) throw new ApiError(400, 'Duração deve ser inteiro positivo');
    if ('appointment_date' in body && !dateValid(body.appointment_date)) throw new ApiError(400, 'Data inválida (AAAA-MM-DD)');
    if ('appointment_time' in body && !timeValid(body.appointment_time)) throw new ApiError(400, 'Horário inválido (HH:mm)');
    if ('status' in body && !['agendado','concluido','cancelado'].includes(body.status)) throw new ApiError(400, 'Status inválido');
  }
  async list() { return this.repo.list(); }
  async get(id: string) { this.ensureId(id); const result = await this.repo.find(id); if (!result) throw new ApiError(404, 'Registro não encontrado'); return result; }
  private async checkRelations(body: RecordData) {
    const refs: Record<string,string> = { category_id: 'categories', service_id: 'services', professional_id: 'professionals' };
    for (const [field,table] of Object.entries(refs)) {
      if (!(field in body)) continue;
      const related = await new BaseRepository(table).find(body[field]);
      if (!related) throw new ApiError(400, `${field} não encontrado`);
      if (related.active === false) throw new ApiError(400, `${field} está inativo`);
    }
  }
  private async checkConflict(body: RecordData, excludeId?: string) {
    if (this.table !== 'appointments' || body.status === 'cancelado') return;
    const service = await new BaseRepository('services').find(body.service_id);
    if (!service || service.active === false) throw new ApiError(400, 'Serviço inexistente ou inativo');
    const start = minutes(body.appointment_time);
    const end = start + Number(service.duration_minutes);
    if (end > 1440) throw new ApiError(400, 'Agendamento ultrapassa o fim do dia');
    const others = await this.repo.overlappingAppointments(body.professional_id, body.appointment_date, excludeId);
    for (const item of others) {
      const otherStart = minutes(item.appointment_time);
      const linked = Array.isArray(item.services) ? item.services[0] : item.services;
      const otherEnd = otherStart + Number(linked?.duration_minutes ?? 0);
      if (start < otherEnd && otherStart < end) throw new ApiError(409, 'Profissional já possui agendamento nesse intervalo');
    }
  }
  async create(body: RecordData) {
    this.validate(body);
    await this.checkRelations(body);
    await this.checkConflict(body);
    return this.repo.create(body);
  }
  async update(id: string, body: RecordData) {
    this.ensureId(id);
    const existing = await this.repo.find(id);
    if (!existing) throw new ApiError(404, 'Registro não encontrado');
    const merged = { ...existing, ...body };
    const { id: ignored, ...validated } = merged;
    this.validate(validated);
    await this.checkRelations(body);
    if (this.table === 'appointments') await this.checkConflict(merged, id);
    return this.repo.update(id, body);
  }
  async delete(id: string) {
    this.ensureId(id);
    if (!(await this.repo.delete(id))) throw new ApiError(404, 'Registro não encontrado');
  }
}
