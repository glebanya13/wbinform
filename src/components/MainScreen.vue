<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-col cols="12" sm="12" md="4" class="mt-3">
        <v-card elevation="3" shaped>
          <v-row>
            <v-col cols="4" class="mt-2">
              <v-icon x-large>mdi-cash</v-icon>
            </v-col>
            <v-col cols="5">
              <h3 class="subheading grey--text mt-1">Баланс</h3>
              <h3 class="purple--text darken-2">{{ Math.round(balance) }} ₽</h3>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="4" class="mt-3">
        <v-card elevation="3" shaped>
          <v-row>
            <v-col cols="4" class="mt-2">
              <v-icon x-large>mdi-cash</v-icon>
            </v-col>
            <v-col cols="5">
              <h3 class="subheading grey--text mt-1">Остаток СМС</h3>
              <h3 class="purple--text darken-2">{{ mailing }}</h3>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="12" md="8">
        <v-card>
          <v-card-title>
            <h4 class="subheading grey--text mt-1">Детализация</h4>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-text>
          <v-data-table
            :headers="headers"
            :items="apiToken ? orders : []"
            :items-per-page="5"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:item.tableStatus="{ item }">
              <v-chip outlined :color="color(item.userStatus, item.status)">{{
                item.tableStatus
              }}</v-chip>
            </template>
            <template v-slot:item.sms_price="{ item }">
              <v-chip outlined>
                {{ item.sms_price ? item.sms_price : 0 }} ₽
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MainScreen",

  data: () => ({
    search: "", // filter by userStatus
    headers: [
      {
        text: "Номер заказа",
        align: "start",
        value: "orderId",
        sortable: false,
      },
      { text: "Клиент", value: "fio", sortable: false },
      { text: "Статус", value: "tableStatus", sortable: false },
      { text: "Потрачено", value: "sms_price", sortable: false },
    ],
  }),
  methods: {
    color(userStatus, status) {
      if (status == 0) {
        return;
      }
      if (status == 6 && 8) {
        return "blue";
      }
      if (status == 3) {
        return "red";
      }
      if (userStatus == 3) {
        return "red";
      }
      if (userStatus == 1) {
        return "red";
      }
      if (userStatus == 5) {
        return "red";
      }
      if (status == 1 && userStatus != 1) {
        return "blue";
      }
      if (status == 1) {
        return "blue";
      }
      if (userStatus == 2) {
        return "green";
      }
      if (status == 6) {
        return "green";
      }
      if (status == 2 && 5 && 9 && userStatus == 4) {
        return "yellow";
      }
    },
  },
  computed: {
    balance() {
      let b = this.$store.getters.balance;
      if (b == null) {
        return 0;
      }
      return b;
    },
    apiToken() {
      return this.$store.getters.apiToken;
    },
    mailing() {
      let m;
      if (this.balance == 0) {
        m = 0;
      } else {
        m = Math.floor(this.balance / 3.25);
      }
      return m;
    },
    orders() {
      return this.$store.getters.orders;
    },
  },
};
</script>