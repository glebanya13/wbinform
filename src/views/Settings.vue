<template>
  <div class="content">
    <div class="page-content">
      <div class="deliverySettings">
        <h2>Настройка уведомлений</h2>
        <div class="row" v-for="(method, i) in methods" :key="i">
          <div class="cell timeline">
            <span class="circle first"></span>
            <h2>{{ method.name }}</h2>
            <v-btn-toggle
              v-model="method.methods"
              multiple
              @change="changeMethods(method, i)"
            >
              <p>
                <v-btn
                  class="addnotify"
                  color="grey"
                  active-class="grey darken-4"
                  >СМС</v-btn
                >
                <v-btn
                  class="addnotify"
                  color="blue"
                  active-class="blue darken-4"
                  >Telegram</v-btn
                >
                <v-btn
                  class="addnotify"
                  color="green"
                  active-class="green darken-4"
                  >WhatsUp</v-btn
                >
              </p>
            </v-btn-toggle>
            <v-dialog width="50%">
              <template v-slot:activator="{ on, attrs }">
                <div class="trigger" v-bind="attrs" v-on="on">
                  <div class="cell">
                    <h3>СМС</h3>
                    <a class="editTrigger">Изменить</a>
                    <div class="text">
                      {{ method.message }}
                    </div>
                  </div>
                  <div class="cell">
                    <label class="switch"
                      ><input
                        @change="changeStatus(method, i)"
                        v-model="method.start"
                        type="checkbox"
                        :checked="method.start" /><span class="slider"></span
                    ></label>
                  </div>
                </div>
              </template>
              <v-card>
                <v-card-title></v-card-title>
                <v-card-text>
                  <h3 class="mt-5">Доступные поля:</h3>
                  <v-row>
                    <v-col cols="12" class="mt-2">
                      <a
                        class="mr-2 macros"
                        x-small
                        @click="addText('{ДАТА ЗАКАЗА}', method, i)"
                      >
                        Дата заказа
                      </a>
                      <a
                        class="mr-2 macros"
                        x-small
                        @click="addText('{НОМЕР ЗАКАЗА}', method, i)"
                      >
                        Номер заказа
                      </a>
                      <a
                        class="mr-2 macros"
                        x-small
                        @click="addText('{ФИО}', method, i)"
                      >
                        ФИО
                      </a>
                      <a
                        class="mr-2 macros"
                        x-small
                        @click="addText('{АРТИКУЛ ТОВАРА}', method, i)"
                      >
                        Артикул товара
                      </a>
                      <a
                        class="mr-2 macros"
                        x-small
                        @click="addText('{ССЫЛКА}', method, i)"
                      >
                        Ссылка на товар
                      </a>
                    </v-col>
                    <div class="ml-2">
                      <a
                        class="mr-2 macros"
                        x-small
                        @click="addText('{ЦЕНА ТОВАРА}', method, i)"
                      >
                        Цена товара
                      </a>
                      <a
                        x-small
                        class="mr-2 macros"
                        @click="addText('{БРЕНД}', method, i)"
                      >
                        Бренд
                      </a>
                    </div>
                  </v-row>
                  <p class="mt-10">
                    Количество символов: {{ method.message.length }}, количество
                    СМС:
                    {{ smsParts(method.message) }}
                  </p>
                  <v-textarea
                    outlined
                    name="message"
                    :id="'message' + i"
                    v-model="method.message"
                  ></v-textarea>
                  <h3>Предосмотр</h3>
                  {{ lookText(method.message) }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    small
                    @click="changeText(method.message, i)"
                  >
                    Изменить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      dialog: false,
      selectedId: "",
    };
  },
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
      var fullname = "{ФИО}";
      var dateCreated = "{ДАТА ЗАКАЗА}";
      var orderId = "{НОМЕР ЗАКАЗА}";
      var article = "{АРТИКУЛ ТОВАРА}";
      var url = "{ССЫЛКА}";
      var price = "{ЦЕНА ТОВАРА}";
      var brand = "{БРЕНД}";

      var replaceFullname = "Иван Иванов";
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

      var regFullname = new RegExp(fullname, "gi");
      text = text.replace(regFullname, replaceFullname);

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

      var ru =
        "А-а-Б-б-В-в-Ґ-ґ-Г-г-Д-д-Е-е-Ё-ё-Є-є-Ж-ж-З-з-И-и-І-і-Ї-ї-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ъ-ъ-Ы-ы-Ь-ь-Э-э-Ю-ю-Я-я".split(
          "-"
        );
      var en =
        "A-a-B-b-V-v-G-g-G-g-D-d-E-e-E-e-E-e-ZH-zh-Z-z-I-i-I-i-I-i-J-j-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H-h-TS-ts-CH-ch-SH-sh-SCH-sch-'-'-Y-y-'-'-E-e-YU-yu-YA-ya".split(
          "-"
        );
      var res = "";
      for (var i = 0, l = text.length; i < l; i++) {
        var s = text.charAt(i),
          n = ru.indexOf(s);
        if (n >= 0) {
          res += en[n];
        } else {
          res += s;
        }
      }
      return res;
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
    showModal(id) {
      console.log(id);
      this.selectedId = id;
    },
  },
  computed: {
    methods() {
      return this.$store.getters.methods; // sms data
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
h2 {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
p {
  font-size: 16px;
  line-height: 140%;
  font-weight: 300;
  margin-bottom: 10px;
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
.row {
  display: table-row;
}
.deliverySettings .cell:first-child {
  padding-top: 0;
}
.deliverySettings .timeline {
  border-left: 5px solid #eee;
}
.deliverySettings .cell {
  padding: 20px;
  position: relative;
}
.cell {
  display: table-cell;
  vertical-align: top;
}
.deliverySettings .cell .first {
  background: #2fc7f7;
  border: 2px solid #2fc7f7;
}
.deliverySettings .cell .circle {
  position: absolute;
  left: -11px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
.deliverySettings p.desc {
  color: #999;
}
.addnotify {
  border-radius: 3px;
  display: inline-block;
  padding: 5px 10px;
  background: #ccc;
  color: #fff;
  border-bottom: 0;
  margin-right: 10px;
  box-shadow: 1px 1px 10px rgb(196 208 227 / 25%),
    -1px -1px 10px rgb(196 208 227 / 25%);
}
a {
  outline: none;
  color: #2fc7f7;
  cursor: pointer;
  border-bottom: 1px solid #2fc7f7;
  text-decoration: none;
  transition: all 0.1s ease;
}
.deliverySettings .cell .trigger {
  cursor: pointer;
  padding: 10px;
  width: 100%;
  display: table;
  border-radius: 3px;
  margin: 20px 0;
  font-size: 18px;
  box-shadow: 1px 1px 20px rgb(196 208 227 / 25%),
    -1px -1px 20px rgb(196 208 227 / 25%);
}
.trigger .cell {
  padding: 10px;
}
.deliverySettings .cell {
  padding: 20px;
  position: relative;
}
.cell {
  display: table-cell;
  vertical-align: top;
}
input:checked + .slider {
  background-color: #b0d841;
  background-size: 14px 14px;
  background-position: left center;
  background-repeat: no-repeat;
  background-position-x: 10px;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  border-radius: 26px;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
.switch input {
  display: none;
}
.switch {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 60px;
  height: 26px;
}
input[type="checkbox"] {
  width: auto !important;
}
[type="checkbox"],
[type="radio"] {
  box-sizing: border-box;
  padding: 0;
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
button,
input {
  overflow: visible;
}
button,
input,
optgroup,
select,
textarea {
  margin: 0;
}
input:checked + .slider:before {
  -webkit-transform: translateX(34px);
  -ms-transform: translateX(34px);
  transform: translateX(34px);
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}
.deliverySettings .cell .trigger .cell:last-child {
  padding-top: 40px;
  width: 30px;
}
.deliverySettings .cell .trigger .cell {
  padding: 10px;
}
.deliverySettings .cell {
  padding: 20px;
  position: relative;
}
.cell {
  display: table-cell;
  vertical-align: top;
}
.deliverySettings a.editTrigger {
  font-size: 14px;
  color: #ccc;
  border-color: #eee;
}
.deliverySettings .cell .trigger h3 {
  margin-right: 10px;
  display: inline;
  color: #999;
  font-size: 16px;
}
.fancybox-slide {
  display: inline-block;
  position: relative;
  padding: 24px;
  border-width: 0;
  vertical-align: middle;
  text-align: left;
  background-color: #fff;
  overflow: auto;
  box-sizing: border-box;
}
#macroses {
  width: 100%;
  line-height: 40px;
  margin-bottom: 10px;
}
.macros {
  padding: 5px 10px;
  margin-right: 10px;
  font-size: 13px;
  white-space: nowrap;
  border: none;
  font-weight: 300;
  color: #2fc7f7;
  border-radius: 3px;
  box-shadow: 1px 1px 10px rgb(196 208 227 / 25%),
    -1px -1px 10px rgb(196 208 227 / 25%);
}
</style>
