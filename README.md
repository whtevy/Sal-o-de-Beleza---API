# Salão de Beleza – API REST

API REST para gerenciamento de um salão de beleza.

## Tecnologias

- Node.js
- TypeScript
- Express
- Supabase
- PostgreSQL
- Git

## Entidades

### Categoria
- id
- name
- description
- active

### Serviço
- id
- category_id
- name
- description
- price
- duration_minutes
- active

Uma categoria pode possuir vários serviços.

### Profissional
- id
- name
- specialty
- phone
- active

### Agendamento
- id
- service_id
- professional_id
- client_name
- client_phone
- appointment_date
- appointment_time
- status

Um serviço pode aparecer em vários agendamentos e um profissional pode possuir vários agendamentos.

## Estrutura

```text
src/
├── config/
│   └── supabase.ts
├── controllers/
│   ├── AppointmentController.ts
│   ├── CategoryController.ts
│   ├── ProfessionalController.ts
│   └── ServiceController.ts
├── models/
│   ├── Appointment.ts
│   ├── Category.ts
│   ├── Professional.ts
│   └── Service.ts
├── routes/
│   ├── AppointmentRoutes.ts
│   ├── CategoryRoutes.ts
│   ├── ProfessionalRoutes.ts
│   └── ServiceRoutes.ts
├── app.ts
└── server.ts
```

## Configuração

```bash
npm install
```

Crie `.env` com base no `.env.example`.

Depois execute:

```bash
npm run dev
```

## Endpoints

### Categorias
- GET `/categories`
- GET `/categories/:id`
- POST `/categories`
- PUT `/categories/:id`
- DELETE `/categories/:id`

### Serviços
- GET `/services`
- GET `/services/:id`
- POST `/services`
- PUT `/services/:id`
- DELETE `/services/:id`

### Profissionais
- GET `/professionals`
- GET `/professionals/:id`
- POST `/professionals`
- PUT `/professionals/:id`
- DELETE `/professionals/:id`

### Agendamentos
- GET `/appointments`
- GET `/appointments/:id`
- POST `/appointments`
- PUT `/appointments/:id`
- DELETE `/appointments/:id`

## Exemplo – criar categoria

```json
{
  "name": "Cabelos",
  "description": "Corte, escova e tratamentos",
  "active": true
}
```

## Exemplo – criar serviço

```json
{
  "category_id": "UUID_DA_CATEGORIA",
  "name": "Corte feminino",
  "description": "Corte feminino com finalização",
  "price": 80,
  "duration_minutes": 60,
  "active": true
}
```

## Banco de dados

Execute o conteúdo de `database.sql` no SQL Editor do Supabase.

O arquivo `.env` não deve ser enviado ao Git.
