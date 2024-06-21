import { loadData, saveData } from "./fileSystem.js";

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

class Player {
	constructor(nickname, familyName, mmr, availability = [], day = [], className, classMode, twitch = '@zeusGhostz'){
		if(nickname === undefined ||
			mmr === undefined ||
			className === undefined ||
			classMode === undefined) throw new Error('required some information about the player')

		this.nickname = nickname
		this.familyName= familyName
		this.mmr = mmr
		this.league = getLeague(mmr)
		this.availability = {
			hour: availability,
			day: day
		}
		this.class = {
			className,
			classMode
		}
		this.twitch = twitch
		this.checkInStatus = false
		this.stats = {
			matchs: 0,
			win: 0,
			loses: 0,
			champion: 0,
			winRate: 0
		}
		this.history = []
	}

	checkIn(){
		if(this.checkInStatus) return console.log('Player already checked in');
		this.checkInStatus = true
		console.log('Player checked');
	}
}


export async function addPlayer(nickname, familyName, mmr, availability, day, className, classMode, twitch) {
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


	players[playersCount] = new Player(nickname, familyName, mmr, availability, day, className, classMode, twitch)

	await saveData(players)
	console.log(`player ${nickname} created successfully`);
}

export async function editPlayer(identifier, field, newValue, searchBy = 'nickname') {
	let players = await loadData()
	let playerId = null
	const playersCount = Object.keys(players).length

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

	let lastValue = players[playerId][field]
	if(lastValue == '') lastValue = 'none'


	if(field == 'mmr'){
		players[playerId].mmr = newValue
		players[playerId].league = getLeague(newValue)
	} else {
		players[playerId][field] = newValue
	}

	await saveData(players)
	console.log(`Player ${players[playerId].nickname} altered
	Field: ${field}
	From ${lastValue} to ${newValue}`);

}

export async function playerInfo(player){
	let players = await loadData();
	const playersCount = Object.keys(players).length

	let playerSelected = {}
	for(let i = 0; i < playersCount; i++){
		if(player == players[i].nickname) {
			playerSelected = players[i]
			break
		}
	}

console.log(playerSelected);

}

export async function stats(playerName) {
	const players = await loadData()
	let player = 0

	for(let i = 0; i < Object.keys(players).length; i++){
		if(playerName == players[i].nickname) {
			player = i
			break
		}
	}

	console.log(`The player ${playerName}
Matchs: ${players[player].stats.matchs}
Win: ${players[player].stats.win}
Loses: ${players[player].stats.loses}
champion: ${players[player].stats.champion}
Win Rate: ${players[player].stats.winRate}`);

	return players[player].stats
}

export async function history(playerName) {
	console.log(`history of ${playerName}`);
}