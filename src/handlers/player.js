import { loadData, saveData } from "./fsFuncionality.js";

const leagues = [
	{ max: 40, league: 'liverto' },
	{ max: 60, league: 'liverto+' },
	{ max: 81, league: 'kzarka' },
	{ max: 121, league: 'kzarka+' },
	{ max: 161, league: 'blackstar' },
	{ max: Infinity, league: 'blackstar+' },
];

function getLeague(mmr) {

	for (const range of leagues) {
			if (mmr < range.max) {
					return range.league;
			}
	}
}

export async function addPlayer(nickname, mmr, availability, gameClass, league = 'default') {
	let players = await loadData();
	const playersCount = Object.keys(players).length

	let playerExist = false
	for(let i = 0; i < playersCount; i++){
		if(nickname == players[i].nickname) {
			playerExist = true
			break
		}
	}

	if(playerExist) return console.log('player already created');

	if(league === 'default') league = getLeague(mmr);

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
export async function editPlayer(identifier, fiedl, newValue, searchBy = 'nickname') {
	let players = await loadData()
	let playerId = null

	if (searchBy == 'nickname' ) {
		for(let i = 0; i < playersCount; i++){
			if(identifier == players[i].nickname) {
				playerId = i
				break
			}
		}
	} else if (searchBy == 'id'){
		playerId = identifier
	}

	switch (fiedl) {
		case 'nickname':
			players[playerId].nickname = newValue
			break;
		case 'mmr':
			players[playerId].mmr = newValue
			players[playerId].league = getLeague(newValue)
			break;
		case 'availability':
			players[playerId].availability = newValue
			break;
		case 'gameClass':
			players[playerId].gameClass = newValue
			break;
		default:
			return console.log('Field not valid');
	}

	await saveData(players)

}

export async function checkInPlayer(id, check) {
	if(typeof check != "boolean") return console.log('not valid check');
	const players = await loadData();
	if (!players[id]) {
			console.log('Player not found.');
			return;
	}
	players[id].checkIn = check
	console.log(`Player ${players[id].nickname} check-in status updated successfully.`);
}

export async function checkId(nickname) {
	const players = await loadData()
	for(let i = 0; i < playersCount; i++){
		if(nickname == players[i].nickname) {
			console.log(`Player id is: ${i}`);
			break
		}
	}
}

export async function stats() {
	console.log('test');
}
export async function history() {}