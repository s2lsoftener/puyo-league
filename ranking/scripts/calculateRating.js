/* Load files */
const glicko2 = require('glicko2')
const playerList = require('../data/players/season1.json')
let matchData

// CSV/TSV parser
const csv = require('csvtojson')
csv({ delimiter: '\t' })
  .fromFile('ranking/data/matchlogs/season1.txt')
  .then((jsonObj) => {
    matchData = jsonObj
    console.log(matchData)
  })

const getPlayer = function (name) {
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].name === name) return i
  }
}

const settings = {
  tau: 0.5,
  rating: 2000,
  rd: 200,
  vol: 0.06
}

var ranking = new glicko2.Glicko2(settings)

// Create players
for (let i = 0; i < playerList.length; i++) {
  playerList[i].glicko = ranking.makePlayer()
}

var matches = []
matches.push([playerList[getPlayer('unkoさん')].glicko, playerList[getPlayer('Kuroko')].glicko, 1])
matches.push([playerList[getPlayer('unkoさん')].glicko, playerList[getPlayer('Kuroko')].glicko, 0.5])
ranking.updateRatings(matches)

// console.log('unkoさん new rating: ' + playerList[getPlayer('unkoさん')].glicko.getRating())
// console.log('unkoさん new rating deviation: ' + playerList[getPlayer('unkoさん')].glicko.getRd())
// console.log('unkoさん new volatility: ' + playerList[getPlayer('unkoさん')].glicko.getVol())

// var players = ranking.getPlayers()
