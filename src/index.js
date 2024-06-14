#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from 'yargs/helpers'
import inquirer from "inquirer";
import * as playerManager from "./handlers/playerManager.js";
import * as matchmaking from "./handlers/matchmaking.js";
import * as match from "./handlers/match.js"

// Utility function to validate numeric input
const validateNumber = (input) => {
	if(!isNaN(input) && input !== '') {
		return true
	}
	return 'Please enter a valid number'
}


// Utility function to validate availability input
const validateAvailability = (input) => {
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
		{name: 'availability', message: 'Availability: ', validate: validateAvailability, when: !answers.availability},
		{name: 'className', message: 'Class: ', validate: input => input !== '' || 'Class name is required', when: !answers.className},
		{name: 'clasMode', message: 'Class mode: ', validate: input => input !== '' || 'Class mode is required', when: !answers.classMode},
		{name: 'twitch', message: 'Twitch name: ', when: !answers.twitch}
	]

	let test = true
	while(test) {
		const newAnswers = await inquirer.prompt(questions)

		// merge answers
		answers = {...answers, ...newAnswers}

		//convert availability into an array of numbers
		if(answers.availability && typeof answers.availability === 'string'){
			answers.availability = answers.availability.split(',').map(item => parseInt(item.trim(), 10));
		}

		// convert mmr to int
		if (answers.mmr && typeof answers.mmr === 'string') {
      answers.mmr = parseInt(answers.mmr, 10);
    }

		//validate required fields
		if(answers.nickname 
			&& answers.familyName
			&& answers.mmr
			&& answers.className
			&& answers.classMode){
				test = false
				return answers
			}

			// update questions to only ask missing requireds ones
			questions = questions.map((question) => ({
				...question,
				when: !answers[question.name]
			}));
	}
}

yargs(hideBin(process.argv))
	.command('stats [name]', 'Stats of a player', (yargs) => {
		return  yargs.positional('name', {
      describe: 'Name of the player to view stats',
      type: 'string'
    })
	}, async (argv) => {
		playerManager.stats(argv.name)
	})
	.command('add', 'Add new player', () => {}, async () => {
		const answers = await requiredQuestions()
		console.log(answers);
	})
	.help()
	.argv
	