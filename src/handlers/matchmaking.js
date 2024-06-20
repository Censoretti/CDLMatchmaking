import {
	loadData,
	saveData
} from "./fileSystem.js";
import axios from "axios";

class Match {
	constructor(id, hour, day, player1Nickname, player2Nickname, roundsQuantity) {
		this.id = id;
		this.date = {
			time: hour,
			day: day
		};
		this.player1 = player1Nickname;
		this.player2 = player2Nickname;
		this.result = {
			player1Wins: 0,
			player2Wins: 0,
			rounds: this.initializeRounds(roundsQuantity),
			winner: null
		};
		this.vod = {
			link: '',
			title: ''
		};
		this.roundLimit = roundsQuantity;
	}

	initializeRounds(roundsQuantity) {
		if (roundsQuantity !== 3 && roundsQuantity !== 5) {
			throw new Error('Only best of 3 or best of 5 matches are supported');
		}

		let rounds = {};
		for (let i = 0; i < roundsQuantity; i++) {
			rounds[`round${i + 1}`] = '';
		}

		return rounds;
	}

	win(player) {
		if (player !== this.player1 && player !== this.player2) {
			console.log('Invalid player');
			return;
		}

		if (this.result.winner) {
			console.log(`Match already won by ${this.result.winner}`);
			return;
		}

		// Prevent adding more wins than rounds
		if (this.result.player1Wins + this.result.player2Wins >= this.roundLimit) {
			console.log('All rounds have been played');
			return;
		}

		// Record the win for the player
		const currentRound = this.result.player1Wins + this.result.player2Wins + 1;
		if (player === this.player1) {
			this.result.player1Wins += 1;
		} else {
			this.result.player2Wins += 1;
		}
		this.result.rounds[`round${currentRound}`] = player;

		// Check for match completion
		if ((this.roundLimit === 3 && (this.result.player1Wins === 2 || this.result.player2Wins === 2)) ||
			(this.roundLimit === 5 && (this.result.player1Wins === 3 || this.result.player2Wins === 3))) {
			this.result.winner = this.result.player1Wins > this.result.player2Wins ? this.player1 : this.player2;
			console.log(`Match Over: ${this.result.winner} wins`);
		} else {
			console.log(`${player} wins this round`);
		}
	}

	vodAdd(link) {
		this.vod.link = link
	}

	// vod link, deactivated until get youtube apikey
	// async vodAdd(vodLink, apiKey) {
	//     // Validate the YouTube link and retrieve the video title
	//     const videoId = this.extractYouTubeVideoId(vodLink);
	//     if (!videoId) {
	//         console.log('Invalid YouTube link');
	//         return;
	//     }

	//     const videoTitle = await this.getYouTubeVideoTitle(videoId, apiKey);
	//     if (!videoTitle) {
	//         console.log('YouTube video not found');
	//         return;
	//     }

	//     this.vod = {
	//         link: vodLink,
	//         title: videoTitle
	//     };
	//     console.log('VOD link and title added');
	// }

	// extractYouTubeVideoId(url) {
	//     const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^&]+)|youtube\.com\/embed\/([^&]+)/;
	//     const match = url.match(regex);
	//     return match ? match[1] || match[2] || match[3] : null;
	// }

	// async getYouTubeVideoTitle(videoId, apiKey) {
	//     try {
	//         const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`);
	//         if (response.data.items && response.data.items.length > 0) {
	//             return response.data.items[0].snippet.title;
	//         }
	//     } catch (error) {
	//         console.error('Error fetching YouTube video title:', error);
	//     }
	//     return null;
	// }

	static generateId(matches) {
		return matches.length + 1;
	}
}

export async function matchmaking() {
	const players = await loadData()
	let ranges = {}
	for (const range of Object.keys(players)) {
		for (const hours of players[range].availability) {
			if (ranges[hours] == undefined) ranges[hours] = []
			ranges[hours].push(players[range].nickname)
		}
	}
	console.log(ranges);
}