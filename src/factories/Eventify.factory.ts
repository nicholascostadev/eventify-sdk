import dotenv from "dotenv";

import { Eventify } from "../Eventify/index.js";

dotenv.config();

export function createEventify() {
	const WORKSPACE_ID = process.env.WORKSPACE_ID ?? "";
	const API_KEY = process.env.API_KEY ?? "";

	return new Eventify({
		apiKey: API_KEY,
		workspaceId: WORKSPACE_ID,
	});
}
