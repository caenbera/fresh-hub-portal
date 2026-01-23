// src/lib/schemas/support.schema.ts
import { z } from 'zod';

export const supportTicketSchema = z.object({
  issueType: z.string().min(5, 'El tipo de problema debe tener al menos 5 caracteres').max(100),
  details: z.string().min(10, 'Los detalles deben tener al menos 10 caracteres').max(1000),
  orderId: z.string().optional(),
});

export type SupportTicketInput = z.infer<typeof supportTicketSchema>;