const axios = require("axios");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.pushDataEveryHour = functions.pubsub.schedule("every 1 minutes")
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

              const url64 = `https://suppliers-stats.wildberries.ru/api/v1/supplier/orders?dateFrom=${date}&flag=0&key=${s.key_x64}`;
              const url = `https://suppliers-api.wildberries.ru/api/v2/orders?date_start=${date}T00%3A00%3A00.365%2B03%3A00&date_end=2022-06-26T12%3A00%3A33.365%2B03%3A00&take=1000&skip=0`;

              const brands = [];

              axios({
                url: url,
                headers: {
                  contentType: "application/json",
                  Authorization: s.key,
                },
                method: "get",
              })
                  .then((result) => {
                    result.data.orders.forEach(function(obj) {
                      admin.firestore()
                          .collection(`wbData/${key}/orders/`)
                          .doc(obj.barcode).set({
                            dateCreated: obj.dateCreated,
                            orderId: obj.orderId,
                            fio: obj.userInfo.fio,
                            phone: obj.userInfo.phone,
                            barcode: obj.barcode,
                            status: obj.status,
                            userStatus: obj.userStatus,
                            brand: "",
                            supplierArticle: "",
                            sms_status: 0,
                            price: 0,
                          }).then(() => {
                            admin.firestore()
                                .collection(`wbData/${key}/orders/`)
                                .doc(obj.barcode).update({
                                  status: obj.status,
                                  userStatus: obj.userStatus,
                                });
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                    });
                    axios({
                      url: url64,
                      headers: {
                        contentType: "application/json",
                      },
                      method: "get",
                    })
                        .then((result) => {
                          result.data.forEach(function(obj) {
                            admin.firestore()
                                .collection(`wbData/${key}/brands/`)
                                .doc(obj.barcode).set({
                                  brand: obj.brand,
                                  subject: obj.subject,
                                  category: obj.category,
                                  nmId: obj.nmId,
                                });
                            brands.push(obj);
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                  });
            });
          });
        });
      });
    });
