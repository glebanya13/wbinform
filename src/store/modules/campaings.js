import firebase from 'firebase';

export default {
    state: {
        campaings: []
    },
    mutations: {
        SET_CAMPAINGS(state, payload) {
            state.campaings = payload
        },
    },
    actions: {
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
        EDIT_USER_CAMPAING_NAME({ commit, getters }, payload) {
            console.log(payload);
            commit('SET_PROCESSING', true)
            try {
                firebase.database().ref('userData/' + getters.userId + '/campaings/' + payload.index).update({
                    name: payload.item.name,
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
    },
    getters: {
        campaings: (s) => s.campaings
    }
}