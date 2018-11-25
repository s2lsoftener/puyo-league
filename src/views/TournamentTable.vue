<template>
  <v-layout justify-center row><v-flex>
    <v-container fluid grid-list-xl>
      <v-layout row justify-center>
        <v-flex xs12 sm10 md8>
          <v-layout column>

            <!-- banner -->
            <v-flex>
              <v-layout><v-flex>
                <v-img :src="currentTournament.banner"></v-img>
              </v-flex></v-layout>
            </v-flex>

            <!-- title -->
            <v-flex>
              <v-layout>
                <v-flex class="text-xs-center">
                    <h1>Season {{ selectedSeason }}<span v-show="useRouteParam">: {{ currentTournament.tournament }}</span></h1>
                    <h2 v-show="useRouteParam">{{ currentTournament.date }}</h2>
                </v-flex>
                <v-flex class="text-xs-center" v-show="useRouteParam">
                  <v-layout row justify-center>
                    <v-flex class="text-xs-center" shrink>
                      <h2>🥇</h2>
                      <h3>🥈</h3>
                      <h4>🥉</h4>
                    </v-flex>
                    <v-flex class="text-xs-center" shrink>
                      <h2>{{ currentTournament.firstPlace }}</h2>
                      <h3>{{ currentTournament.secondPlace }}</h3>
                      <h4>{{ currentTournament.thirdPlace }}</h4>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>

            <!-- Information -->
            <v-flex v-show="useRouteParam">
              <h1>Information</h1>
              <ul>
                <li>Game Mode: Tsu</li>
                <li>Win Count: FT20</li>
              </ul>
              <p>For more information, view the original article: <router-link :to="`/news/${currentTournament.news_article_link}`">Link</router-link></p>
            </v-flex>

            <!-- table -->
            <v-flex>
              <h1>Matches</h1>
              <v-layout row justify-center><v-flex>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                  v-show="fullTable"
                ></v-text-field>
                <v-data-table :headers="matchHeadings" :items="seasonData" class="elevation-1"
                :pagination.sync="pagination" :search="search">
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

            <!-- bracket -->
            <v-flex v-show="useRouteParam">
              <h1>Rating Impact</h1>
              <!-- get challonge iframe based on url? -->
            </v-flex>

          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex></v-layout>
</template>

<script>
export default {
  name: 'TournamentTable',
  data () {
    return {
      tournamentMetadata: [],
      seasonData: [],
      matchHeadings: [
        { text: 'Tournament', value: 'tournament' },
        { text: 'Date', value: 'date' },
        { text: 'Player 1', value: 'player1', align: 'right' },
        { text: 'Score', value: 'score', sortable: false, align: 'center' },
        { text: 'Player 2', value: 'player2', align: 'left' },
        { text: 'Video', value: 'video', sortable: false }
      ],
      pagination: {
        rowsPerPage: 20
      },
      search: '',
      fullTable: false,
      selectedSeason: 1,
      currentTournament: {},
      useRouteParam: false
    }
  },
  methods: {
    fetchAndParseJSON: function () {
      let me = this

      if (this.$route.params.tournament !== undefined) {
        this.useRouteParam = true
      }

      if (this.useRouteParam === true) {
        this.search = this.$route.params.tournament
      }

      fetch(`/ranking/data/matchlogs/season1_tourneys.json`)
        .then(function (response) {
          return response.json()
        })
        .then(function (myJson) {
          me.tournamentMetadata = myJson

          if (me.useRouteParam === true) {
            me.currentTournament = me.tournamentMetadata.filter(tournament => tournament.tournament === me.$route.params.tournament)[0]
          }
        })
        .then(
          fetch(`/ranking/data/matchlogs/season1.json`)
            .then(function (response) {
              return response.json()
            })
            .then(function (myJson) {
              me.seasonData = myJson
              me.seasonData.forEach(match => {
                match.score = `${match.p1score} - ${match.p2score}`
              })
            })
        )
    },
    viewTournamentTable: function (tournament) {
      this.$vuetify.goTo('#top', { duration: 300, offset: -100, easing: 'easeInOutCubic' })
      this.viewMode = 'table'
      this.fullTable = false
      this.search = tournament.tournament
      this.currentTournament = tournament
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
