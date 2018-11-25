<template>
  <v-layout justify-center row><v-flex>
    <v-container fluid grid-list-xl>
      <v-layout row justify-center>
        <v-flex xs12 sm10 :md6="viewMode === 'timeline'" :md8="viewMode === 'table'">
          <v-layout column>

            <v-flex>
              <v-btn @click="viewMode = 'timeline'">
                <span>Timeline</span>
              </v-btn>
              <v-btn @click="viewMode = 'table'; search = ''; fullTable = true">
                <span>View All</span>
              </v-btn>
            </v-flex>

            <v-flex v-show="viewMode === 'timeline'">
              <v-timeline dense>
                <v-timeline-item
                  v-for="(tournament, i) in tournamentMetadata"
                  :key="i"
                >
                  <span
                    slot="opposite"
                    :class="`title font-weight-bold`"
                    v-text="tournament.date"
                  ></span>
                  <div class="py-3">
                      <v-layout>
                      <v-flex @click="viewTournamentTable(tournament)" style="cursor: pointer;">
                        <router-link :to="`/tournaments/${tournament.tournament}`" tag="div">
                        <v-card>
                          <v-img
                            class="white--text"
                            :src="tournament.banner"
                          ></v-img>
                          <v-card-title>
                            <div>
                              <span class="title">{{ tournament.full_name }}</span><br>
                              <span>{{ tournament.date }}</span><br>
                            </div>
                          </v-card-title>
                        </v-card>
                        </router-link>
                      </v-flex></v-layout>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-flex>

            <v-flex v-show="viewMode === 'table'">
              <v-layout row justify-center><v-flex>
                <v-flex>
                  <span class="display-1" v-show="fullTable">Season {{ selectedSeason }}</span>
                  <span class="display-1" v-show="!fullTable">{{ currentTournament.full_name }}</span>
                </v-flex>
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
                <v-flex class="text-xs-center">
                  <span class="title">First Place</span>
                </v-flex>
              </v-flex></v-layout>
            </v-flex>

          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex></v-layout>
</template>

<script>
export default {
  name: 'Tournaments',
  data () {
    return {
      viewMode: 'timeline',
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
      currentTournament: {}
    }
  },
  methods: {
    fetchAndParseJSON: function () {
      let me = this

      fetch(`/ranking/data/matchlogs/season1_tourneys.json`)
        .then(function (response) {
          return response.json()
        })
        .then(function (myJson) {
          me.tournamentMetadata = myJson
          me.tournamentMetadata.reverse()
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
