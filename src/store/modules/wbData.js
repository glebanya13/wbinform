import Vue from 'vue';
export default {
    state: {
        orders: [],
    },
    mutations: {
        SET_ORDERS(state, payload) {
            state.orders = payload
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
        // client
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
                    console.log(orders);
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
    },
    getters: {
        orders: (s) => s.orders,
    }
}