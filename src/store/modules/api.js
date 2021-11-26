export default {
    state: {
        sms_cost: null
    },
    mutations: {
        SET_SMS_COST(state, payload) {
            state.sms_cost = payload;
        }
    },
    actions: {
        // server
        API_SMS_NOTIFIER({ commit }) {
            var SMSru = require('sms_ru');

            const sms = new SMSru('8d774f95-4e72-cfd4-7579-0404ca9f2df7');

            sms.sms_cost({ to: '79261438245', from: 'Wildberries', text: 'Поступил заказ. Спасибо за заказ!' }, function (e) {
                commit("SET_SMS_COST", e.price)
                console.log(e.price);
            });
            // if (getters.orders.filter(order => order.status == 1 && order.userStatus != 1 && order.sms_status != 1).length > 0) {
            //     console.log('1');
            //     sms.sms_cost({ to: getters.orders.filter(order => order.status == 1 && order.userStatus != 1 && order.sms_status != 1).map(order => order.phone), text: 'Поступил заказ. Спасибо за заказ!' }, function (e) {
            //         console.log(e);
            //         var balance = e.price * getters.orders.filter(order => order.status == 1 && order.userStatus != 1 && order.sms_status != 1).map(order => order.phone).length
            //         if (getters.balance < balance) {
            //             commit('SET_ERROR', 'Пополните Ваш баланс');
            //         } else {
            //             dispatch('CHANGE_USER_BALANCE', balance)
            //             dispatch('ADD_SMS_STATUS', { orders: getters.orders.filter(order => order.status == 1 && order.userStatus != 1 && order.sms_status != 1), sms_status: 1, sms_price: e.price })
            //         }
            //     });
            // }
            // if (getters.orders.filter(order => order.userStatus == 2 && order.sms_status != 2).length > 0) {
            //     console.log('2');
            //     sms.sms_cost({ to: getters.orders.filter(order => order.userStatus == 2 && order.sms_status != 2).map(order => order.phone), text: 'Заказ доставлен. Спасибо что выкупили.' }, function (e) {
            //         var balance = e.price * getters.orders.filter(order => order.userStatus == 2 && order.sms_status != 2).map(order => order.phone).length
            //         if (getters.balance < balance) {
            //             commit('SET_ERROR', 'Пополните Ваш баланс');
            //         } else {
            //             dispatch('CHANGE_USER_BALANCE', balance);
            //             dispatch('ADD_SMS_STATUS', { orders: getters.orders.filter(order => order.userStatus == 2 && order.sms_status != 2), sms_status: 2, sms_price: e.price })
            //         }
            //     });
            // }
        },
        // no server
        PAYNAMENT({ getters }) {
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
                    id: getters.userId,
                    username: 'User'
                }
            };

            const paymentUrl = robokassaHelper.generatePaymentUrl(outSum, invDesc, options);
            window.location.href = paymentUrl;

            // "paymentUrl" will look like: "https://auth.robokassa.ru/Merchant/Index.aspx..."


            // 3. HANDLING "ResultURL" CALLBACK REQUEST

            fetch("https://wbinform.ru/callback.php", function (req, res) {

                robokassaHelper.handleResultUrlRequest(req, res, function (values, userData) {


                    console.log({
                        values: values, // Will contain general values like "invId" and "outSum"
                        userData: userData // Will contain all your custom data passed previously, e.g.: "productId"
                    });

                    // You could return "false" here in order to throw error instead of success to Robokassa.
                    // return false;

                    // You could also return promise here.
                    // return Promise.resolve();

                });

            })
        }
    },
    getters: {
        sms_cost: (s) => s.sms_cost
    }
}