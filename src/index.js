#!/usr/bin/env node

import * as playerManager from "./handlers/playerManager.js";
import * as matchmaking from "./handlers/matchmaking.js";
import * as match from "./handlers/match.js"

stats()
matchmaking()

// addPlayer("player3", "0", "kzarka", [21,22], "guardian suc")
// editPlayer("player3")