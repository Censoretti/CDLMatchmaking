import { loadData } from "./fsFuncionality.js";

export async function matchmaking() {
	const players = await loadData()
	let ranges = {}
	for(const range of Object.keys(players)){
		console.log(players[range]);
	}
}