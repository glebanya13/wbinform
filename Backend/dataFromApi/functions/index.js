const axios = require("axios");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.setBrands = functions.firestore
    .document("wbData/{uid}/orders/{orderId}")
    .onWrite((change, context) => {
      const db = admin.database();
      const users = db.ref("/userData");

      users.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;

          users.child(key).child("apiToken").once("value", (apiToken) => {
            apiToken.val().forEach((s) => {
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

              const url = `https://suppliers-stats.wildberries.ru/api/v1/supplier/orders?dateFrom=${date}&flag=0&key=${s.key_x64}`;

              axios({
                url: url,
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
                            barcode: obj.barcode,
                            brand: obj.brand,
                            subject: obj.subject,
                            category: obj.category,
                            nmId: obj.nmId,
                          }).then(() => {
                            admin.firestore()
                                .collection(`wbData/${key}/orders/`)
                                .doc(obj.barcode).update({
                                  brand: obj.brand,
                                  nmId: obj.nmId,
                                });
                          });
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

exports.setBrandsOrders = functions.firestore
    .document("wbData/{uid}/brands/{brandId}")
    .onWrite((change, context) => {
      const db = admin.database();
      const users = db.ref("/userData");
      const batch = admin.firestore().batch();
      users.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;

          const brandsRef = admin.firestore()
              .collection(`wbData/${key}/brands`);
          brandsRef.get()
              .then((querySnapshot) => {
                const brands = [];
                querySnapshot.forEach((s) => {
                  const data = s.data();
                  const brand = {
                    barcode: data.barcode,
                    brand: data.brand,
                    subject: data.subject,
                    category: data.category,
                    nmId: data.nmId,
                  };
                  brands.push(brand);
                });
                brands.forEach(function(obj) {
                  batch.update(admin.firestore()
                      .collection(`wbData/${key}/orders/`)
                      .doc(obj.barcode), {
                    brand: obj.brand,
                    nmId: obj.nmId,
                  });
                  batch.commit().then(function(r) {
                    console.log("ok", r);
                  })
                      .catch((error) => {
                        console.log(error);
                      });
                });
              });
        });
      });
    });

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

              const url = `https://suppliers-api.wildberries.ru/api/v2/orders?date_start=${date}T00%3A00%3A00.365%2B03%3A00&date_end=2022-06-26T12%3A00%3A33.365%2B03%3A00&take=1000&skip=0`;
              const url64 = `https://suppliers-stats.wildberries.ru/api/v1/supplier/orders?dateFrom=${date}&flag=0&key=${s.key_x64}`;

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
