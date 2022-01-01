import axios from 'axios'

export default {
    actions: {
        PAYNAMENT({getters}, payload) {
            // 1. CREATING NEW INSTANCE

            const robokassa = require('node-robokassa');

            const robokassaHelper = new robokassa.RobokassaHelper({

                // REQUIRED OPTIONS:
                merchantLogin: 'WBinform',
                hashingAlgorithm: 'MD5',
                password1: 'khzDovo7V0wdZ446fMEp',
                password2: 'Boy97VzEnudNVf0hoJ07',

                // OPTIONAL CONFIGURATION
                testMode: false, // Whether to use test mode globally
                resultUrlRequestMethod: 'POST' // HTTP request method selected for "ResultURL" requests

            });
            
            axios.get("https://www.cbr-xml-daily.ru/daily_json.js")
            .then((res) => {

            // 2. GENERATING PAYMENT URL

            // Required parameters.
            const outSum = payload / res.data.Valute.USD.Value;
            const invDesc = 'Custom transaction description message';

            // Optional options.
            const options = {
                invId: '29252', // Your custom order ID
                email: 'email@example.com', // E-Mail of the paying user
                outSumCurrency: 'USD', // Transaction currency
                isTest: true, // Whether to use test mode for this specific transaction
                userData: { // You could pass any additional data, which will be returned to you later on
                    productId: '1337',
                    username: getters.userId
                }
            };

            const paymentUrl = robokassaHelper.generatePaymentUrl(outSum, invDesc, options);
            window.location.href = paymentUrl;
            // "paymentUrl" will look like: "https://auth.robokassa.ru/Merchant/Index.aspx..."


            // 3. HANDLING "ResultURL" CALLBACK REQUEST
            })
        }
    },
}