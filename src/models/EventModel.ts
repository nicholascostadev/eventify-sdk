import { z } from "zod";

export const EventSchema = z.object({
	createdAt: z.string().datetime(),
	data: z.string().nullable(),
	id: z.string().uuid(),
	name: z.string(),
	updatedAt: z.string().datetime(),
	workspaceId: z.string().cuid(),
});

export const TriggerEventOptions = z.object({
	data: z.string().nullable(),
	name: z.string(),
});

export type EventModel = z.infer<typeof EventSchema>;
export type TriggerEventOptions = z.infer<typeof TriggerEventOptions>;
