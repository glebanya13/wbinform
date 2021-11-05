import Vue from 'vue';

let defaultUserData = {
    balance: 0,
    apiToken: null
};

export default {
    state: {
        userData: defaultUserData,
    },
    mutations: {
        SET_USER_DATA(state, payload) {
            Vue.set(state, 'userData', payload)
        },
        UNSET_USER_DATA(state) {
            state.userData = defaultUserData
        },
    },
    actions: {
        LOAD_USER_DATA({ commit, dispatch }, payload) {

            commit('SET_PROCESSING', true)
            let userDataRef = Vue.$db.collection('userData').doc(payload)
            userDataRef.get()
                .then((data) => {
                    let userData = defaultUserData
                    if (data.exists) {
                        userData = data.data();
                    }

                    commit('SET_USER_DATA', userData)
                    dispatch('GET_WB_API')
                    commit('SET_PROCESSING', false)
                })
                .catch(error => {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error)
                    throw error
                })
        },
        ADD_USER_API_TOKEN({ commit, getters }, payload) {
            commit('SET_PROCESSING', true);

            let userDataRef = Vue.$db.collection('userData').doc(getters.userId);

            userDataRef.set({
                apiToken: payload.apiToken,
            }, { merge: true })

                .then(() => {
                    commit('SET_PROCESSING', false);
                })
                .catch((e) => {
                    commit('SET_ERROR', e);
                    commit('SET_PROCESSING', false);
                    throw e;
                });
        },
        ADD_USER_BALANCE({ commit, getters }, payload) {
            commit('SET_PROCESSING', true);
            let userDataRef = Vue.$db.collection('userData').doc(getters.userId);

            userDataRef.set({
                balance: getters.balance + payload,
            }, { merge: true })

                .then(() => {
                    document.location.reload()
                    commit('SET_PROCESSING', false);
                })
                .catch((e) => {
                    commit('SET_ERROR', e);
                    commit('SET_PROCESSING', false);
                    throw e;
                });
        },
        CHANGE_USER_BALANCE({ commit, getters }, payload) {
            commit('SET_PROCESSING', true);
            let userDataRef = Vue.$db.collection('userData').doc(getters.userId);

            userDataRef.set({
                balance: getters.balance - payload,
            }, { merge: true })

                .then(() => {
                    document.location.reload()
                    commit('SET_PROCESSING', false);
                })
                .catch((e) => {
                    commit('SET_ERROR', e);
                    commit('SET_PROCESSING', false);
                    throw e;
                });
        }

    },

    getters: {
        balance: (s) => s.userData.balance,
        apiToken: (s) => s.userData.apiToken
    }
}