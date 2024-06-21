import fs from "node:fs/promises";
import {
	existsSync
} from "node:fs";
import path from "node:path";

const sourceDir = path.resolve("./src/data");

let variablesData = {};

async function ensureFileExists(filePath) {
	if (!existsSync(filePath)) {
		await fs.writeFile(filePath, JSON.stringify({}));
	}
}

async function loadData(fileName = 'players') {
	const filePath = path.join(sourceDir, `${fileName}.json`);

	try {
		if (!existsSync(sourceDir)) {
			await fs.mkdir(sourceDir, {
				recursive: true
			});
		}
		await ensureFileExists(filePath);

		const data = await fs.readFile(filePath, "utf-8");
		variablesData = JSON.parse(data);
	} catch (error) {
		console.error("Error loading data:", error);
		variablesData = {};
	}

	return variablesData;
}

async function saveData(data, fileName = 'players') {
	const filePath = path.join(sourceDir, `${fileName}.json`);
	try {
		await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
	} catch (error) {
		console.error("Error saving data:", error);
	}
}

export {
	loadData,
	saveData
};