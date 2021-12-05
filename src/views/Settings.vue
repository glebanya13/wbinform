<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="7">
        <v-card v-for="(card, i) in methods" :key="i" class="mt-2 elevation-6">
          <v-card-text>
            <v-row>
              <v-col cols="5" md="5">
                <h2 class="mt-5">{{ card.name }}</h2>
              </v-col>
              <v-col>
                <v-switch
                  v-model="card.start"
                  color="success"
                  inset
                  @change="changeStatus(card, i)"
                ></v-switch>
              </v-col>
            </v-row>
            <v-btn-toggle
              v-model="card.methods"
              multiple
              @change="changeMethods(card, i)"
            >
              <v-btn class="mr-2" small> SMS </v-btn>
              <v-btn color="green" class="mr-2" small> WhatsUp </v-btn>
              <v-btn color="blue" small> Telegram </v-btn>
            </v-btn-toggle>
            <h3 class="mt-5">Доступные поля:</h3>
            <v-row>
              <v-col cols="12" class="mt-2">
                <v-btn
                  class="mr-2"
                  x-small
                  @click="addText('{ДАТА ЗАКАЗА}', card, i)"
                >
                  Дата заказа
                </v-btn>
                <v-btn
                  class="mr-2"
                  x-small
                  @click="addText('{НОМЕР ЗАКАЗА}', card, i)"
                >
                  Номер заказа
                </v-btn>
                <v-btn class="mr-2" x-small @click="addText('{ИМЯ}', card, i)">
                  Имя
                </v-btn>
                <v-btn
                  class="mr-2"
                  x-small
                  @click="addText('{ФАМИЛИЯ}', card, i)"
                >
                  Фамилия
                </v-btn>
                <v-btn
                  class="mr-2"
                  x-small
                  @click="addText('{АРТИКУЛ ТОВАРА}', card, i)"
                >
                  Артикул товара
                </v-btn>
                <v-btn
                  class="mr-2"
                  x-small
                  @click="addText('{ССЫЛКА}', card, i)"
                >
                  Ссылка на товар
                </v-btn>
              </v-col>
              <div class="ml-2">
                <v-btn
                  class="mr-2"
                  x-small
                  @click="addText('{ЦЕНА ТОВАРА}', card, i)"
                >
                  Цена товара
                </v-btn>
                <v-btn x-small @click="addText('{БРЕНД}', card, i)">
                  Бренд
                </v-btn>
              </div>
            </v-row>
            <v-row class="mt-5">
              <v-col cols="6">
                <h3>Текст</h3>
              </v-col>
              <v-col>
                <p>
                  Количество символов: {{ card.message.length }}, количество
                  СМС:
                  {{ smsParts(card.message) }}
                </p>
              </v-col>
            </v-row>
            <v-textarea
              outlined
              name="message"
              :id="'message' + i"
              v-model="card.message"
              @change="changeText(card.message, i)"
            ></v-textarea>
            <h3>Предосмотр</h3>
            {{ lookText(card.message) }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  methods: {
    smsParts: function (message) {
      if (message.length < 160) {
        return 1;
      }
      if (message.length < 308) {
        return 2;
      }
      if (message.length < 340) {
        return 3;
      }
    },
    addText: function (button, card, i) {
      var txtarea = document.getElementById("message" + i);
      console.log(txtarea.selectionStart);
      var start = txtarea.selectionStart;
      var end = txtarea.selectionEnd;
      var finText =
        txtarea.value.substring(0, start) +
        button +
        txtarea.value.substring(end);
      card.message = finText;
      this.changeText(card.message, i);
    },

    lookText: function (message) {
      var name = "{ИМЯ}";
      var surname = "{ФАМИЛИЯ}";
      var dateCreated = "{ДАТА ЗАКАЗА}";
      var orderId = "{НОМЕР ЗАКАЗА}";
      var article = "{АРТИКУЛ ТОВАРА}";
      var url = "{ССЫЛКА}";
      var price = "{ЦЕНА ТОВАРА}";
      var brand = "{БРЕНД}";

      var replaceName = "Иван";
      var replaceSurname = "Иванов";
      var replaceDateCreated = new Date().toLocaleDateString();
      var replaceOrderId = "131965665";
      var replaceArticle = "24047618";
      var replaceUrl =
        "https://www.wildberries.ru/catalog/" +
        replaceArticle +
        "/detail.aspx?targetUrl=ST";
      var replacePrice = "1000";
      var replaceBrand = "АГРОФИРМА ПАРТНЕР";

      this.message = message;
      var text = this.message;

      var regName = new RegExp(name, "gi");
      text = text.replace(regName, replaceName);

      var regSurname = new RegExp(surname, "gi");
      text = text.replace(regSurname, replaceSurname);

      var regDateCreated = new RegExp(dateCreated, "gi");
      text = text.replace(regDateCreated, replaceDateCreated);

      var regOrderId = new RegExp(orderId, "gi");
      text = text.replace(regOrderId, replaceOrderId);

      var regArticle = new RegExp(article, "gi");
      text = text.replace(regArticle, replaceArticle);

      var regUrl = new RegExp(url, "gi");
      text = text.replace(regUrl, replaceUrl);

      var regPrice = new RegExp(price, "gi");
      text = text.replace(regPrice, replacePrice);

      var regBrand = new RegExp(brand, "gi");
      text = text.replace(regBrand, replaceBrand);

      return text;
    },
    changeStatus(card, i) {
      try {
        firebase
          .database()
          .ref("userData/" + this.$store.getters.userId + "/methods/" + i)
          .update({
            start: card.start,
          });
      } catch (e) {
        console.log(e);
      }
    },
    changeMethods(card, i) {
      try {
        firebase
          .database()
          .ref("userData/" + this.$store.getters.userId + "/methods/" + i)
          .update({
            methods: card.methods,
          });
      } catch (e) {
        console.log(e);
      }
    },
    changeText(message, i) {
      try {
        firebase
          .database()
          .ref("userData/" + this.$store.getters.userId + "/methods/" + i)
          .update({
            message: message,
          });
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    methods() {
      return this.$store.getters.methods; // sms data
    },
  },
};
</script>