export default {
    state: {
        orders: []
    },
    mutations: {
        SET_ORDERS(state, payload) {
            state.orders = payload
        }
    },
    actions: {
        GET_WB_API({ commit, getters }) {
            const api_key = getters.apiToken;

            var url =
                "https://suppliers-api.wildberries.ru/api/v2/orders?date_start=2021-08-01T00%3A00%3A00.365%2B03%3A00&date_end=2022-06-26T12%3A00%3A33.365%2B03%3A00&take=1000&skip=0";
            // "https://suppliers-api.wildberries.ru/api/v2/orders?date_start=2021-08-01T00%3A00%3A00.365%2B03%3A00&date_end=2022-06-26T12%3A00%3A33.365%2B03%3A00&take=1000&skip=0";

            fetch(url, {
                headers: {
                    contentType: "application/json",
                    Authorization: api_key,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    var orders = data.orders;
                    commit('SET_ORDERS', orders)
                })
                .catch((error) => {
                    commit('SET_ERROR', error)
                    throw error
                });
        },
        API_SMS_NOTIFIER({getters, dispatch, commit}) {
            var SMSru = require('sms_ru'),
            sms = new SMSru('8d774f95-4e72-cfd4-7579-0404ca9f2df7');
            if(getters.balance >= 100) {
            getters.orders.forEach(order => {
                if(order.status == 0 && 1) {
                    sms.sms_cost({to: getters.orders.filter(order => order.status == 0 && 1).map(order => order.userInfo.phone) ,text: 'Поступил заказ. Спасибо за заказ!'}, function(e){
                        console.log(e);
                    });
                }
                if(order.userStatus == 2) {
                    sms.sms_cost({to: getters.orders.filter(order => order.userStatus == 2).map(order => order.userInfo.phone) ,text: 'Заказ доставлен. Спасибо что выкупили.'}, function(e){
                        var balance = e.price * getters.orders.filter(order => order.userStatus == 2).map(order => order.userInfo.phone).length
                        dispatch('CHANGE_USER_BALANCE', balance)
                    });
                }
                
            });
        }
        else {
            commit('SET_ERROR', 'Пополните Ваш баланс');
        }
            
        },
        PAYNAMENT({getters, dispatch}) {
            const robokassa = require('node-robokassa');

            const robokassaHelper = new robokassa.RobokassaHelper({

                // REQUIRED OPTIONS:
                merchantLogin: 'WBinform',
                hashingAlgorithm: 'MD5',
                password1: 'khzDovo7V0wdZ446fMEp',
                password2: 'Boy97VzEnudNVf0hoJ07',

                // OPTIONAL CONFIGURATION
                testMode: true, // Whether to use test mode globally
                resultUrlRequestMethod: 'POST' // HTTP request method selected for "ResultURL" requests

            });


            // 2. GENERATING PAYMENT URL

            // Required parameters.
            const outSum = 14.00;
            const invDesc = 'Custom transaction description message';

            // Optional options.
            const options = {
                invId: 100500, // Your custom order ID
                email: getters.userEmail, // E-Mail of the paying user
                outSumCurrency: 'USD', // Transaction currency
                isTest: true, // Whether to use test mode for this specific transaction
                userData: { // You could pass any additional data, which will be returned to you later on
                    productId: '1337',
                    username: 'User'
                }
            };

            const paymentUrl = robokassaHelper.generatePaymentUrl(outSum, invDesc, options);
            console.log(paymentUrl);
            window.location.href = paymentUrl;

            // "paymentUrl" will look like: "https://auth.robokassa.ru/Merchant/Index.aspx..."


            // 3. HANDLING "ResultURL" CALLBACK REQUEST

            fetch("/robokassa/callback", function (req, res) {

                robokassaHelper.handleResultUrlRequest(req, res, function (values, userData) {


                    console.log({
                        values: values, // Will contain general values like "invId" and "outSum"
                        userData: userData // Will contain all your custom data passed previously, e.g.: "productId"
                    });

                    dispatch('ADD_USER_BALANCE', userData.paymentAmount.sumFormatted)

                    
                    // You could return "false" here in order to throw error instead of success to Robokassa.
                    // return false;

                    // You could also return promise here.
                    // return Promise.resolve();

                });

            })
        }
    },
    getters: {
        orders: (s) => s.orders
    },
}