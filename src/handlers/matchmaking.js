import { loadData } from "./fsFuncionality.js";

export async function matchmaking() {
	const players = await loadData()
	let ranges = {}
	for(const range of Object.keys(players)){
		// console.log(players[range].availability);
		for(const hours of players[range].availability){
			if(ranges[hours] == undefined) ranges[hours] = []
			// console.log(players[range].nickname);
			ranges[hours].push(players[range].nickname)
		}
	}
	console.log(ranges);
}