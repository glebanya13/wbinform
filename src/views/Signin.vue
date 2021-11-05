<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="6">
        <v-card class="elevation-4">
          <v-card-title> Вход </v-card-title>
          <v-alert type="warning" :value="error">
            {{ error }}
          </v-alert>
          <v-card-text>
            <validation-observer ref="observer" v-slot="{ invalid }">
              <form @submit.prevent="submit">
                <validation-provider
                  v-slot="{ errors }"
                  name="email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="email"
                    :error-messages="errors"
                    label="E-mail"
                    required
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="password"
                  rules="required|min:6"
                >
                  <v-text-field
                    v-model="password"
                    :error-messages="errors"
                    label="Пароль"
                    required
                    type="password"
                  ></v-text-field>
                </validation-provider>
                <v-card-actions>
                  <a @click="regform()">Регистрация</a>
                  <v-spacer></v-spacer>
                  <v-btn type="submit" :disabled="invalid"> Подтвердить </v-btn>
                </v-card-actions>
              </form>
            </validation-observer>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { required, email, max, min } from "vee-validate/dist/rules";
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

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});

extend("min", {
  ...min,
  message: "{_field_} may not be less than {length} characters",
});

extend("email", {
  ...email,
  message: "Email must be valid",
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    name: "",
    email: "",
    password: "",
  }),
  computed: {
    error() {
      return this.$store.getters.getError;
    },
    processing() {
      return this.$store.getters.getProcessing;
    },
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    },
  },
  watch: {
    isUserAuthenticated(val) {
      if (val === true) this.$router.push("/");
    },
  },
  methods: {
    regform() {
      this.$router.push("/signup");
    },
    submit() {
      this.$refs.observer.validate();
      this.$store.dispatch("SIGNIN", {
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>