import { Router } from 'express';
import {
  getProfessionals, getProfessionalById, createProfessional,
  updateProfessional, deleteProfessional
} from '../controllers/ProfessionalController';

const router = Router();

router.get('/', getProfessionals);
router.get('/:id', getProfessionalById);
router.post('/', createProfessional);
router.put('/:id', updateProfessional);
router.delete('/:id', deleteProfessional);

export default router;