// const axios = require("axios");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.pushDataEveryHour = functions.pubsub.schedule("every hour")
    .onRun((data, context) => {
      const db = admin.database();
      const users = db.ref("/userData");

      // Получаем всех пользователей
      users.once("value", (snapshot) => {
        // Получаем каждого пользователя
        snapshot.forEach((childSnapshot) => {
          // Получаем ключ пользователя
          const key = childSnapshot.key;

          const user = db.ref("/userData").child(key);

          user.child("apiToken").once("value", (snapshot) => {
            const apiKey = snapshot.val();

            const url = "https://suppliers-api.wildberries.ru/api/v2/orders?date_start=2021-10-29T00%3A00%3A00.365%2B03%3A00&date_end=2022-06-26T12%3A00%3A33.365%2B03%3A00&take=1000&skip=0";
            axios({
              url: url,
              headers: {
                contentType: "application/json",
                Authorization: apiKey,
              },
              method: "get",
            })
                .then((res) => res.json())
                .then((data) => {
                  admin.firestore().collection(`wbData/${key}/orders`)
                      .set(data.orders);
                });
          }).catch(function(error) {
            // Handle error
          });
        });
      });
    });
