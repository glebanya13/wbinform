<template>
  <div class="content">
    <div class="page-content">
      <v-data-table
        :headers="headers"
        :items="campaings"
        sort-by="calories"
        item-key="name"
      >
        <template v-slot:item.name="{ item }">
          <router-link :to="`/campaigns/${campaings.indexOf(item)}`">
            <a style="color: black">{{ item.name }}</a>
          </router-link>
        </template>

        <template
          v-for="(col, i) in filters"
          v-slot:[`header.${i}`]="{ header }"
        >
          <div
            style="display: inline-block; padding: 16px 0"
            :key="col.created"
          >
            {{ header.text }}
          </div>
          <div style="float: right; margin-top: 8px" :key="col.created">
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
              <h1 class="page-title">Кампании</h1>
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize()">Обновить</v-btn>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filters: { status: [] },
      activeFilters: {},
      campaings: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "Кампания",
          align: "start",
          value: "name",
        },
        {
          text: "Создан",
          value: "dateCreated",
        },
        {
          text: "Статус",
          value: "status",
          filter: (value) => {
            return this.activeFilters.status
              ? this.activeFilters.status.includes(value)
              : true;
          },
        },
        { text: "Приостановлено", value: "stop" },
        { text: "Архивировано", value: "archive" },
      ];
    },
    campaingsFromDB() {
      return this.$store.getters.campaings;
    },
  },
  methods: {
    initialize() {
      this.campaings = this.campaingsFromDB;
      console.log(this.campaingsFromDB);
    },
    initFilters() {
      var col;
      for (col in this.filters) {
        this.filters[col] = this.campaings
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
      this.activeFilters[col] = this.campaings
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
  },
  watch: {
    campaings() {
      this.initFilters();
    },
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
.form__control {
  max-width: 288px;
}
.form__input {
  padding-right: 16px;
}
.form__input input {
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  width: 100%;
}
.combobox__label {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-align: center;
  align-items: center;
}
.form__input {
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #d5d5d5;
  font-size: 16px;
  outline: none;
  min-height: 44px;
  box-sizing: border-box;
  width: 100%;
}
.btn--white {
  background-color: #fff;
}
.btn--gray,
.btn--white {
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  height: 44px;
  border: 1px solid #d1cfd7;
}
.btn {
  padding: 10px 24px;
  border-radius: 4px;
  background-color: #d5d5d5;
  font-size: 16px;
  color: #000000;
  font-weight: 400;
  cursor: pointer;
  transition: opacity, background-color, color 0.15s ease-in-out;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
a {
  text-decoration: none;
}
</style>