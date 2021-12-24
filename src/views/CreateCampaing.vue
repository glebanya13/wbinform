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
              <v-stepper-step :complete="e1 > 1" step="1" color="#3a0078">
                Ваша кампания
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2" color="#3a0078">
                Ассортимент
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3" color="#3a0078">
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
                    <h3 class="mt-8">Выбрать бренд из списка</h3>
                    <div class="form__control m-t-24">
                      <label for="groups">Бренд</label
                      ><v-select
                        :items="[
                          'Блесны рыболовные',
                          'Гирлянды',
                          'Декорации настенные',
                        ]"
                        v-model="groups"
                        autocomplete="off"
                        outlined
                        multiple
                        placeholder="Группы предметов"
                      ></v-select>
                    </div>
                    <h3 class="m-t-56">Выберите способ загрузки товара</h3>
                    <div
                      class="
                        m-t-24
                        create-catalog-disclaimer
                        text--bigger
                        l-h-24
                      "
                    >
                      Мы автоматически подгрузим все товары по выбранным Вами
                      группам предметов или Вы можете загрузить свой excel-файл
                      с артикулами товаров, которые подойдут под эти группы
                      предметов
                    </div>
                    <div class="flex m-t-48 m-b-6">
                      <button
                        class="btn btn--primary m-r-24"
                        type="button"
                        @click="nextPanel(2)"
                      >
                        Выбрать товары
                      </button>
                      <div class="upload-file">
                        <div>
                          <button class="btn btn--primary m-r-22" type="button">
                            Загрузить номенклатуры
                          </button>
                        </div>
                      </div>
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
                        :items="[
                          'Блесны рыболовные',
                          'Гирлянды',
                          'Декорации настенные',
                        ]"
                        v-model="groups"
                        autocomplete="off"
                        outlined
                        multiple
                        placeholder="Группы предметов"
                      ></v-select>
                    </div>
                    <h3 class="m-t-56">Выберите предметы из группы</h3>
                    <div class="form__control m-t-24">
                      <label for="objects">Предмет</label
                      ><v-select
                        :items="[
                          'OXO tourist / Отцеп рыболовный/блесна рыболовная',
                        ]"
                        v-model="objects"
                        autocomplete="off"
                        outlined
                        placeholder="Выберите из списка"
                      ></v-select>
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

              <v-stepper-content step="3"> </v-stepper-content>
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
export default {
  data() {
    return {
      campaignName: "",
      e1: 1,
      snackbar: false,
      groups: [],
    };
  },
  methods: {
    nextPanel(id) {
      if (id == 2) {
        if (this.campaignName.length > 0) {
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
</style>