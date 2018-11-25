<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>PUYO</span>
        <span class="font-weight-light">LEAGUE</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat to="/news/about">
        <span>About</span>
      </v-btn>
    </v-toolbar>

    <v-content style="padding-bottom: 100px;">
      <div id="top" style="width: 0px; height: 0px;"></div>
      <router-view/>
    </v-content>
    <v-bottom-nav
      fixed
      app
      style="bottom: 60px;"
    >
      <v-btn flat color="red" to="/">
        <span>News</span>
        <v-icon>event_note</v-icon>
      </v-btn>

      <v-btn flat color="red" to="/rankings/">
        <span>Rankings</span>
        <v-icon>format_list_numbered</v-icon>
      </v-btn>

      <v-btn flat color="red" to="/tournaments">
        <span>Tournaments</span>
        <v-icon>device_hub</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>
