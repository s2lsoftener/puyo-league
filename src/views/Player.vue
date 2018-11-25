<template>
  <v-layout justify-center column>
    <v-flex>
      <v-container fluid grid-list-md>
        <v-layout column>
          <v-flex mb-4>
            <v-layout row justify-center><v-flex xs12 sm10 md8>
                <v-card v-if="seasonData.length > 0">
                  <v-flex>
                    <v-layout row justify-center>
                      <v-flex xs3 align-self-center style="text-align: center;">
                        <img src="@/assets/data/avatars/default.png" height="100px" contain>
                      </v-flex>
                      <v-flex xs6 align-self-center style="text-align: center;">
                        <v-layout column>
                          <v-flex><span class="headline black--text">{{ seasonData[getPlayer()].name }}</span></v-flex>
                          <v-flex><span class="subheading black--text">{{ seasonData[getPlayer()].location }}</span><br>
                            <span class="subheading black--text">Rating: {{ Math.round(seasonData[getPlayer()].ratings[seasonData[getPlayer()].ratings.length - 1].rating, 0) }}
                              &plusmn; {{ Math.round(seasonData[getPlayer()].ratings[seasonData[getPlayer()].ratings.length - 1].rd, 0) }}</span>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex xs3 align-self-center style="text-align: center;">
                        <span class="display-2 black--text">#{{ seasonData[getPlayer()].ranking }}</span>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-card>
            </v-flex></v-layout>
          </v-flex>

          <v-flex>
            <v-layout row justify-center align-content-end align-end><v-flex xs12 sm10 md8 class="text-xs-left">
              <span class="display-2 black--text">Season {{ selectedSeason }}</span>
              <v-pagination v-model="selectedSeason" :length="totalSeasons"></v-pagination>
            </v-flex></v-layout>
          </v-flex>

          <v-flex>
            <v-layout row justify-center><v-flex xs12 sm10 md8>
                <v-data-table :headers="matchHeadings" :items="seasonMatches" class="elevation-1"
                :pagination.sync="pagination">
                  <template slot="items" slot-scope="props">
                    <tr :active="props.item.won">
                      <td>{{ props.item.tournament }}</td>
                      <td class="text-xs-left">{{ props.item.date }}</td>
                      <td class="text-xs-right"><router-link :to="`/player/${props.item.player1}`">{{ props.item.player1 }}</router-link></td>
                      <td class="text-xs-center">{{ props.item.score }}</td>
                      <td class="text-xs-left"><router-link :to="`/player/${props.item.player2}`">{{ props.item.player2 }}</router-link></td>
                      <td class="text-xs-left"><a :href="props.item.video" v-if="props.item.video.length > 0">Link</a></td>
                    </tr>
                  </template>
                </v-data-table>
            </v-flex></v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Player',
  data () {
    return {
      seasonData: [],
      seasonMatches: [],
      selectedSeason: 1,
      totalSeasons: 1,
      matchHeadings: [
        { text: 'Tournament', value: 'tournament' },
        { text: 'Date', value: 'date' },
        { text: 'Player 1', value: 'player1', align: 'right' },
        { text: 'Score', value: 'score', sortable: false, align: 'center' },
        { text: 'Player 2', value: 'player2', align: 'left' },
        { text: 'Video', value: 'video', sortable: false }
      ],
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  methods: {
    getPlayer: function () {
      for (let i = 0; i < this.seasonData.length; i++) {
        if (this.seasonData[i].name === this.$route.params.name) return i
      }
    },
    fetchAndParseJSON: function () {
      let me = this

      fetch(`/ranking/data/players/season1.json`)
        .then(function (response) {
          return response.json()
        })
        .then(function (myJson) {
          me.seasonData = myJson
          return myJson
        })
        .then(function (myJson) {
          console.log(myJson)
        })
        .then(
          fetch(`/ranking/data/matchlogs/season1.json`)
            .then(function (response) {
              return response.json()
            })
            .then(function (myJson) {
              me.seasonMatches = myJson

              // Subset the matches to only the ones the current player participated in.
              me.seasonMatches = me.seasonMatches.filter(match => match.player1 === me.$route.params.name || match.player2 === me.$route.params.name)

              // Computed nice score string for each match
              me.seasonMatches.forEach(match => {
                match.score = `${match.p1score} - ${match.p2score}`
              })

              // Compute whether the player won the match
              me.seasonMatches.forEach(match => {
                (match.player1 === me.$route.params.name && parseInt(match.p1score, 10) > parseInt(match.p2score, 10))
                  ? match.won = true
                  : (match.player2 === me.$route.params.name && parseInt(match.p1score, 10) < parseInt(match.p2score, 10))
                    ? match.won = true
                    : match.won = false
              })
            })
        )
    }
  },
  mounted () {
    this.fetchAndParseJSON()
  },
  watch: {
    '$route' () {
      this.fetchAndParseJSON()
    }
  }
}
</script>

<style>

</style>
