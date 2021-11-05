<template>
  <v-container fluid>
    <h2 class="text-center mb-6">Настройки</h2>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="6">
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
            <v-btn
              class="float-right"
              type="submit"
              :disabled="invalid"
            >
              Подтвердить
            </v-btn>
          </form>
        </validation-observer>
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
};
</script>