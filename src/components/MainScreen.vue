<template>
  <div class="content">
    <div class="page-content">
      <v-data-table
        :headers="headers"
        :items="orders"
        sort-by="calories"
        item-key="name"
      >
        <template
          v-for="(col, i) in filters"
          v-slot:[`header.${i}`]="{ header }"
        >
          <div
            style="display: inline-block; padding: 16px 0"
            :key="col.orderId"
          >
            {{ header.text }}
          </div>
          <div style="float: right; margin-top: 8px" :key="col.orderId">
            <v-menu
              :close-on-content-click="false"
              :nudge-width="200"
              offset-y
              transition="slide-y-transition"
              left
              fixed
              style="position: absolute; right: 0"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="indigo" icon v-bind="attrs" v-on="on">
                  <v-icon
                    small
                    :color="
                      activeFilters[header.value] &&
                      activeFilters[header.value].length <
                        filters[header.value].length
                        ? 'red'
                        : 'default'
                    "
                  >
                    mdi-filter-variant
                  </v-icon>
                </v-btn>
              </template>
              <v-list flat dense class="pa-0">
                <v-list-item-group
                  multiple
                  v-model="activeFilters[header.value]"
                  class="py-2"
                >
                  <template v-for="item in filters[header.value]">
                    <v-list-item :key="`${item}`" :value="item" :ripple="false">
                      <template v-slot:default="{ active, toggle }">
                        <v-list-item-action>
                          <v-checkbox
                            :input-value="active"
                            :true-value="item"
                            @click="toggle"
                            color="primary"
                            :ripple="false"
                            dense
                          ></v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title v-text="item"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </v-list-item>
                  </template>
                </v-list-item-group>
                <v-divider></v-divider>
                <v-row no-gutters>
                  <v-col cols="6">
                    <v-btn
                      text
                      block
                      @click="toggleAll(header.value)"
                      color="success"
                      >Выбрать всё</v-btn
                    >
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      text
                      block
                      @click="clearAll(header.value)"
                      color="warning"
                      >Очистить всё</v-btn
                    >
                  </v-col>
                </v-row>
              </v-list>
            </v-menu>
          </div>
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>
              <h1 class="page-title">Детализация</h1>
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Обновить</v-btn>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainScreen",

  data: () => ({
    filters: { orderId: [], fio: [], tableStatus: [] },
    activeFilters: {},
    orders: [
      {
        orderId: "ORD-1001",
        fio: "Иванов Иван Иванович",
        tableStatus: "Выполнен",
        sms_price: "1,250 ₽",
      },
      {
        orderId: "ORD-1002",
        fio: "Петрова Анна Сергеевна",
        tableStatus: "В обработке",
        sms_price: "890 ₽",
      },
      {
        orderId: "ORD-1003",
        fio: "Сидоров Алексей Владимирович",
        tableStatus: "Отменен",
        sms_price: "2,150 ₽",
      },
      {
        orderId: "ORD-1004",
        fio: "Кузнецова Елена Дмитриевна",
        tableStatus: "Выполнен",
        sms_price: "1,750 ₽",
      },
      {
        orderId: "ORD-1005",
        fio: "Васильев Денис Петрович",
        tableStatus: "Новый",
        sms_price: "3,200 ₽",
      },
      {
        orderId: "ORD-1006",
        fio: "Иванова Ольга Викторовна",
        tableStatus: "В обработке",
        sms_price: "1,100 ₽",
      },
      {
        orderId: "ORD-1007",
        fio: "Смирнов Артем Игоревич",
        tableStatus: "Выполнен",
        sms_price: "2,500 ₽",
      },
    ],
  }),
  methods: {
    initFilters() {
      var col;
      for (col in this.filters) {
        this.filters[col] = this.orders
          .map((d) => {
            return d[col];
          })
          .filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
      }
      this.activeFilters = Object.assign({}, this.filters);
    },
    toggleAll(col) {
      this.activeFilters[col] = this.orders
        .map((d) => {
          return d[col];
        })
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
    },
    clearAll(col) {
      this.activeFilters[col] = [];
    },
    initialize() {
      this.orders = [...this.orders];
    },
  },
  computed: {
    headers() {
      return [
        {
          text: "Номер заказа",
          align: "start",
          sortable: true,
          value: "orderId",
          filter: (value) => {
            return this.activeFilters.orderId
              ? this.activeFilters.orderId.includes(value)
              : true;
          },
        },
        {
          text: "Клиент",
          value: "fio",
          filter: (value) => {
            return this.activeFilters.fio
              ? this.activeFilters.fio.includes(value)
              : true;
          },
        },
        {
          text: "Статус",
          value: "tableStatus",
          filter: (value) => {
            return this.activeFilters.tableStatus
              ? this.activeFilters.tableStatus.includes(value)
              : true;
          },
        },
        { text: "Потрачено", value: "sms_price" },
      ];
    },
    ordersFromDB() {
      return this.$store.getters.orders;
    },
  },
  watch: {
    orders() {
      this.initFilters();
    },
  },
  created() {
    this.initFilters();
  },
};
</script>

<style scoped>
.page-title {
  font-family: "Lato", Helvetica, sans-serif;
  font-size: 30px;
  font-weight: bold;
  margin: 0;
  line-height: 100%;
}
.page-content {
  display: block;
  border-radius: 8px;
  padding: 32px;
  background-color: #fff;
}
.content {
  flex: 1;
  background-color: #f2f2f2;
}
.v-list--dense .v-list-item,
.v-list-item--dense {
  min-height: 20px !important;
  height: 2rem;
}

.v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 0.5rem !important;
}

.v-list-item--link {
  transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.v-list-item--link:hover {
  background-color: rgba(0, 0, 0, 0.13);
}
</style>
