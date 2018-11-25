<template>
  <v-layout justify-center row><v-flex>
    <v-container fluid grid-list-xl>
      <v-layout row justify-center>
        <v-flex xs12 sm10 md6>
          <v-layout column v-if="newsData.length > 0">
            <v-flex v-for="(article, index) in newsData" :key="`article_${index}`">
              <news-card :articleData="article" />
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex></v-layout>
</template>

<script>
import NewsCard from '../components/NewsCard'
export default {
  name: 'News',
  components: {
    NewsCard
  },
  data () {
    return {
      newsData: []
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
        })
        .then(function () {
          if (me.$route.params.tag !== undefined) {
            me.newsData = me.newsData.filter(article => {
              if (article.tags.some(tag => tag === me.$route.params.tag)) return true
            })
          }
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
