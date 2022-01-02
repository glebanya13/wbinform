import firebase from 'firebase';
import Vue from 'vue'

export default {
    state: {
        campaings: [],
        brands: [],
    },
    mutations: {
        SET_CAMPAINGS(state, payload) {
            state.campaings = payload
        },
        SET_BRANDS(state, payload) {
            state.brands = payload
        },
    },
    actions: {
        // add user campaing
        ADD_USER_CAMPAING({ commit, getters, dispatch }, payload) {
            commit('SET_PROCESSING', true)
            try {
                firebase.database().ref('userData/' + getters.userId + '/campaings/' + payload.index).update({
                    name: payload.name,
                    balance: 0,
                    status: 'Идут показы',
                    dateCreated: new Date().toISOString().split('T')[0],
                    brands: payload.userBrands,
                    category: payload.userCategory,
                    subject: payload.userSubject,
                    // methods: payload.methods
                })
                    .then(() => {
                        dispatch("ADD_METHODS_DATA", payload.index)
                    })
            }
            catch (e) {
                commit('SET_ERROR', e);
                commit('SET_PROCESSING', false);
                throw e;
            }
        },
        // complete campaing
        COMPLETE_CAMPAING({ commit, getters }, payload) {
            commit('SET_PROCESSING', true);
            try {
                firebase.database().ref('userData/' + getters.userId + '/campaings/' + payload).update({
                    status: 'Приостановлено',
                    dateCompletion: new Date().toISOString().split('T')[0]
                })
            }
            catch (e) {
                commit('SET_ERROR', e);
                commit('SET_PROCESSING', false);
                throw e;
            }
        },
        RETURN_CAMPAING({ commit, getters }, payload) {
            commit('SET_PROCESSING', true);
            try {
                firebase.database().ref('userData/' + getters.userId + '/campaings/' + payload).update({
                    status: 'Идут показы',
                    dateCompletion: ""
                })
            }
            catch (e) {
                commit('SET_ERROR', e);
                commit('SET_PROCESSING', false);
                throw e;
            }
        },
        LOAD_CAMPAINGS({ commit, getters }) {
            var userDataRef = firebase.database().ref('userData/' + getters.userId + '/campaings')
            try {
                userDataRef.on('value', (snapshot) => {
                    const data = snapshot.val();

                    commit('SET_CAMPAINGS', data)
                    commit('SET_PROCESSING', false)
                })
            } catch (error) {
                commit('SET_PROCESSING', false)
                commit('SET_ERROR', error)
                throw error
            }
        },
        EDIT_USER_CAMPAING_NAME({ commit, getters }, payload) {
            console.log(payload);
            commit('SET_PROCESSING', true)
            try {
                firebase.database().ref('userData/' + getters.userId + '/campaings/' + payload.index).update({
                    name: payload.item.name,
                    balance: payload.item.balance
                })
            }
            catch (e) {
                commit('SET_ERROR', e);
                commit('SET_PROCESSING', false);
                throw e;
            }
        },
        // load brands from db
        LOAD_BRANDS({ commit, getters }) {
            Vue.$cdb.collection(`wbData/${getters.userId}/brands`)
                .get()
                .then(querySnapshot => {
                    let brands = []
                    querySnapshot.forEach(s => {
                        const data = s.data()
                        let brand = {
                            brand: data.brand,
                            subject: data.subject,
                            category: data.category,
                            nmId:
                                data.nmId,
                        }

                        brands.push(brand)

                    })
                    commit('SET_BRANDS', brands)
                })
                .catch(error => {
                    commit('SET_ERROR', error)
                    throw error
                })
        },
    },
    getters: {
        campaings: (s) => s.campaings,
        brands: (s) => s.brands
    }
}