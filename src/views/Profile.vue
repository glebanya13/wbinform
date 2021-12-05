<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-card>
          <v-card-title>
            <p class="grey--text">Ключи API</p>
          </v-card-title>
          <v-card-text>
            <v-dialog v-model="addDialog" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="green" small dark v-bind="attrs" v-on="on">
                  <v-icon small>mdi-plus</v-icon> Добавить ключ API
                </v-btn>
              </template>
              <v-card class="elevation-4">
                <v-toolbar color="purple darken-2" dark flat>
                  <v-toolbar-title>Добавить ключ API</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-container>
                    <validation-observer ref="observer" v-slot="{ invalid }">
                      <form @submit.prevent="send(apiToken)">
                        <validation-provider
                          v-slot="{ errors }"
                          name="name"
                          rules="required"
                        >
                          <v-text-field
                            v-model="name"
                            :error-messages="errors"
                            label="Name"
                            required
                            outlined
                          ></v-text-field>
                        </validation-provider>
                        <validation-provider
                          v-slot="{ errors }"
                          name="key"
                          rules="required"
                        >
                          <v-text-field
                            v-model="key"
                            :error-messages="errors"
                            label="ApiKey"
                            required
                            outlined
                          ></v-text-field>
                        </validation-provider>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="red" dark @click="addDialog = false">
                            Отмена
                          </v-btn>
                          <v-btn
                            class="float-right"
                            type="send"
                            :disabled="invalid"
                          >
                            Подтвердить
                          </v-btn>
                        </v-card-actions>
                      </form>
                    </validation-observer>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>

            <v-row class="mb-1 mt-1 ml-1">
              <v-card
                class="elevation-2 mt-4 mr-2"
                width="300"
                v-for="(item, i) in apiToken"
                :key="i"
                color="grey lighten-3"
              >
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="10">
                        <h2>{{ item.name }}</h2>
                        <h4 class="mt-1">
                          {{ item.key.substr(0, 10) + "..." }}
                        </h4>
                        <h4 class="mt-4">Статус: {{ item.status }}</h4>
                      </v-col>
                      <v-col cols="2">
                        <v-menu offset-y>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small v-bind="attrs" v-on="on">
                              <v-icon> mdi-cog </v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item>
                              <v-dialog
                                v-model="editDialog"
                                persistent
                                max-width="600px"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-list-item-title
                                    v-bind="attrs"
                                    v-on="on"
                                    style="cursor: pointer"
                                  >
                                    Редактировать
                                  </v-list-item-title>
                                </template>
                                <v-card class="elevation-4">
                                  <v-toolbar color="purple darken-2" dark flat>
                                    <v-toolbar-title
                                      >Редактирование</v-toolbar-title
                                    >
                                  </v-toolbar>
                                  <v-card-text>
                                    <v-container>
                                      <validation-observer
                                        ref="observer"
                                        v-slot="{ invalid }"
                                      >
                                        <form @submit.prevent="submit(item, i)">
                                          <validation-provider
                                            v-slot="{ errors }"
                                            name="name"
                                            rules="required"
                                          >
                                            <v-text-field
                                              v-model="item.name"
                                              :error-messages="errors"
                                              label="Name"
                                              required
                                              outlined
                                            ></v-text-field>
                                          </validation-provider>
                                          <validation-provider
                                            v-slot="{ errors }"
                                            name="key"
                                            rules="required"
                                          >
                                            <v-text-field
                                              v-model="item.key"
                                              :error-messages="errors"
                                              label="ApiKey"
                                              required
                                              outlined
                                            ></v-text-field>
                                          </validation-provider>
                                          <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                              color="red"
                                              dark
                                              @click="closeEditDialog()"
                                            >
                                              Отмена
                                            </v-btn>
                                            <v-btn
                                              class="float-right"
                                              type="submit"
                                              :disabled="invalid"
                                            >
                                              Подтвердить
                                            </v-btn>
                                          </v-card-actions>
                                        </form>
                                      </validation-observer>
                                    </v-container>
                                  </v-card-text>
                                </v-card>
                              </v-dialog>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title
                                @click="deleteApiKey(i)"
                                style="cursor: pointer"
                                >Удалить</v-list-item-title
                              >
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { required } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    addDialog: false, // add api data modal
    editDialog: false, // edit api data modal
    name: "", // api name
    key: "", // api key
  }),
  methods: {
    submit(item, index) {
      this.$store.dispatch("UPDATE_USER_API_TOKEN", {
        item: item,
        index: index,
      });
      this.editDialog = false;
    },
    send(apiToken) {
      if (!apiToken) {
        this.$store.dispatch("ADD_USER_API_TOKEN", {
          key: this.key,
          name: this.name,
          index: 0,
        });
      } else {
        this.$store.dispatch("ADD_USER_API_TOKEN", {
          key: this.key,
          name: this.name,
          index: Object.keys(apiToken).length,
        });
      }
      this.addDialog = false;
    },
    deleteApiKey(i) {
      this.$store.dispatch("DELETE_API_TOKEN", i);
    },
    closeEditDialog() {
      (this.editDialog = false), this.$store.dispatch("LOAD_USER_DATA");
    },
  },
  computed: {
    apiToken() {
      return this.$store.getters.apiToken;
    },
  },
};
</script>