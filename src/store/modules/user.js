import firebase from 'firebase'

export default {
    state: {
        user: {
            isAuthenticated: false,
            uid: null,
            name: null,
            email: null
        },
        unsubscribeAuth: null
    },
    mutations: {
        SET_USER(state, payload) {
            state.user.isAuthenticated = true
            state.user.uid = payload.uid
            state.user.email = payload.email
        },
        UNSET_USER(state) {
            state.user = {
                isAuthenticated: false,
                uid: null
            }
        },
        SET_USER_EMAIL(state, payload) {
            state.user.email = payload
        },
        SET_UNSUBSCRIBE_AUTH(state, payload) {
            state.unsubscribeAuth = payload
        }
    },
    actions: {
        INIT_AUTH({ dispatch, commit, state }) {
            return new Promise((resolve) => {
                if (state.unsubscribeAuth)
                    state.unsubscribeAuth()
                let unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
                    dispatch('STATE_CHANGED', user)
                    resolve(user)
                });
                commit('SET_UNSUBSCRIBE_AUTH', unsubscribe)
            })
        },
        // email methods
        SIGNUP({ commit }, payload) {
            commit('SET_PROCESSING', true)
            commit('CLEAR_ERROR')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(() => {
                    commit('SET_PROCESSING', false)
                })
                .catch(function (error) {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error.message)

                })
        },
        SIGNIN({ commit }, payload) {
            commit('SET_PROCESSING', true)
            commit('CLEAR_ERROR')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(() => {
                    commit('SET_PROCESSING', false)
                })
                .catch(function (error) {
                    commit('SET_PROCESSING', false)
                    commit('SET_ERROR', error.message)
                })
        },
        SIGNOUT() {
            firebase.auth().signOut();
            document.location.reload();
        },
        STATE_CHANGED({ commit, dispatch }, payload) {
            if (payload) {
                commit('SET_USER', { uid: payload.uid }) // email: payload.email
                dispatch('LOAD_USER_DATA', payload.uid); // load user data
                dispatch('LOAD_ORDERS') // load orders
                dispatch('LOAD_CAMPAINGS') // load campaings
                dispatch('LOAD_BRANDS') // load brands
            } else {
                commit('UNSET_USER')
            }
        },
    },
    getters: {
        userId: (state) => state.user.uid,
        userEmail: (state) => state.user.email,
        isUserAuthenticated: (state) => state.user.isAuthenticated
    }
}