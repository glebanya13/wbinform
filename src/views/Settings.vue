<template>
  <v-container fluid>
    <h1 class="mb-6 ml-2">Настройки</h1>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="6">
        <v-card>
          <v-toolbar color="purple darken-2" dark flat>
            <v-toolbar-title>Настройка SMS</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-list>
              <v-list-item
        >
        <v-list-content>
          <div class="ml-1">
              <v-row>
                <v-col cols="12" md="8" sm="5" xs="12">
          <h2>Стартовое уведомление</h2>

                </v-col>
                <v-col cols="12" md="1" sm="1" xs="6">
<v-checkbox
              v-model="ex4"
              color="success"
              value="success"
              hide-details
            ></v-checkbox>
                </v-col>
                <v-col cols="12" md="1" sm="1" xs="6">
            <v-btn small text>Изменить</v-btn>

                </v-col>
              </v-row>
            </div>
        </v-list-content>
          <v-list-item-action>
            
          </v-list-item-action>
          
        </v-list-item>
            </v-list>
           
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <v-card class="elevation-4">
          <v-toolbar color="purple darken-2" dark flat>
            <v-toolbar-title>Настройка WB Token</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div v-if="!apiToken">
              <validation-observer ref="observer" v-slot="{ invalid }">
                <form @submit.prevent="submit">
                  <validation-provider
                    v-slot="{ errors }"
                    name="token"
                    rules="required"
                  >
                    <v-text-field
                      v-model="token"
                      :error-messages="errors"
                      label="WB apiToken"
                      required
                      outlined
                    ></v-text-field>
                  </validation-provider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
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
            </div>
            <div v-else>
              <v-text-field :value="apiToken" disabled outlined />
            </div>
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
    token: "",
  }),
  methods: {
    submit() {
      this.$refs.observer.validate();
      this.$store
        .dispatch("ADD_USER_API_TOKEN", { token: this.token })
        .then(() => {
          this.$router.push("/");
        });
    },
  },
  computed: {
    apiToken() {
      return this.$store.getters.apiToken;
    },
  },
};
</script>