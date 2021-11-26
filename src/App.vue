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
    <Navbar />
    <Footer />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Footer,
    Navbar,
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