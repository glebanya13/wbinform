export default {
    actions: {
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
}