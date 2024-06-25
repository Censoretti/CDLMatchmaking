#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from 'yargs/helpers'
import inquirer from "inquirer";
import autocompletePrompt from "inquirer-autocomplete-prompt";
import { loadData } from "./handlers/fileSystem.js";
import * as playerManager from "./handlers/playerManager.js";
import * as matchmaking from "./handlers/matchmaking.js";

// Register the autocomplete prompt
inquirer.registerPrompt('autocomplete', autocompletePrompt);

// Utility function to validate numeric input
const validateNumber = (input) => {
	if(!isNaN(input) && input !== '') {
		return true
	}
	return 'Please enter a valid number'
}


// Utility function to validate availability input
const validateAvailability = (input) => {
	if(input == '') {
		return true
	}
	const availabilityArray = input.split(',').map(item => item.trim())
	const isValid = availabilityArray.every(item => !isNaN(item))
	if(isValid) {
		return true
	}
	return 'Please enter a comma-separated list of numbers'
}

// Function to prompt required questions to add a player with complete information
const requiredQuestions = async (initialAnswers = {}) => {
	let answers = { ...initialAnswers };
	let questions = [
		{name: 'nickname', message: 'Player nickname: ', validate: input => input !== '' || 'Nickname is required', when: !answers.nickname},
		{name: 'familyName', message: 'Player family name: ', validate: input => input !== '' || 'Family name is required', when: !answers.familyName},
		{name: 'mmr', message: 'MMR of this player: ', validate: validateNumber, when: !answers.mmr},
		{name: 'availability', message: 'Hours available: (comma separated) ', validate: validateAvailability, when: !answers.availability},
		{name: 'day', message: 'Days available: ', type: 'checkbox', choices: ['Thursday', 'Friday', 'Saturday']},
		{name: 'className', message: 'Class: ', type: 'list', choices: ['Archer', 'Berserker', 'Corsair', 'Dark Knight', 'Drakania', 'Guardian'], when: !answers.className},
		{name: 'classMode', message: 'Class mode: ', type: 'list', choices: ['Succession', 'Awakening'], when: !answers.classMode},
		{name: 'twitch', message: 'Twitch name: ', when: !answers.twitch}
	]
	
  for (const question of questions) {
    if (!answers[question.name]) {
			
      const newAnswer = await inquirer.prompt([question]);
      answers = { ...answers, ...newAnswer };

		// Convert availability to array of numbers
		if (question.name === 'availability') {
			if (answers.availability === '') {
				answers.availability = [];
			} else {
				answers.availability = answers.availability.split(',').map(item => parseInt(item.trim(), 10)).filter(num => !isNaN(num));
			}
		}
      // Convert mmr to a number
      if (question.name === 'mmr' && typeof answers.mmr === 'string') {
        answers.mmr = parseInt(answers.mmr, 10);
      }
    }
  }

  return answers;

}

// Function to search players by nickname for autocomplete
const searchPlayers = async (answers, input = '') => {
  const players = await loadData();
  return Object.values(players)
    .map(player => player.nickname)
    .filter(nickname => nickname.toLowerCase().includes(input.toLowerCase()));
};

yargs(hideBin(process.argv))
	// command to see stats of a player
	.command('stats', 'Stats of a player', () => {}, async () => {
		console.clear();
		const answers = await inquirer.prompt([
			{
				type: 'autocomplete',
				name: 'player',
				message: 'Search for a player',
				source: searchPlayers
			}
		]);
		playerManager.stats(answers.player);
	})
	// command to add a new player
	.command('add', 'Add new player', () => {}, async () => {
		console.clear();
		const answers = await requiredQuestions()
		playerManager.addPlayer(answers.nickname, answers.familyName, answers.mmr, answers.availability, answers.day, answers.className, answers.classMode, answers.twitch)
	})
	// command to see match history of a player
	.command('history', 'Match history of a player', () => {}, async () => {
		console.clear();
		const answers = await inquirer.prompt([
			{
				type: 'autocomplete',
				name: 'player',
				message: 'Search for a player: ',
				source: searchPlayers
			}
		]);
		playerManager.history(answers.player);
	})
	// command to edit a player 
	.command('edit', 'Edid a value of a player', () => {}, async () => {
		const answers = await inquirer.prompt([
			{type: 'autocomplete', name: 'player', message: 'Which player you want to modify?',source: searchPlayers},
			{name: 'field', message: 'What you want to modify?', type: 'list', choices: ['nickname', 'familyName', 'mmr', 'availability', 'className', 'classMode','twitch']},
			{name: 'newValue', message: 'For what you want to modify?', validate: input => input !== '' || 'Value is required'}
		])
		playerManager.editPlayer(answers.player, answers.field, answers.newValue)
	})
	// command to see all info of a player
	.command('info', 'All information of a player', () => {}, async () => {
		console.clear();
		const answers = await inquirer.prompt([
			{
				type: 'autocomplete',
				name: 'player',
				message: 'Search for a player: ',
				source: searchPlayers
			}
		]);
		playerManager.playerInfo(answers.player);
	})
	// command to do matchmaking
	.command('matchmaking', 'Do a matchmaking with all players that is checked in', () => {}, async () => {
		console.clear()
		matchmaking.matchmaking()
	})
	.help()
	.argv
	