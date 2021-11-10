import Vue from 'vue';
import firebase from 'firebase';

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
        LOAD_USER_DATA({ commit, getters, dispatch }) {

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
                    dispatch('GET_WB_API')
                    commit('SET_PROCESSING', false)
                })
            } catch (error) {
                commit('SET_PROCESSING', false)
                commit('SET_ERROR', error)
                throw error
            }
        },
        ADD_USER_API_TOKEN({ commit, getters }, payload) {
            commit('SET_PROCESSING', true)

            try {
                firebase.database().ref('userData/' + getters.userId).update({
                    apiToken: payload
                });
                commit('SET_PROCESSING', false)

            }
            catch (e) {
                commit('SET_ERROR', e);
                commit('SET_PROCESSING', false);
                throw e;
            }
        },
        // server
        // CHANGE_USER_BALANCE({ commit, getters }, payload) {
        //     commit('SET_PROCESSING', true)

        //     try {
        //         firebase.database().ref('userData/' + getters.userId).update({
        //             balance: getters.balance - payload
        //         });
        //         commit('SET_PROCESSING', false)

        //     }
        //     catch (e) {
        //         commit('SET_ERROR', e);
        //         commit('SET_PROCESSING', false);
        //         throw e;
        //     }
        // }

    },

    getters: {
        balance: (s) => s.userData.balance,
        apiToken: (s) => s.userData.apiToken
    }
}