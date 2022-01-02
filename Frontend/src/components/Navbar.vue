<template>
  <nav>
    <v-app-bar
      class="hidden-lg-and-up"
      color="#3a0078"
      dark
      v-if="isUserAuthenticated"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      color="#3a0078"
      v-model="drawer"
      absolute
      temporary
    >
      <v-layout column align-center v-if="isUserAuthenticated">
        <v-flex class="mt-5">
          <div class="card">
            <div class="data">
              <label class="left-menu__wallet__title">Счёт:</label>
              <div class="left-menu__wallet__text">
                {{ Math.round(balance) }} ₽
              </div>

              <label class="left-menu__wallet__title">Взаимозачёт:</label>
              <div class="left-menu__wallet__text">0 ₽</div>
            </div>
          </div>
        </v-flex>
      </v-layout>

      <v-list v-if="isUserAuthenticated">
        <v-list-item router to="/profile">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text"> Кабинет</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/balance">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-wallet</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text">Пополнение баланса</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-chart-bar</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text">
              Статистика</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          v-if="isUserAuthenticated"
          :value="false"
          no-action
          color="white"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="white--text">
                <v-icon class="mr-5 white--text">mdi-table</v-icon>
                Мои кампании</v-list-item-title
              >
            </v-list-item-content>
          </template>

          <v-list-item router to="/campaing/create">
            <v-list-item-title class="white--text"
              >Создание кампании</v-list-item-title
            >
          </v-list-item>
          <v-list-item router to="/campaings">
            <v-list-item-title class="white--text"
              >Список кампаний</v-list-item-title
            >
          </v-list-item>
        </v-list-group>

        <v-list-item @click="logout()">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-exit-to-app</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">Выйти</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      app
      color="#3a0078"
      v-if="isUserAuthenticated"
    >
      <v-layout column align-center v-if="isUserAuthenticated">
        <v-flex class="mt-5">
          <div class="card">
            <div class="data">
              <label class="left-menu__wallet__title">Счёт:</label>
              <div class="left-menu__wallet__text">
                {{ Math.round(balance) }} ₽
              </div>

              <label class="left-menu__wallet__title">Взаимозачёт:</label>
              <div class="left-menu__wallet__text">0 ₽</div>
            </div>
          </div>
        </v-flex>
      </v-layout>

      <v-list v-if="isUserAuthenticated">
        <v-list-item router to="/profile">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text"> Кабинет</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/balance">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-wallet</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text">Пополнение баланса</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to="/">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-chart-bar</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text">
              Статистика</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          v-if="isUserAuthenticated"
          :value="false"
          no-action
          color="white"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="white--text">
                <v-icon class="mr-5 white--text">mdi-table</v-icon>
                Мои кампании</v-list-item-title
              >
            </v-list-item-content>
          </template>

          <v-list-item router to="/campaing/create">
            <v-list-item-title class="white--text"
              >Создание кампании</v-list-item-title
            >
          </v-list-item>
          <v-list-item router to="/campaings">
            <v-list-item-title class="white--text"
              >Список кампаний</v-list-item-title
            >
          </v-list-item>
        </v-list-group>

        <v-list-item @click="logout()">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-exit-to-app</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="white--text">Выйти</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
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
  },
};
</script>

<style scoped>
label {
  margin: 0;
  border: 0;
  padding: 0;
  vertical-align: middle;
  white-space: normal;
  background: none;
  line-height: 1;
}
.card {
  width: 240px;
  padding: 12px 20px;
  background: #5c2f8e;
  border-radius: 6px;
  display: block;
}

.left-menu__wallet__title {
  color: #fff;
  opacity: 0.5;
  display: flex;
}
.left-menu__wallet__text {
  margin-top: 4px;
  display: flex;
  font-size: 16px;
  line-height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>