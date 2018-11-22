const glicko2 = require('glicko2')
const playerList = require('../initial_data/players/season1.json')
const fs = require('fs')
const currentSeason = 1

const settings = {
  tau: 0.5, // https://medium.com/@jlouis666/glicko2-benchmarking-2-775b573c086f use a low tau since puyo can be variable
  rating: 2000,
  rd: 100,
  vol: 0.06
}

// Analyze
const csv = require('csvtojson')
csv({ delimiter: '\t' })
  .fromFile('ranking/initial_data/matchlogs/season1.txt')
  .then((jsonObj) => { // Load season data from CSV
    let matchData = jsonObj
    return matchData
  })
  .then(setupRankingSystem)
  .then(runGlicko) // Run glicko rankings
  .then(saveSeasonData)


// Hoisted functions 

function getPlayer(name) {
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].name === name) return i
  }
}

function setupRankingSystem(matchData) {
  // Create ranking glicko2 system
  let rankingSystem = new glicko2.Glicko2(settings)

  // Add players to ranking system
  for (let i = 0; i < playerList.length; i++) {
    playerList[i].glicko = rankingSystem.makePlayer(playerList[i].ratings[0].rating, playerList[i].ratings[0].rd, playerList[i].ratings[0].vol)
  }

  // Get names of tournaments played in the season
  let tournamentNames = []
  matchData.forEach((match) => {
    if (parseInt(match.season, 10) === currentSeason) tournamentNames.push(match.tournament)
  })
  tournamentNames = [...new Set(tournamentNames)] // remove duplicates

  // Group tournament names with associated matches
  let tournaments = {}
  tournamentNames.forEach(tournament => {
    tournaments[tournament] = matchData.filter(match => match.tournament === tournament)
  })

  return [rankingSystem, tournaments, tournamentNames]
}

function runGlicko(system) {
  let [rankingSystem, tournaments, tournamentNames] = system
  
  tournamentNames.forEach(tournamentName => {
    // Grab tournament date from one of the tournament matches
    let date = tournaments[tournamentName][0].date

    // Compute glicko ratings from the result of this tournament
    let tournamentMatches = []
    tournaments[tournamentName].forEach(match => {
      let wincode = parseInt(match.p1score, 10) > parseInt(match.p2score, 10) ? 1 : 0
      // console.log(`${match.player1} ${wincode === 1 ? 'wins against' : 'loses to'} ${match.player2}`)
      tournamentMatches.push([playerList[getPlayer(match.player1)].glicko, playerList[getPlayer(match.player2)].glicko, wincode])
    })
    rankingSystem.updateRatings(tournamentMatches)
    console.log(`Tournament: ${tournamentName}`)
    playerList.forEach(player => console.log(`Player ${player.name}: ${player.glicko.getRating()} +/- ${player.glicko.getRd()}`))
    console.log('\n')

    // Update playerList match history
    // First, get a list of each player name
    let nameList = []
    playerList.forEach(player => nameList.push(player.name))

    // For each player, add the subset of matches they participated to their history
    nameList.forEach(player => {
      let matchesPlayed = tournaments[tournamentName].filter(match => match.player1 === player || match.player2 === player)
      playerList[getPlayer(player)].ratings.push({
        date: date,
        matches: matchesPlayed,
        rating: playerList[getPlayer(player)].glicko.getRating(),
        rd: playerList[getPlayer(player)].glicko.getRd(),
        vol: playerList[getPlayer(player)].glicko.getVol()
      })
    })
  })

  return [rankingSystem, tournaments, tournamentNames]
}

function displayValues(system) {
  playerList.forEach(player => {
    console.log(player.ratings)
    player.ratings.forEach(date => {
      console.log(date.matches)
    })
  })
}

function saveSeasonData(system) {
  let [rankingSystem, tournaments, tournamentNames] = system

  fs.writeFile(`public/ranking/data/players/season${currentSeason}.json`, JSON.stringify(playerList, null, 2), function (err) {
    if (err) {
      return console.log(err)
    }

    console.log(`Saved player data for season ${currentSeason}`)
  })

  fs.writeFile(`public/ranking/data/matchlogs/season${currentSeason}.json`, JSON.stringify(tournaments, null, 2), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log(`Saved tournament match sets.`)
  })

  fs.writeFile(`public/ranking/data/matchlogs/season${currentSeason}_order.json`, JSON.stringify(tournamentNames, null, 2), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log(`Saved tournament order`)
  })
}