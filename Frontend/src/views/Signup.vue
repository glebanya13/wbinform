<template>
  <div class="main">
    <div class="login-box">
      <div class="text-login">
        <p>Вход</p>
      </div>
      <div class="login-form">
        <form>
          <input
            class="form-control"
            type="text"
            placeholder="+7 Ваш телефон"
            required
            :rules="phoneRules"
            v-model="phNo"
            @change="sendOtp()"
          />

          <input
            class="form-control"
            type="number"
            placeholder="Код"
            :rules="otpRules"
            v-model="otp"
          />

          <div id="recaptcha-container"></div>

          <input
            class="form-enter"
            value="Войти"
            @click="verifyOtp()"
            type="button"
          />
          <input
            class="form-enter"
            value="Отправить повторно?"
            @click="sendOtp()"
            type="button"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      phNo: "",
      appVerifier: "",
      valid: null,
      otp: null,
      phoneRules: [
        (v) => !!v || "Пожалуйста введите ваш номер телефона",
        (v) => (v && v.length >= 12) || "Неправильный номер телефона",
      ],
      otpRules: [(v) => !!v || "Пожалуйста введите ваш код"],
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
      if (this.phNo.length != 13) {
        console.log(this.phNo.length);
      } else {
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
      }
    },
    verifyOtp() {
      // if (this.phNo.length != 13 || this.otp.length != 6) {
      //   alert("Неверный формат номера телефона / кода!");
      // } else {

      var code = this.otp;
      var credential = firebase.auth.PhoneAuthProvider.credential(
        window.confirmationResult.verificationId,
        code
      );

      firebase.auth().signInWithCredential(credential);

      this.$router.push("/");
      // }
    },
    initReCaptcha() {
      setTimeout(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "normal",
            callback: () => {},
            "expired-callback": () => {},
          }
        );
      }, 1000);
    },
    signout() {
      firebase.auth().signOut();
    },
  },
  created() {
    this.initReCaptcha();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600&display=swap");
body {
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: auto;
  margin: 0;
  border: 0;
}
.main {
  background: #5c2f8e;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}
.login-box {
  background: rgba(214, 208, 208, 0.22);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6.5px);
  -webkit-backdrop-filter: blur(6.5px);
  border: 1px solid rgba(214, 208, 208, 0.3);
  height: 480px;
  width: 450px;
}
.text-login p {
  margin-top: 20px;
  color: rgb(212, 212, 212);
  text-align: center;
  font-family: "Quicksand", sans-serif;
  font-weight: 600;
  font-size: 30px;
}
.text-login {
  text-align: center;
}
form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login-form {
  margin-top: 20px;
}
.form-control {
  margin-top: 20px;
  width: 350px;
  font-family: "Quicksand", sans-serif;
  text-align: center;
  color: white;
  height: 40px;
  border: #00000033 1px solid;
  font-size: 20px;
  border-radius: 15px;
  background-color: #a5a5a524;
}
.form-control::placeholder {
  text-align: center;
  font-size: 18px;
  font-family: "Quicksand", sans-serif;
  color: rgb(196, 196, 196);
}
.form-control:focus {
  outline: none;
}
.form-enter {
  margin-top: 30px;
  width: 220px;
  font-weight: bold;
  font-size: 19px;
  height: 45px;
  text-align: center;
  border-radius: 10px;
  background: white;
  font-family: "Quicksand", sans-serif;
  border: transparent 1px solid;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

#recaptcha-container {
  margin-top: 25px;
}
</style>