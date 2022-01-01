<template>
  <div class="content">
    <div class="page-content">
      <v-card>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <h1 class="page-title">Создание кампании</h1>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-stepper v-model="e1" class="elevation-0">
            <v-stepper-header>
              <v-stepper-step
                :complete="e1 > 1"
                step="1"
                color="#3a0078"
                editable
                @click="zero()"
              >
                Ваша кампания
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step
                :complete="e1 > 2"
                step="2"
                color="#3a0078"
                :editable="e1 > 2"
              >
                Ассортимент
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step
                :complete="e1 > 2"
                step="3"
                color="#3a0078"
                :editable="e1 > 3"
              >
                СМС
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="4" color="#3a0078" editable>
                Подтверждение
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <div
                  class="
                    flex
                    carousel-container-name
                    flex--content-between
                    ng-star-inserted
                  "
                >
                  <div class="carousel-container-name__col">
                    <h3>Дайте название новой кампании</h3>
                    <div class="form__control m-t-24">
                      <label for="campaignName">Кампания</label
                      ><input
                        v-model="campaignName"
                        autocomplete="off"
                        class="form__input ng-untouched ng-pristine ng-invalid"
                        type="text"
                        maxlength="50"
                        placeholder="Введите название кампании"
                      />
                    </div>
                    <h3 class="mt-8">
                      Выбрать бренд из списка
                      <v-btn icon @click="getBrand()">
                        <v-icon color="blue"> mdi-reload </v-icon>
                      </v-btn>
                    </h3>
                    <div class="form__control m-t-24">
                      <label for="groups">Бренд</label
                      ><v-select
                        :items="brand"
                        v-model="userBrands"
                        autocomplete="off"
                        outlined
                        placeholder="Выберите бренд"
                      ></v-select>
                    </div>
                    <div class="flex m-t-48 m-b-6">
                      <button
                        class="btn btn--primary m-r-24"
                        type="button"
                        @click="nextPanel(2)"
                      >
                        Выбрать товары
                      </button>
                    </div>
                  </div>
                </div>
              </v-stepper-content>

              <v-stepper-content step="2">
                <div
                  class="
                    flex
                    carousel-container-name
                    flex--content-between
                    ng-star-inserted
                  "
                >
                  <div class="carousel-container-name__col">
                    <h3>
                      Выберите группы предметов, которые хотите рекламировать
                    </h3>
                    <div class="form__control m-t-24">
                      <label for="groups">Группы предметов</label
                      ><v-select
                        :items="category || []"
                        v-model="userCategory"
                        autocomplete="off"
                        outlined
                        multiple
                        @change="getSubject()"
                        placeholder="Группы предметов"
                      >
                      </v-select>
                    </div>
                    <h3 class="m-t-56">Выберите предметы из группы</h3>
                    <div class="form__control m-t-24">
                      <label for="objects">Предмет</label
                      ><v-select
                        :items="subject || []"
                        v-model="userSubject"
                        autocomplete="off"
                        outlined
                        multiple
                        placeholder="Выберите из списка"
                      >
                      <template v-slot:item="{ item }">
                      <div class="combobox__row ng-star-inserted">
                        <div class="combobox__row__item">
                          <img :src="createUrlImage(item)" />
                          <div class="combobox__row__item__body m-l-12">
                          <div class="combobox__row__item__body__main"> {{userBrands}} / {{createName(item)}}</div>
                          </div>
                          <div class="combobox__row__item__right m-l-12">{{item}}</div>
                          </div>
                          </div>
                      </template>
                      </v-select>
                    </div>
                    <div class="flex m-t-48 m-b-6">
                      <button
                        class="btn btn--primary m-r-24"
                        type="button"
                        @click="nextPanel(3)"
                      >
                        Продолжить
                      </button>
                    </div>
                  </div>
                </div>
              </v-stepper-content>

              <v-stepper-content step="3">
                <div class="settings-content">
                  <div class="deliverySettings">
                    <h2>Настройка уведомлений</h2>
                    <div v-if="methods">
                      <div class="row" v-for="(method, i) in methods" :key="i">
                        <div class="cell timeline">
                          <span class="circle first"></span>
                          <h2>{{ method.name }}</h2>
                          <v-btn-toggle
                            v-model="method.methods"
                            multiple
                            @change="changeMethodsDefault(method, i)"
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
                                      @change="changeStatusDefault(method, i)"
                                      v-model="method.start"
                                      type="checkbox"
                                      :checked="method.start" /><span
                                      class="slider"
                                    ></span
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
                                      @click="
                                        addText('{ДАТА ЗАКАЗА}', method, i)
                                      "
                                    >
                                      Дата заказа
                                    </a>
                                    <a
                                      class="mr-2 macros"
                                      x-small
                                      @click="
                                        addText('{НОМЕР ЗАКАЗА}', method, i)
                                      "
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
                                      @click="
                                        addText('{АРТИКУЛ ТОВАРА}', method, i)
                                      "
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
                                      @click="
                                        addText('{ЦЕНА ТОВАРА}', method, i)
                                      "
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
                                  Количество символов:
                                  {{ method.message.length }}, количество СМС:
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
                                  @click="changeTextDefault(method.message, i)"
                                >
                                  Изменить
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </div>
                      </div>
                    </div>
                    <div v-else>Данных нету, настройте в "Профиле" ключ</div>
                  </div>
                </div>

                <div class="flex m-t-48 m-b-6">
                  <button
                    class="btn btn--primary m-r-24"
                    type="button"
                    @click="nextPanel(4)"
                  >
                    Продолжить
                  </button>
                </div>
              </v-stepper-content>

              <v-stepper-content step="4">
                <h3 class="ng-star-inserted">Информация о кампании</h3>
                <div class="text--color-gray-dark m-t-24 ng-star-inserted">
                  Название кампании
                </div>
                <div class="m-t-8 text--bigger ng-star-inserted">
                  {{ campaignName }}
                </div>
                <div class="text--color-gray-dark m-t-24 ng-star-inserted">
                  Название бренда
                </div>
                <div class="m-t-8 text--bigger ng-star-inserted">
                  {{ userBrands.toString() }}
                </div>
                <div class="text--color-gray-dark m-t-32 ng-star-inserted">
                  Группы предметов
                </div>
                <div class="m-t-8 text--bigger ng-star-inserted">
                  {{ userCategory.toString() }}
                </div>
                <div class="m-t-56 m-b-24 wrap-hide ng-star-inserted">
                  <h3>
                    Предметы, которые вы будете рекламировать<span
                      class="
                        text--color-gray-dark text--regular
                        m-l-8
                        ng-star-inserted
                      "
                    ></span>
                  </h3>
                </div>
                <ul>
                  <li>
                    <div class="m-t-24 m-b-24 ng-star-inserted">
                      {{ userSubject.toString() }}
                    </div>
                  </li>
                </ul>
                <div class="flex m-t-48 m-b-6">
                  <button
                    class="btn btn--primary m-r-24"
                    type="button"
                    @click="addCampaing()"
                  >
                    Сохранить
                  </button>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
      </v-card>
      <v-snackbar v-model="snackbar">
        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
        Введите название кампании
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
import axios from 'axios'

