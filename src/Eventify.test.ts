import { describe, expect, it } from "vitest";

import { createEventify } from "./factories/Eventify.factory.js";

describe("Eventify class", () => {
	const client = createEventify();

	it("should be able to retrieve all events", async () => {
		const result = await client.getEvents();

		expect("data" in result).toBe(true);
		if (!("data" in result)) {
			return;
		}

		expect(Array.isArray(result.data)).toEqual(true);
	});

	it("should be able to trigger an event", async () => {
		const result = await client.triggerEvent({
			data: "jsonTest",
			name: "test",
		});

		expect(result).toHaveProperty("data");

		if (!("data" in result)) {
			return;
		}

		expect(result.data).toHaveProperty("data", "jsonTest");
		expect(result.data).toHaveProperty("name", "test");
	});
});
