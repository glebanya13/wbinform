import Vue from 'vue';
import firebase from 'firebase';

let defaultUserData = {
    balance: 0, // userBalance
    apiToken: null, // api auth data
    methods: [] // sms data
};

export default {
    state: {
        userData: defaultUserData,
        orders: []
    },
    mutations: {
        SET_USER_DATA(state, payload) {
            Vue.set(state, 'userData', payload)
        },
        UNSET_USER_DATA(state) {
            state.userData = defaultUserData
        },
        SET_ORDERS(state, payload) {
            state.orders = payload
        },
    },
    actions: {
        // load data
        LOAD_USER_DATA({ commit, getters }) {
            commit('SET_PROCESSING', true)
            var userDataRef = firebase.database().ref('userData/' + getters.userId);
            try {
                userDataRef.on('value', (snapshot) => {
                    const data = snapshot.val();
                    let userData = defaultUserData
                    if (data) {
                        userData = data;
                    }
                    commit('SET_USER_DATA', userData)
                    commit('SET_PROCESSING', false)
                })
            } catch (error) {
                commit('SET_PROCESSING', false)
                commit('SET_ERROR', error)
                throw error
            }
        },
        // add api data
        ADD_USER_API_TOKEN({ commit, getters, dispatch }, payload) {
            commit('SET_PROCESSING', true)
            try {
                firebase.database().ref('userData/' + getters.userId + '/apiToken/' + payload.index).update({
                    name: payload.name,
                    key: payload.key,
                    status: 'На проверке',
                    startDate: new Date(),
                }).then(() => {
                    if (getters.methods === undefined) {
                        dispatch("ADD_METHODS_DATA")
                    }
                })
            }
            catch (e) {
                commit('SET_ERROR', e);
                commit('SET_PROCESSING', false);
                throw e;
            }
        },
        // update api data by key
        UPDATE_USER_API_TOKEN({ commit, getters }, payload) {
            commit('SET_PROCESSING', true)
            try {
                firebase.database().ref('userData/' + getters.userId + '/apiToken/' + payload.index).update({
                    name: payload.item.name,
                    key: payload.item.key,
                    status: 'На проверке',
                    startDate: new Date(),
                })
            }
            catch (e) {
                commit('SET_ERROR', e);
                commit('SET_PROCESSING', false);
                throw e;
            }
        },
        // delete api data by key
        DELETE_API_TOKEN({ commit, getters }, payload) {
            commit('SET_PROCESSING', true);
            if (payload != Object.keys(getters.apiToken).length) {
                let arr = getters.apiToken;
                arr.splice(payload, 1)
                firebase.database().ref('userData/' + getters.userId + '/apiToken').remove()
                firebase.database().ref('userData/' + getters.userId + '/apiToken').set(arr)
            }
            else {
                try {
                    firebase.database().ref('userData/' + getters.userId + '/apiToken/' + payload).remove()
                }
                catch (e) {
                    commit('SET_ERROR', e);
                    commit('SET_PROCESSING', false);
                    throw e;
                }
            }
        },
        // add sms data after auth
        ADD_METHODS_DATA({ commit, getters }) {
            commit('SET_PROCESSING', true)
            try {
                firebase.database().ref('userData/' + getters.userId).update({
                    methods: [
                        {
                            message: "Добрый день, {ИМЯ}! Мы невероятно рады, что вы сделали заказ нашего товара {ССЫЛКА} бренда {БРЕНД}  артикул {АРТИКУЛ ТОВАРА} на сайте Wildberries, отличный выбор! От команды {БРЕНД} огромное спасибо 😊. Мы уже начали оперативно собирать ваш заказ.",
                            name: "Стартовое уведомление",
                            start: true
                        }, {
                            message: "Спасибо за ваш недавний заказ на Wildberries. Я надеюсь, что изделие понравилось!  Если да, то не могли бы вы опубликовать отзыв? Это поможет нам и далее предоставлять отличные продукты и содействовать потенциальным покупателям в принятии уверенных решений. ⭐️⭐️⭐️⭐️⭐️",
                            name: "Уведомление о получении товара клиентом с ПВЗ",
                            start: false
                        }, {
                            message: "Ваш заказ от Wildberries находится в пункте выдачи  по адресу {АДРЕС ПВЗ}, у вас есть 7 дней бесплатного хранения.",
                            name: "Напоминание при несвоевременном получении товара с ПВЗ",
                            start: false
                        }, {
                            message: "Здравствуйте! Это (название бренда). Нам жаль, что (ССЫЛКА) не подошел вам. Возможно, вас заинтересуют другие предложения (2-3 ссылки на товары бренда). Ждем вас!",
                            name: "Уведомление об отказе клиентом",
                            start: false
                        }, {
                            message: "Здравствуйте! Это (название бренда). Благодарим за покупку (название товара) на сайте Wildberries! 😊 Оставьте, пожалуйста, отзыв на странице товара. В благодарность мы вышлем вам (чек-лист, ТОП-5 и т.д.).",
                            name: "Уведомление c просьбой оставить отзыв",
                            status: true
                        }, {
                            message: "Успейте купить удобные, легкие женские шлепанцы MG! по выгодной цене! В наличии большой ассортимент моделей от популярных новинок до лидеров продаж.",
                            name: "Массовая рассылка",
                            start: false
                        }
                    ]
                })
            }
            catch (e) {
                commit('SET_ERROR', e);
                commit('SET_PROCESSING', false);
                throw e;
            }
        },
        // load orders from db
        LOAD_ORDERS({ commit, getters }) {
            Vue.$cdb.collection(`wbData/${getters.userId}/orders`)
                .get()
                .then(querySnapshot => {
                    let orders = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let order = {
                            dateCreated: data.dateCreated,
                            orderId: data.orderId,
                            fio: data.fio,
                            phone: data.phone,
                            status: data.status,
                            userStatus: data.userStatus,
                            tableStatus: "",
                            sms_status: data.sms_status,
                            sms_price: data.price
                        }

                        orders.push(order)

                        // status for table

                        orders.forEach((order) => {
                            if (order.status == 0) {
                                order.tableStatus = "Новый";
                            }
                            if (order.status == 8) {
                                order.tableStatus = "На сборке";
                            }
                            if (order.status == 3) {
                                order.tableStatus = "Отклонен";
                            }
                            if (order.userStatus == 3) {
                                order.tableStatus = "Отменен";
                            }
                            if (order.userStatus == 1) {
                                order.tableStatus = "Отменен";
                            }
                            if (order.userStatus == 5) {
                                order.tableStatus = "Отменен";
                            }
                            if (order.userStatus == 1 && status == 1) {
                                order.tableStatus = "Отменен";
                            }
                            if (order.status == 1) {
                                order.tableStatus = "На сборке";
                            }
                            if (order.userStatus == 2) {
                                order.tableStatus = "Доставлен";
                            }
                            if (order.status == 6) {
                                order.tableStatus = "Доставлен";
                            }
                            if (order.status == 2 && 5 && 9 && order.userStatus == 4) {
                                order.tableStatus = "На доставке";
                            }
                        })
                    })
                    commit('SET_ORDERS', orders)
                    console.log(orders);
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
    },
    getters: {
        balance: (s) => s.userData.balance,
        apiToken: (s) => s.userData.apiToken,
        methods: (s) => s.userData.methods,
        orders: (s) => s.orders,
    }
}