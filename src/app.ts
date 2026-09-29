import express from 'express';
import cors from 'cors';

import categoryRoutes from './routes/CategoryRoutes';
import serviceRoutes from './routes/ServiceRoutes';
import professionalRoutes from './routes/ProfessionalRoutes';
import appointmentRoutes from './routes/AppointmentRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API do Salão de Beleza funcionando!',
    endpoints: {
      categories: '/categories',
      services: '/services',
      professionals: '/professionals',
      appointments: '/appointments'
    }
  });
});

app.use('/categories', categoryRoutes);
app.use('/services', serviceRoutes);
app.use('/professionals', professionalRoutes);
app.use('/appointments', appointmentRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

export default app;