<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-col cols="12" sm="12" md="4" class="mt-3">
        <v-card elevation="3" shaped>
          <v-row>
            <v-col cols="4">
              <v-icon x-large>mdi-cash</v-icon>
            </v-col>
            <v-col cols="5">
              <h4 class="subheading mt-1">Баланс</h4>
              <h3 class="purple--text darken-2">{{ Math.round(balance) }} ₽</h3>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="4" class="mt-3">
        <v-card elevation="3" shaped>
          <v-row>
            <v-col cols="4">
              <v-icon x-large>mdi-cash</v-icon>
            </v-col>
            <v-col cols="5">
              <h4 class="subheading mt-1">Остаток СМС</h4>
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
            <h5 class="subheading mt-1">Детализация</h5>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="apiToken ? orders : []"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.userStatus="{ item }">
              <v-chip outlined :color="color(item.userStatus, item.status)">{{
                text(item.userStatus, item.status)
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
    headers: [
      {
        text: "Номер заказа",
        align: "start",
        value: "orderId",
        sortable: false,
      },
      { text: "Клиент", value: "fio", sortable: false },
      { text: "Статус", value: "userStatus", sortable: false },
      { text: "Потрачено", value: "sms_price", sortable: false },
    ],
  }),
  methods: {
    text(userStatus, status) {
      if (status == 0) {
        return "Новый";
      }
      if (status == 8) {
        return "На сборке";
      }
      if (status == 3) {
        return "Отклонен";
      }
      if (userStatus == 3) {
        return "Отменен";
      }
      if (userStatus == 1) {
        return "Отменен";
      }
      if (userStatus == 5) {
        return "Отменен";
      }
      if (userStatus == 1 && status == 1) {
        return "Отменен";
      }
      if (status == 1) {
        return "На сборке";
      }
      if (userStatus == 2) {
        return "Доставлен";
      }
      if (status == 6) {
        return "Доставлен";
      }
      if (status == 2 && 5 && 9 && userStatus == 4) {
        return "На доставке";
      }
    },
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