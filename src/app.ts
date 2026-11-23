import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { openApi } from './docs/openapi';
import { ApiError } from './errors/ApiError';
import categoryRoutes from './routes/CategoryRoutes';
import serviceRoutes from './routes/ServiceRoutes';
import professionalRoutes from './routes/ProfessionalRoutes';
import appointmentRoutes from './routes/AppointmentRoutes';
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (_req, res) => { res.json({ message: 'API do Salão de Beleza funcionando!', docs: '/api-docs' }); });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApi));
app.use('/categories', categoryRoutes);
app.use('/services', serviceRoutes);
app.use('/professionals', professionalRoutes);
app.use('/appointments', appointmentRoutes);
app.use((_req, res) => { res.status(404).json({ error: 'Rota não encontrada' }); });
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) { res.status(err.status).json({ error: err.message }); return; }
  if (err instanceof SyntaxError && 'body' in err) { res.status(400).json({ error: 'JSON inválido' }); return; }
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
};
app.use(errorHandler);
export default app;
