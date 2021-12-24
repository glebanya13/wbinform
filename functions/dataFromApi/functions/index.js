const axios = require("axios");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const db = admin.database();
  const users = db.ref("/userData");

  users.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;

      users.child(key).child("apiToken").once("value", (apikey) => {
        apikey.val().forEach((s) => {
          const d = new Date(s.startDate);
          let month = "" + (d.getMonth() + 1);
          let day = "" + d.getDate();
          const year = d.getFullYear();

          if (month.length < 2) {
            month = "0" + month;
          }
          if (day.length < 2) {
            day = "0" + day;
          }

          const date = [year, month, day].join("-");

          const url = `https://suppliers-api.wildberries.ru/api/v2/orders?date_start=${date}T00%3A00%3A00.365%2B03%3A00&date_end=2022-06-26T12%3A00%3A33.365%2B03%3A00&take=1000&skip=0`;

          axios({
            url: url,
            headers: {
              contentType: "application/json",
              Authorization: s.key,
            },
            method: "get",
          })
            .then((result) => {
              result.data.orders.forEach(function (obj) {
                admin.firestore()
                  .collection(`wbData/${key}/orders/`)
                  .doc(obj.dateCreated).set({
                    dateCreated: obj.dateCreated,
                    orderId: obj.orderId,
                    fio: obj.userInfo.fio,
                    phone: obj.userInfo.phone,
                    status: obj.status,
                    userStatus: obj.userStatus,
                    sms_status: 0,
                    price: 0,
                  }).then(() => {
                    admin.firestore()
                      .collection(`wbData/${key}/orders/`)
                      .doc(obj.dateCreated).update({
                        status: obj.status,
                        userStatus: obj.userStatus,
                      });
                    axios({
                      url: `https://wbxcatalog-ru.wildberries.ru/nm-2-card/catalog?spp=10&pricemarginCoeff=1.0&reg=1&appType=1&offlineBonus=0&onlineBonus=0&emp=0&locale=ru&lang=ru&curr=rub&couponsGeo=2,12,6,7,3,18,21&nm=${obj.orderId}`,
                      headers: {
                        contentType: "application/json",
                      },
                      method: "get",
                    }).
                      then((result) => {
                        console.log(result);
                      })
                  });
              });
            })
            .catch((error) => {
              console.log(error.toJSON());
            });
        });
      });
    });
  });
});

exports.pushDataEveryHour = functions.pubsub.schedule("every 60 minutes")
  .onRun((context) => {
    const db = admin.database();
    const users = db.ref("/userData");

    users.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;

        users.child(key).child("apiToken").once("value", (apikey) => {
          apikey.val().forEach((s) => {
            const d = new Date(s.startDate);
            let month = "" + (d.getMonth() + 1);
            let day = "" + d.getDate();
            const year = d.getFullYear();

            if (month.length < 2) {
              month = "0" + month;
            }
            if (day.length < 2) {
              day = "0" + day;
            }

            const date = [year, month, day].join("-");

            const url = `https://suppliers-api.wildberries.ru/api/v2/orders?date_start=${date}T00%3A00%3A00.365%2B03%3A00&date_end=2022-06-26T12%3A00%3A33.365%2B03%3A00&take=1000&skip=0`;

            axios({
              url: url,
              headers: {
                contentType: "application/json",
                Authorization: s.key,
              },
              method: "get",
            })
              .then((result) => {
                result.data.orders.forEach(function (obj) {
                  admin.firestore()
                    .collection(`wbData/${key}/orders/`)
                    .doc(obj.dateCreated).set({
                      dateCreated: obj.dateCreated,
                      orderId: obj.orderId,
                      fio: obj.userInfo.fio,
                      phone: obj.userInfo.phone,
                      status: obj.status,
                      userStatus: obj.userStatus,
                      sms_status: 0,
                      price: 0,
                    }).then(() => {
                      admin.firestore()
                        .collection(`wbData/${key}/orders/`)
                        .doc(obj.dateCreated).update({
                          status: obj.status,
                          userStatus: obj.userStatus,
                        });
                      axios({
                        url: `https://wbxcatalog-ru.wildberries.ru/nm-2-card/catalog?spp=10&pricemarginCoeff=1.0&reg=1&appType=1&offlineBonus=0&onlineBonus=0&emp=0&locale=ru&lang=ru&curr=rub&couponsGeo=2,12,6,7,3,18,21&nm=${obj.orderId}`,
                        headers: {
                          contentType: "application/json",
                        },
                        method: "get",
                      }).
                        then((result) => {
                          console.log(result);
                        })
                    });
                });
              })
              .catch((error) => {
                console.log(error.toJSON());
              });
          });
        });
      });
    });
  });