export default {
  data() {
    return {
      campaignName: "",
      e1: 1,
      snackbar: false,
      userCategory: [],
      userBrands: "",
      userSubject: [],
      dialog: false,
      selectedId: "",
      category: [],
      brand: [],
      subject: [],
    };
  },
  computed: {
    ...mapGetters(["brands"]),
    methods() {
      return this.$store.getters.methods; // sms data
    },
  },
  methods: {
    createUrlImage(y) {
      return  y ? `https://images.wbstatic.net/big/new/${y.substr(0, 4)}0000/${y}-1.jpg` : 0;
    },
    async createName(y) {
      const res = await axios.get(`https://wbxcatalog-ru.wildberries.ru/nm-2-card/catalog?spp=10&pricemarginCoeff=1.0&reg=1&appType=1&offlineBonus=0&onlineBonus=0&emp=0&locale=ru&lang=ru&curr=rub&couponsGeo=2,12,6,7,3,18,21&nm=${y}`)
      return res.data.data.products.map((p) => p.name).toString()
    },
    zero() {
      this.category = [];
      this.subject = [];
    },
    getBrand() {
      this.brand = this.brands.map((brand) => brand.brand);
    },
    getCategory() {
      let arr = [];
      let brands = this.brands
        .filter((brand) => brand.brand == this.userBrands)
        .map((brand) => brand.category)
        .filter((e, i, a) => a.indexOf(e) == i);

      if (brands.length > 1) {
        brands
          .filter((b) => b.length > 1)
          .forEach((e) => {
            arr.push(e.toString());
          });
      } else {
        arr.push(brands.filter((b) => b.length != 1).toString());
      }
      this.category = arr
        .filter((e, i, a) => a.indexOf(e) == i)
        .filter((s) => s != "");
    },
    getSubject() {
      let arr = [];
      this.userCategory.forEach((c) => {
          let brands = this.brands
          .filter((brand) => brand.brand == this.userBrands && brand.category == c)
          .map((brand) => brand.nmId)
          .filter((e, i, a) => a.indexOf(e) == i)
      
          brands
            .forEach((e) => {
              arr.push(e.toString());
            });
      })
      this.subject = arr
        .filter((e, i, a) => a.indexOf(e) == i)
        .filter((s) => s != "");
    },
    nextPanel(id) {
      if (id == 2) {
        if (this.campaignName.length > 0) {
          this.getCategory();
          this.e1 = id;
        } else {
          this.snackbar = true;
        }
      }
      if (id == 3) {
        if (this.campaignName.length > 0) {
          this.e1 = id;
        } else {
          this.snackbar = true;
        }
      }
      if (id == 4) {
        if (this.campaignName.length > 0) {
          this.e1 = id;
        } else {
          this.snackbar = true;
        }
      }
    },
    addCampaing() {
      if (
        !this.$store.getters.campaings ||
        this.$store.getters.campaings.length < 1
      ) {
        this.$store.dispatch("ADD_USER_CAMPAING", {
          name: this.campaignName,
          userBrands: this.userBrands,
          userCategory: this.userCategory,
          userSubject: this.userSubject,
          methods: this.methods,
          index: 0,
        });
      } else {
        this.$store.dispatch("ADD_USER_CAMPAING", {
          name: this.campaignName,
          userBrands: this.userBrands,
          userCategory: this.userCategory,
          userSubject: this.userSubject,
          methods: this.methods,
          index: this.$store.getters.campaings.length,
        });
      }
      this.$router.push("/campaigns");
    },
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
    changeStatusDefault(card, i) {
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
    changeMethodsDefault(card, i) {
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
    changeTextDefault(message, i) {
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
      this.selectedId = id;
    },
  },
  created() {
    this.getBrand();
  },
};
</script>

<style scoped>
.combobox__row__item__body {
    -ms-flex: 2;
    flex: 2;
    overflow: hidden;
}
.combobox__row__item__body__main {
    text-overflow: ellipsis;
    overflow: hidden;
}
.combobox__row__item__body__sub {
    color: #4e4e53;
    font-size: 12px;
    line-height: 16px;
}
.combobox__row__item__right{
    text-align: right;
    font-size: 14px;
    color: #4e4e53;
}
.m-l-12 {
    margin-left: 12px !important;
}
.combobox__row__item {
    padding: 6px 12px;
    white-space: nowrap;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
}
img {
  width: 28px;
  height: 38px
}

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
.button {
  font-family: "Lato", Helvetica, sans-serif;
  font-size: 16px;
  padding: 3px 0 4px 20px;
  font-weight: 400;
  text-transform: none;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -ms-flex-align: center;
  align-items: center;
  transition: all 0.15s ease-in-out;
  position: relative;
  white-space: pre;
}
h3 {
  font-size: 20px;
  line-height: 26px;
  font-weight: bold;
  margin: 0;
  color: black;
}
.form label {
  color: #4e4e53;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  margin-bottom: 8px;
}
.form__control {
  max-width: 600px;
}
.m-t-24 {
  margin-top: 24px !important;
}
.form__inputs {
  width: 488px;
}
.form input {
  display: block;
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
.m-t-56 {
  margin-top: 56px !important;
}
.l-h-24 {
  line-height: 24px !important;
}
.m-t-24 {
  margin-top: 24px !important;
}
.text--bigger {
  font-size: 18px !important;
}
.m-b-6 {
  margin-bottom: 6px !important;
}
.m-t-48 {
  margin-top: 48px !important;
}
.flex {
  display: -ms-flexbox;
  display: flex;
}
.btn--primary {
  height: 44px;
  border-radius: 4px !important;
}
.btn {
  padding: 10px 24px;
  border-radius: 4px;
  background-color: #5c2f8e;
  font-size: 16px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: opacity, background-color, color 0.15s ease-in-out;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.m-r-24 {
  margin-right: 24px !important;
}
.m-b-16 {
  margin-bottom: 16px !important;
}
.m-t-32 {
  margin-top: 32px !important;
}
.beta-title {
  font-size: 24px;
  line-height: 29px;
  color: #6c11c9;
  margin-bottom: 24px;
}

/* Setings */

.settings-content {
  display: block;
  border-radius: 8px;
  padding: 10px;
  background-color: #fff;
}

.setting-content {
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