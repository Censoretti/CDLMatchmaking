import { loadData, saveData } from "./fileSystem.js";

class match {
	constructor(id, hour, day, player1Nickname, player2Nickname) {
		this.id = id
		this.date = {
			time: hour,
			day: day
		}
		this.player1 = player1Nickname
		this.player2 = player2Nickname
		this.result = {
			winner: '',
			round1: '',
			round2: '',
			round3: ''
		}
		this.vod = ''
	}

	win(player){
		console.log(player);
	}
}

export async function win() {}