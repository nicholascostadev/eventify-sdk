import { edenTreaty } from "@elysiajs/eden";

import type { App } from "../../back-end/src/index.ts";

export interface EventifyOptions {
	apiKey: string;
	workspaceId: string;
}

export type GetEventsResponse =
	| {
			data: {
				createdAt: Date;
				data: null | string;
				id: string;
				name: string;
				updatedAt: Date;
				workspaceId: string;
			}[];
	  }
	| {
			message: string;
	  };

export interface TriggerEventOptions {
	data?: string;
	name: string;
}

export class Eventify {
	private apiKey: string;
	private client;
	private workspaceId: string;

	constructor({ apiKey, workspaceId }: EventifyOptions) {
		this.apiKey = apiKey;
		this.workspaceId = workspaceId;
		// @ts-expect-error IDK why app is not a valid type
		this.client = edenTreaty<App>("http://localhost:3000", {
			$fetch: {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			},
		});
	}

	#handleErrors(status: number): { message: string } {
		switch (status) {
			case 401:
				return {
					message: "Unauthorized",
				};
		}

		return {
			message: "Unknown error",
		};
	}

	async getEvents(): Promise<GetEventsResponse> {
		const { data, error } = await this.client.events[this.workspaceId].get();

		if (error) {
			return this.#handleErrors(error.status);
		}

		return { data };
	}

	async triggerEvent({ data: eventData, name }: TriggerEventOptions) {
		const { data, error } = await this.client.events[this.workspaceId].post({
			data: eventData,
			name,
		});

		if (error) {
			return this.#handleErrors(error.status);
		}

		if (process.env.NODE_ENV === "test") {
			await this.client.events[this.workspaceId][data.id].delete();
		}

		return { data };
	}
}
