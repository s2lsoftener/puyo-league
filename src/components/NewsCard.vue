<template>
  <v-card>
    <router-link :to="`/news/${articleData.link}`" tag="div" style="cursor: pointer;">
    <v-img
      class="white--text"
      :src="articleData.banner"
    ></v-img>
    <v-card-title>
      <div>
        <span class="title">{{ articleData.name }}</span><br>
        <span>{{ articleData.date }}</span><br>
      </div>
    </v-card-title>
    </router-link>
    <v-card-actions>
      <router-link v-for="tag in articleData.tags" :key="`${articleData.link}_${tag}`" :to="`/news/tag/${tag}`" tag="div">
        <v-chip style="cursor: pointer;"><span style="cursor: pointer;">{{ tag }}</span></v-chip>
      </router-link>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'NewsCard',
  props: {
    articleData: Object
  }
}
</script>

<style>

</style>
