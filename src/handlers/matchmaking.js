import { loadData, saveData } from "./fileSystem.js";

class Match {
  constructor(id, hour, day, player1Nickname, player2Nickname, roundsQuantity = 3) {
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
    this.vod.link = link;
  }

  static generateId(matches) {
    return matches.length + 1;
  }
}

export async function matchmaking() {
  const players = await loadData();
  const matches = [];
  const matchHistory = [];
  const playersCheckedIn = Object.values(players).filter(player => player.checkInStatus);

  // Group players by league, then by hour, then by day
  const groupedPlayers = {};
  for (const player of playersCheckedIn) {
    const league = player.league;
    if (!groupedPlayers[league]) groupedPlayers[league] = {};

    for (const hour of player.availability.hour) {
      if (!groupedPlayers[league][hour]) groupedPlayers[league][hour] = {};

      for (const day of player.availability.day) {
        if (!groupedPlayers[league][hour][day]) groupedPlayers[league][hour][day] = [];
        groupedPlayers[league][hour][day].push(player);
      }
    }
  }

  // Create matches
  let matchId = 0;
  for (const league in groupedPlayers) {
    for (const hour in groupedPlayers[league]) {
      for (const day in groupedPlayers[league][hour]) {
        const playersAtTime = groupedPlayers[league][hour][day];

        // Sort players to prioritize matching players in pairs first
        playersAtTime.sort((a, b) => b.availability.hour.length - a.availability.hour.length);

        while (playersAtTime.length >= 2 && matches.filter(m => m.date.time === hour && m.date.day === day).length < 4) {
          const player1 = playersAtTime.shift();
          const player2 = playersAtTime.shift();
          const match = new Match(++matchId, hour, day, player1.nickname, player2.nickname);
          matches.push(match);

          // Update players' match history and checkout
          player1.history.push(match.id);
          player2.history.push(match.id);
          player1.checkInStatus = false;
          player2.checkInStatus = false;

          matchHistory.push({
            id: match.id,
            date: match.date,
            player1: match.player1,
            player2: match.player2
          });
        }
      }
    }
  }

  // Save matches to data/matches.js
  await saveData(matches, 'matches');

  // Save match history to data/matchHistory.json
  await saveData(matchHistory, 'matchHistory');

  // Check for players without a match
  const playersWithoutMatch = playersCheckedIn.filter(player => player.checkInStatus);
  if (playersWithoutMatch.length > 0) {
    console.log("Players without a match:");
    playersWithoutMatch.forEach(player => console.log(player.nickname));
  } else {
    console.log("All players have a match.");
  }

	console.log(matches);
}
