<template>
  <v-app class="grey lighten-4">
    <v-snackbar v-model="snackbar">
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
      {{ error }}
    </v-snackbar>
    <NavigationBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavigationBar from "./components/NavigationBar.vue";

export default {
  name: "App",
  components: {
    NavigationBar,
  },
  data: () => ({
    snackbar: false,
  }),
  computed: {
    error() {
      return this.$store.getters.getError;
    },
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    },
  },
  watch: {
    error(val) {
      if (val != null) {
        this.snackbar = true;
      } else {
        this.snackbar = false;
      }
    },
  },
};
</script>
