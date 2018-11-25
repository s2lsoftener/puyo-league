<template>
  <v-layout justify-start column>
    <v-flex>
      <v-container fluid pb-0>
        <v-layout>
          <v-flex>
            <h1 class="display-2 font-weight-bold">Season {{ currentSeason }}</h1>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
    <v-flex>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 v-for="(player, index) in seasonData" :key="player.name"><v-hover>
              <v-card
                :color="index === 0
                  ? 'amber lighten-3'
                  : index === 1
                    ? 'amber lighten-4'
                    : index === 2
                      ? 'amber lighten-5'
                      : 'white'" style="height: 100%;"
                slot-scope="{ hover }"
                :class="`elevation-${hover ? 6 : 2}`">
                  <router-link :to="`/player/${player.name}`" tag="div" style="cursor: pointer;">
                  <v-flex align-self-start>
                    <v-layout justify-start pa-2 row>
                      <img src="@/assets/data/avatars/default.png" height="100px" contain>
                      <v-flex ml-2>
                        <v-layout column>
                          <v-flex><span class="headline black--text">#{{ player.ranking }} - {{ player.name }}</span></v-flex>
                          <v-flex>Rating: {{ Math.round(player.ratings[player.ratings.length - 1].rating, 0) }}
                            &plusmn; {{ Math.round(player.ratings[player.ratings.length - 1].rd, 0) }}
                            <v-icon v-if="player.ratings[player.ratings.length - 1].rating > player.ratings[player.ratings.length - 2].rating" >trending_up</v-icon>
                            <v-icon v-else-if="player.ratings[player.ratings.length - 1].rating < player.ratings[player.ratings.length - 2].rating">trending_down</v-icon>
                            <v-icon v-else-if="player.ratings.every(period => period.rating === player.ratings[0].rating)">fiber_new</v-icon>
                          </v-flex>
                          <v-flex>Location: {{ player.location }}</v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  </router-link>
              </v-card>
          </v-hover></v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>

</template>

<script>
export default {
  name: 'Rankings',
  data () {
    return {
      seasonData: null,
      currentSeason: 0
    }
  },
  methods: {
    fetchAndParseJSON: function () {
      let me = this

      console.log(this.$route.params.season)

      if (this.$route.params.season === undefined) {
        this.currentSeason = 1
      } else {
        this.currentSeason = this.$route.params.season
      }

      fetch(`/ranking/data/players/season${this.currentSeason}.json`)
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
