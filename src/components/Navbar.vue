<template>
  <nav>
    <v-app-bar elevation="0" dense app>
      <v-app-bar-nav-icon
        class="hidden-lg-and-up"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <div v-if="isUserAuthenticated">
        <v-dialog transition="dialog-top-transition" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-chip outlined v-bind="attrs" v-on="on" color="purple"
              >Баланс: {{ Math.round(balance) }} ₽</v-chip
            >
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="purple darken-2" dark
                >Пополнение баланса</v-toolbar
              >
              <v-container fluid>
                <v-row align="center" justify="center">
                  <v-col cols="5" sm="3" md="3" lg="3">
                    <v-btn
                      @click="paynament()"
                      color="purple darken-2"
                      dark
                      type="submit"
                      >Оплатить</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>

              <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false">Закрыть</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <v-btn icon @click="logout()">
          <v-icon>mdi-exit-to-app</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-btn icon @click="loginform()">
          <v-icon>mdi-lock-open</v-icon>
        </v-btn>
        <v-btn icon @click="regform()">
          <v-icon>mdi-pencil-box-multiple-outline</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer app width="100" class="purple darken-2">
      <v-list v-if="isUserAuthenticated">
        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-list-item-action>
            <div class="ml-1">
              <v-icon :title="link.text" class="white--text ml-4">{{
                link.icon
              }}</v-icon>
            </div>
          </v-list-item-action>
          <v-list-item-content> </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item
          v-for="link in reglinks"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-list-item-action>
            <div class="ml-1">
              <v-icon :title="link.text" class="white--text ml-4">{{
                link.icon
              }}</v-icon>
            </div>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      width="100"
      v-model="drawer"
      app
      class="purple darken-2"
    >
      <v-list v-if="isUserAuthenticated">
        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-list-item-action>
            <div class="ml-1">
              <v-icon class="white--text ml-4">{{ link.icon }}</v-icon>
            </div>
          </v-list-item-action>
          <v-list-item-content> </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list v-else>
        <v-list-item
          v-for="link in reglinks"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-list-item-action>
            <div class="ml-1">
              <v-icon class="white--text ml-4">{{ link.icon }}</v-icon>
            </div>
          </v-list-item-action>
          <v-list-item-content>
            <h4 class="white--text">{{ link.text }}</h4>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    links: [
      { icon: "mdi-account", text: "Настройки", route: "/settings" },
      { icon: "mdi-chart-bar", text: "Кабинет", route: "/" },
    ],
    reglinks: [
      { icon: "mdi-lock-open", text: "Вход", route: "/signin" },
      {
        icon: "mdi-pencil-box-multiple-outline",
        text: "Регистрация",
        route: "/signup",
      },
    ],
  }),
  computed: {
    balance() {
      let b = this.$store.getters.balance;
      if (b == null) {
        return 0;
      }
      return b;
    },
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    },
  },
  methods: {
    logout() {
      this.$confirm("Вы точно хотите выйти?").then((res) => {
        if (res) this.$store.dispatch("SIGNOUT");
      });
    },
    regform() {
      this.$router.push("/signup");
    },
    loginform() {
      this.$router.push("/signin");
    },
    paynament() {
      this.$store.dispatch("PAYNAMENT");
    },
  },
};
</script>