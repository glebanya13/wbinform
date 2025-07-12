<template>
  <div class="page-content">
    <div class="content">
      <div class="breadcrumb">
        <router-link to="/campaings"
          ><button class="btn btn--outline">←&nbsp;Назад</button></router-link
        >
        <router-link to="/campaings">
          <span class="breadcrumb__item ng-star-inserted"
            ><a class="breadcrumb__link ng-star-inserted" href="#">Кампании</a
            ><span class="breadcrumb__devider ng-star-inserted"
              >&nbsp;/&nbsp;</span
            ></span
          >
        </router-link>
        <span class="breadcrumb__item ng-star-inserted"
          ><a
            class="breadcrumb__link ng-star-inserted breadcrumb__link--active"
            >{{ campaing.name }}</a
          ></span
        >
      </div>
      <div class="well m-b-48 p-x-28">
        <h3 class="text--twenty l-h-28 ng-star-inserted">
          {{ campaing.name }}

          <v-dialog v-model="editDialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <div
                class="icon icon__pencil-create m-l-6 ng-star-inserted"
                v-bind="attrs"
                v-on="on"
              ></div>
            </template>
            <v-card class="elevation-4">
              <v-toolbar color="purple darken-2" dark flat>
                <v-toolbar-title>Поменять название кампании</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-container>
                  <validation-observer ref="observer" v-slot="{ invalid }">
                    <form @submit.prevent="send()">
                      <validation-provider
                        v-slot="{ errors }"
                        name="name"
                        rules="required"
                      >
                        <v-text-field
                          v-model="campaing.name"
                          :error-messages="errors"
                          label="Название кампании"
                          required
                          outlined
                        ></v-text-field>
                      </validation-provider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" dark @click="closeEditDialog()">
                          Отмена
                        </v-btn>
                        <v-btn
                          class="float-right"
                          type="send"
                          :disabled="invalid"
                        >
                          Подтвердить
                        </v-btn>
                      </v-card-actions>
                    </form>
                  </validation-observer>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>

          <button
            v-if="campaing.status == 'Идут показы'"
            class="btn btn--outline m-l-24 ng-star-inserted"
            @click="setDateCompletion()"
          >
            Завершить кампанию
          </button>
          <button
            v-else
            class="btn btn--outline m-l-24 ng-star-inserted"
            @click="setDateReturn()"
          >
            Возобновить
          </button>
        </h3>
        <div class="m-t-24 ng-star-inserted">
          <div class="text--color-gray-dark l-h-20">Статус</div>
          <div class="status search status--9 m-t-8 text--bigger l-h-24">
            {{ campaing.status }}
          </div>
        </div>
      </div>
      <div class="m-t-32 ng-star-inserted">
        <label>Группы предметов </label>
        <div>
          <span> {{ category }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
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
  data() {
    return {
      editDialog: false,
      editDialog1: false,
      checkbox: false,
      balanceRules: [(v) => (v && v >= 100) || "Минимальный бюджет 100₽"],
    };
  },
  computed: {
    campaingsFromDB() {
      return this.$store.getters.campaings;
    },
    campaing() {
      return this.campaingsFromDB[this.$route.params.id] || "";
    },
    check() {
      return this.campaingsFromDB[this.$route.params.id]
        ? this.campaingsFromDB[this.$route.params.id].budget
        : "";
    },
    category() {
      return this.campaingsFromDB[this.$route.params.id]
        ? this.campaingsFromDB[this.$route.params.id].category.toString()
        : "";
    },
  },
  methods: {
    send() {
      this.$store.dispatch("EDIT_USER_CAMPAING_NAME", {
        item: this.campaing,
        index: Number(this.$route.params.id),
      });
      this.editDialog = false;
      this.editDialog1 = false;
    },
    changeBudget(check) {
      try {
        firebase
          .database()
          .ref(
            "userData/" +
              this.$store.getters.userId +
              "/campaings/" +
              this.$route.params.id
          )
          .update({
            budget: !check,
          });
      } catch (e) {
        console.log(e);
      }
    },
    closeEditDialog() {
      this.editDialog = false;
      this.editDialog1 = false;
      this.$store.dispatch("LOAD_CAMPAINGS");
    },
    setDateCompletion() {
      this.$store.dispatch("COMPLETE_CAMPAING", this.$route.params.id);
    },
    setDateReturn() {
      this.$store.dispatch("RETURN_CAMPAING", this.$route.params.id);
    },
  },
};
</script>

<style scoped>
.m-l-6 {
  margin-left: 6px !important;
}
.m-l-24 {
  margin-left: 24px !important;
}
.m-t-24 {
  margin-top: 24px !important;
}
.l-h-20 {
  line-height: 20px !important;
}
.p-x-28 {
  padding: 28px !important;
}
.m-b-48 {
  margin-bottom: 48px !important;
}
.l-h-24 {
  line-height: 24px !important;
}
.m-t-8 {
  margin-top: 8px !important;
}
.m-t-32 {
  margin-top: 32px !important;
}
.m-t-56 {
  margin-top: 56px !important;
}
.m-t-48 {
  margin-top: 48px !important;
}
.l-h-28 {
  line-height: 28px !important;
}
.content {
  border-radius: 8px;
  padding: 32px;
  background-color: #fff;
}

.well {
  background-color: #f4f4f8;
}

.page-content {
  display: block;
  border-radius: 8px;
  padding: 32px;
  background-color: #fff;
}
.breadcrumb {
  font-size: 14px;
  color: #410b7b;
  margin-bottom: 32px;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
}
.breadcrumb .btn {
  margin-right: 24px;
  padding: 7px 24px;
}
.btn--outline {
  background-color: white;
  box-shadow: inset 0 0 0 1px #d5d5d5;
  font-weight: normal;
}
.btn {
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 16px;
  color: #000000;
  font-weight: 400;
  cursor: pointer;
  transition: opacity, background-color, color 0.15s ease-in-out;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
a {
  color: #3a0078;
  text-decoration: none;
}
.breadcrumb__devider {
  pointer-events: none;
  font-size: 14px;
  color: #cecece;
}
.breadcrumb__link--active {
  color: #8b8b8b !important;
  pointer-events: none;
}

h3 {
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
}
h3 {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
}

h3 .icon {
  cursor: pointer;
}
.icon__pencil-create {
  background-image: url(../assets/img/pencil-create.svg);
  width: 18px;
  height: 18px;
}
.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center center;
  mask-position: center center;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}

.text--color-gray-dark {
  color: #4e4e53;
}
.status--9 {
  font-weight: bold;
}

.text--bigger {
  font-size: 18px !important;
}

h1 {
  font-size: 30px;
  font-weight: bold;
  margin: 0;
  line-height: 100%;
}

.text--bold {
  font-weight: bold;
}
.text--twenty {
  font-size: 20px;
}
.flex--align-flex-end {
  -ms-flex-align: end;
  align-items: flex-end;
}
.flex {
  display: -ms-flexbox;
  display: flex;
}

.form label {
  color: #4e4e53;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  margin-bottom: 8px;
}
</style>