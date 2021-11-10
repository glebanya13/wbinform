const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp({
  databaseURL: "https://wbinform-4398f.firebaseio.com/",
});

exports.sms = functions.firestore.document("wbData/{userId}/orders")
    .onUpdate((change, context) => {
      const db = admin.database();
      const users = db.ref("/userData");

      // Получаем всех пользователей
      users.once("value", (snapshot) => {
      // Получаем каждого пользователя
        snapshot.forEach((childSnapshot) => {
        // Получаем ключ пользователя
          const key = childSnapshot.key;

          const user = db.ref("/userData").child(key);

          user.child("balance").once("value", (snapshot) => {
            const userBalance = snapshot.val();

            const SMSru = require("sms_ru");
            const sms = new SMSru("8d774f95-4e72-cfd4-7579-0404ca9f2df7");

            const ordersRef = functions.firestore
                .document(`wbData/${key}/orders`);
            const orders = ordersRef.get();


            //         orders.filter((order) => order.status == 1 &&
            //         order.userStatus != 1 &&
            //         order.sms_status != 1)
            // .map((order) => order.phone)

            if (orders.filter((order) => order.status == 1 &&
            order.userStatus != 1 &&
            order.sms_status != 1).length > 0) {
              sms.sms_cost({
                to: "80333491645",
                text: "Поступил заказ. Спасибо за заказ!",
              },
              function(e) {
                const balance = e.price * orders.
                    filter((order) => order.status == 1 &&
                    order.userStatus != 1 &&
                    order.sms_status != 1)
                    .map((order) => order.phone).length;
                if (userBalance < balance) {
                  console.log("Пополните Ваш баланс");
                } else {
                  try {
                    db.ref(`userData/${key}`).update({
                      balance: userBalance - balance,
                    });
                    orders.forEach(function(obj) {
                      functions.firestore.document(`wbData/${key}/orders`)
                          .doc(obj.dateCreated).set({
                            dateCreated: obj.dateCreated,
                            sms_status: e.sms_status,
                            price: e.price * orders.
                                filter((order) => order.status == 1 &&
                              order.userStatus != 1 &&
                              order.sms_status != 1).length,
                          }).then(() => {

                          });
                    });
                    // });
                    // });
                  } catch (e) {
                    console.log(e);
                  }
                }
              });
            }
          });
        });
      });
    });

exports.default = functions.firestore
    .document("wbData/{userId}/sms")
    .onUpdate((change, context) => {
      const smsRef = functions.firestore
          .document("wbData/$userId/sms");
      const smsArray = smsRef.get();

      const batch = functions.firestore
          .batch();

      // Нужно получить из firestore данные из коллекции sms

      smsArray.forEach(function(obj) {
        batch.update(functions.firestore
            .document("wbData/{userId}/orders")
            .doc(obj.dateCreated), {
          sms_status: change.before.data()
              .find((s) => s.dateCreated == obj.dateCreated).sms_status,
          price: change.before.data()
              .find((s) => s.dateCreated == obj.dateCreated).price,
        });
      });
      batch.commit().then(function(r) {
        console.log("ok", r);
      })
          .catch((error) => {
            console.log(error);
          });
    });
