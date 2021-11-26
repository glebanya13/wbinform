import Vue from 'vue';
import firebase from 'firebase';

let defaultUserData = {
    balance: 0,
    apiToken: null,
    start: false
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
        ADD_USER_API_TOKEN({ commit, getters }, payload) {
            commit('SET_PROCESSING', true)
            try {
                firebase.database().ref('userData/' + getters.userId + '/apiToken/' + payload.index).update({
                    name: payload.name,
                    key: payload.key,
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
        DELETE_API_TOKEN({ commit, getters }, payload) {
            commit('SET_PROCESSING', true);
            if(payload != Object.keys(getters.apiToken).length) {
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
    },
    getters: {
        balance: (s) => s.userData.balance,
        apiToken: (s) => s.userData.apiToken,
    }
}