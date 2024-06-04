import  fs from "node:fs/promises"
import fsc from "node:fs"

let variablesData
const sourceDir = "./src/data"
const dirName = sourceDir + "/players.json"

export async function loadData() {
	let data = {}
	if (!fsc.existsSync((sourceDir))) await fs.mkdir(sourceDir)
	if (!fsc.existsSync((dirName))) await fs.writeFile((dirName), JSON.stringify(data))
	
	try {
		variablesData = JSON.parse(
			await fs.readFile(dirName)
		)
	} catch(e) {
		console.log(e);
	}
	
	variablesData = variablesData != undefined ? variablesData : {}

	return variablesData

}

export async function saveData(data) {
	await fs.writeFile(dirName, JSON.stringify(data))
}
