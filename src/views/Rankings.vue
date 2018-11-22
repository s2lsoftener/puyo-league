<template>
  <v-container>
    <v-card>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12 v-for="(player, index) in seasonData" :key="player.name">
            <v-card
              :color="index === 0
                ? 'amber lighten-3'
                : index === 1
                  ? 'amber lighten-4'
                  : index === 2
                    ? 'amber lighten-5'
                    : 'white'">
              <v-layout>
                <v-flex xs5>
                  <v-img src="@/assets/data/avatars/default.png" height="125px" contain></v-img>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Rankings',
  data () {
    return {
      seasonData: null
    }
  },
  mounted () {
    let me = this

    fetch(`/ranking/data/players/season${this.$route.params.season}.json`)
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
  },
  watch: {

  }
}
</script>

<style>

</style>
