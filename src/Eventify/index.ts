import { AxiosError } from "axios";

import { api } from "../libs/api.js";
import {
	EventModel,
	EventSchema,
	TriggerEventOptions,
} from "../models/EventModel.js";

export interface EventifyOptions {
	apiKey: string;
	workspaceId: string;
}

export type TriggerEventRequestBody = TriggerEventOptions;
export type GetEventsResponse = EventModel[] | null;

export class Eventify {
	private apiKey: string;
	private workspaceId: string;

	constructor({ apiKey, workspaceId }: EventifyOptions) {
		this.apiKey = apiKey;
		this.workspaceId = workspaceId;

		api.defaults.headers.common.Authorization = `Bearer ${this.apiKey}`;
	}

	#handleErrors(status: number): null {
		switch (status) {
			case 401:
				console.error("Invalid API key");
				return null;
		}

		console.error("Unknown error");

		return null;
	}

	async getEvents(): Promise<GetEventsResponse> {
		try {
			const response = await api.get(`/events/${this.workspaceId}`);

			const result = EventSchema.array().safeParse(response.data);

			if (!result.success) {
				throw new Error(result.error.message);
			}

			return result.data;
		} catch (err) {
			if (err instanceof AxiosError && err.response) {
				return this.#handleErrors(err.response.status);
			}

			return this.#handleErrors(500);
		}
	}

	async triggerEvent({ data: eventData, name }: TriggerEventRequestBody) {
		const response = await api.post(`/events/${this.workspaceId}`, {
			data: eventData,
			name,
		});

		const result = EventSchema.safeParse(response.data);

		if (!result.success) {
			throw new Error(result.error.message);
		}

		if (process.env.NODE_ENV === "test") {
			await api.delete(`/events/${this.workspaceId}/${result.data.id}`);
		}

		return result.data;
	}
}
