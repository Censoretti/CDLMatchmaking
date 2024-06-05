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

	if (players.some(player => player.nickname === nickname)) {
			console.log('Player already exists');
			return;
	}

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
		playerId = players.findIndex(player => player.nickname == identifier)
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
	let players = await loadData()
	if(typeof check != "boolean") return console.log('not valid check');
	players[id].checkIn = check
}
