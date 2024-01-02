import { describe, expect, it } from "vitest";

import { createEventify } from "../factories/Eventify.factory.js";

describe("Eventify class", () => {
	const client = createEventify();

	it("should be able to retrieve all events", async () => {
		const result = await client.getEvents();

		expect(Array.isArray(result)).toEqual(true);
	});

	it("should be able to trigger an event", async () => {
		const result = await client.triggerEvent({
			data: "jsonTest",
			name: "test",
		});

		expect(result).toHaveProperty("data", "jsonTest");
		expect(result).toHaveProperty("name", "test");
	});
});
