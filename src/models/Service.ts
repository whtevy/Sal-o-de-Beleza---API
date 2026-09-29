export interface Service {
  id?: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  active?: boolean;
}