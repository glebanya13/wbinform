import Vue from 'vue';
export default {
    state: {
        orders: [],
        sms: []
    },
    mutations: {
        SET_ORDERS(state, payload) {
            state.orders = payload
        },
        SET_SMS(state, payload) {
            state.sms = payload
        },
    },
    actions: {
        // server
        LOAD_TO_DB_WB_DATA({ commit, getters }, payload) {
            commit('SET_PROCESSING', true)

            var userscollection = payload

            userscollection.forEach(function (obj) {
                Vue.$cdb.collection(`wbData/${getters.userId}/orders/`).doc(obj.dateCreated).set({
                    dateCreated: obj.dateCreated,
                    orderId: obj.orderId,
                    fio: obj.userInfo.fio,
                    phone: obj.userInfo.phone,
                    status: obj.status,
                    userStatus: obj.userStatus,
                    sms_status: 0,
                    price: 0,
                })
            })
            console.log('asd');
            commit('SET_PROCESSING', false)
        },
        LOAD_FROM_DB_WB_DATA({ commit, getters }) {
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
                            sms_status: data.sms_status,
                            sms_price: data.price
                        }
                        orders.push(order)
                    })
                    commit('SET_ORDERS', orders)
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        LOAD_FROM_DB_SMS_DATA({ commit, getters }) {
            Vue.$cdb.collection(`wbData/${getters.userId}/sms`)
                .get()
                .then(querySnapshot => {
                    let smss = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let sms = {
                            dateCreated: data.dateCreated,
                            sms_status: data.sms_status,
                            sms_price: data.price
                        }
                        smss.push(sms)
                    })
                    commit('SET_SMS', smss)
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        BATCH({ commit, getters }) {
            var batch = Vue.$cdb.batch();

            getters.sms.forEach(function (obj) {
                batch.update(Vue.$cdb.collection(`wbData/${getters.userId}/orders/`).doc(obj.dateCreated),
                    {
                        sms_status: getters.sms.find(s => s.dateCreated == obj.dateCreated).sms_status,
                        price: getters.sms.find(s => s.dateCreated == obj.dateCreated).sms_price
                    });
            })
            batch.commit().then(function (r) {
                console.log('ok', r)
            })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                });
        },
        ADD_SMS_STATUS({ getters, dispatch }, payload) {
            console.log('success');
            payload.orders.forEach(function (obj) {
                Vue.$cdb.collection(`wbData/${getters.userId}/sms/`).doc(obj.dateCreated).set({
                    dateCreated: obj.dateCreated,
                    sms_status: payload.sms_status,
                    price: payload.sms_price
                })
                    .then(() =>
                        dispatch('BATCH')
                    )
            })

        }
    },
    getters: {
        orders: (s) => s.orders,
        sms: (s) => s.sms
    }
}