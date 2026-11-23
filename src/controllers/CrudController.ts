import { Request, Response, NextFunction } from 'express';
import { CrudService } from '../services/CrudService';
export class CrudController {
  constructor(private service: CrudService) {}
  list = async (_req: Request, res: Response, next: NextFunction) => { try { res.json(await this.service.list()); } catch (e) { next(e); } };
  get = async (req: Request, res: Response, next: NextFunction) => { try { res.json(await this.service.get(req.params.id as string)); } catch (e) { next(e); } };
  create = async (req: Request, res: Response, next: NextFunction) => { try { res.status(201).json(await this.service.create(req.body)); } catch (e) { next(e); } };
  update = async (req: Request, res: Response, next: NextFunction) => { try { res.json(await this.service.update(req.params.id as string, req.body)); } catch (e) { next(e); } };
  delete = async (req: Request, res: Response, next: NextFunction) => { try { await this.service.delete(req.params.id as string); res.status(204).send(); } catch (e) { next(e); } };
}
