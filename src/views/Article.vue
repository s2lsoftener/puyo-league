<template>
  <v-layout justify-center row><v-flex>
    <v-container fluid grid-list-xl>
      <v-layout row justify-center>
        <v-flex xs12 sm10 md6>
          <v-layout column v-if="newsData.length > 0">
            <v-flex>
              <v-img
                class="white--text"
                :src="articleData.banner"
                height="200px"
              ></v-img>
            </v-flex>
            <v-flex>
              <span class="display-1">{{ articleData.name }}</span><br>
              <span class="headline grey--text">{{ articleData.date }}</span>
            </v-flex>
            <v-flex pt-0>
              <router-link v-for="tag in articleData.tags" :key="`${articleData.link}_${tag}`" :to="`/news/tag/${tag}`" tag="div" style="display: inline-block !important;">
                <v-chip style="cursor: pointer;"><span style="cursor: pointer;">{{ tag }}</span></v-chip>
              </router-link>
            </v-flex>
            <v-flex v-html="articleData.description">
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex></v-layout>
</template>

<script>
export default {
  name: 'Article',
  data () {
    return {
      newsData: [],
      articleData: {}
    }
  },
  methods: {
    fetchAndParseJSON: function () {
      let me = this

      fetch(`/news.json`)
        .then(function (response) {
          return response.json()
        })
        .then(function (myJson) {
          me.newsData = myJson
        })
        .then(function () {
          me.newsData.reverse()
          me.articleData = me.newsData.filter(article => article.link === me.$route.params.article)[0]
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
