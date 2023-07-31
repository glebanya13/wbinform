<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12 mt-8">
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step editable step="1" color="purple darken-2">
                Телефон
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="2" color="purple darken-2">
                Код
              </v-stepper-step>

              <v-divider></v-divider>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-container>
                  <h3>Введите Ваш номер телефона:</h3>
                  <v-form v-model="valid">
                    <v-text-field
                      color="purple darken-2"
                      prepend-icon="mdi-phone"
                      type="text"
                      required
                      v-model="phNo"
                      placeholder="Номер телефона"
                      :rules="phoneRules"
                    ></v-text-field>
                  </v-form>
                  <v-btn
                    color="purple darken-2 white--text"
                    @click="sendOtp()"
                    id="sign-in-button"
                    :disabled="!valid"
                    class="float-right"
                  >
                    Продолжить
                  </v-btn>
                </v-container>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-container>
                  <div id="recaptcha-container"></div>
                  <v-form v-model="valid2">
                    <v-text-field
                      type="number"
                      v-model="otp"
                      placeholder="Код подтверждения"
                      :rules="optRules"
                    />
                  </v-form>
                  <br />
                  <p>Не пришел код?</p>
                  <a @click="sendOtp()">Повторить отправку?</a>

                  <v-btn
                    color="purple darken-2 white--text"
                    @click="verifyOtp()"
                    :disabled="!valid2"
                    class="float-right"
                  >
                    Готово
                  </v-btn>
                </v-container>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      e1: 1,
      phNo: "",
      appVerifier: "",
      valid: null,
      valid2: null,
      otp: "",
      phoneRules: [
        (v) => !!v || "Пожалуйста введите ваш номер телефона",
        (v) => (v && v.length >= 12) || "Неправильный номер телефона",
      ],
      optRules: [(v) => !!v || "Пожалуйста введите ваш код"],
    };
  },
  computed: {
    error() {
      return this.$store.getters.getError;
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
    sendOtp() {
      this.e1 = 2;
      var phoneNumber = this.phNo;
      var appVerifier = window.recaptchaVerifier;
      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
          window.confirmationResult = confirmationResult;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    verifyOtp() {
      if (this.phNo.length != 16 || this.otp.length != 6) {
        alert("Неверный формат номера телефона / кода!");
      } else {
        var code = this.otp;
        var credential = firebase.auth.PhoneAuthProvider.credential(
          window.confirmationResult.verificationId,
          code
        );
        firebase.auth().signInWithCredential(credential);
        this.$router.push({ name: "Home" });
      }
    },
    initReCaptcha() {
      setTimeout(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: function () {},
          }
        );
        this.appVerifier = window.recaptchaVerifier;
      }, 1000);
    },
    signout() {
      firebase.auth().signOut();
      this.$router.push({ path: "/signin" });
      window.location.reload();
    },
  },
  created() {
    this.initReCaptcha();
  },
};
</script>