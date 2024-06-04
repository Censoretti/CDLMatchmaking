import { loadData, saveData } from "./fsFuncionality.js";

export async function addPlayer(nickname, mmr, league, availability, gameClass) {
	let players = await loadData()
	const playersCount = Object.keys(players).length

	let playerExist = false
	for(let i = 0; i < playersCount; i++){
		if(nickname == players[i].nickname) playerExist = true
	}

	if(playerExist) return console.log('player already created');

	players[playersCount] = {
		"nickname": nickname,
		"mmr": mmr,
		"league": league,
		"availability": availability,
		"gameClass": gameClass,
		"checkIn": false
	}

	await saveData(players)
	console.log(`player ${nickname} created successfully`);
}
export async function editPlayer(nickname) {
	let players = await loadData()
	const playersCount = Object.keys(players).length

	let playerId = '0'
	for(let i = 0; i < playersCount; i++){
		if(nickname == players[i].nickname) playerId = i
	}
	
	console.log(players[playerId]);
}
export async function checkInPlayer() {}
