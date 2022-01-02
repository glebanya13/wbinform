<template>
  <div class="page-content">
    <div class="content">
      <v-card>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <h1 class="page-title">Пополните баланс</h1>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <h3 class="ng-star-inserted">Введите сумму пополнения</h3>
          <form action="">
            <div class="addsumma">
              <input
                type="number"
                name="summa"
                v-model="balance"
                class="summa"
                placeholder="Введите сумму"
                required
                min="100"
              />
            </div>
            <div class="addBalance">
              <v-btn
                class="btn mt-8"
                color="#2fc7f7"
                @click="paynament()"
                :disabled="disabled"
              >
                Пополнить баланс
              </v-btn>
            </div>
          </form>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      balance: 100,
      disabled: false,
    };
  },
  methods: {
    paynament() {
      this.$store.dispatch("PAYNAMENT", this.balance);
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
h3 {
  display: block;
  font-size: 1.4em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  color: black;
}
.summa {
  margin-top: 10px;
  padding: 0 0 10px 0;
  box-sizing: border-box;
  color: #000;
  background: #fff;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #ccc;
  font-size: 24px;
}
input {
  padding: 10px;
  box-sizing: border-box;
  font-family: "Open Sans", sans-serif;
  outline: none;
  width: auto;
  font-size: 18px;
  border-radius: 3px;
  border: 1px solid #ccc;
}
.btn {
  cursor: pointer;
  padding: 10px 20px;
  box-sizing: border-box;
  font-family: "Open Sans", sans-serif;
  outline: none;
  width: auto;
  font-size: 18px;
  border-radius: 3px;
  color: #fff;
  background: #2fc7f7;
  transition: all 150ms ease;
}
</style>