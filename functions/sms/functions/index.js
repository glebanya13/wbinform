const SMSru = require("sms_ru");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sms = functions.firestore
  .document("wbData/{uid}/orders/{orderId}")
  .onWrite((change, context) => {
    const db = admin.database();
    const users = db.ref("/userData");

    users.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;

        users.child(key).child("balance").once("value", (snapshot) => {
          const userBalance = snapshot.val();
          const sms = new SMSru("8d774f95-4e72-cfd4-7579-0404ca9f2df7");
          const smsRef = admin.firestore()
            .collection(`wbData/${key}/sms`);
          smsRef.get()
            .then((querySnapshot) => {
              const smss = [];
              querySnapshot.forEach((s) => {
                const data = s.data();
                const sms = {
                  dateCreated: data.dateCreated,
                  sms_status: data.sms_status,
                  price: data.price,
                };
                smss.push(sms);
              });

              const fsResult = admin.firestore()
                .collection(`wbData/${key}/orders/`);
              fsResult.get()
                .then((querySnapshot) => {
                  const orders = [];
                  querySnapshot.forEach((s) => {
                    const data = s.data();
                    const order = {
                      dateCreated: data.dateCreated,
                      orderId: data.orderId,
                      fio: data.fio,
                      phone: data.phone,
                      status: data.status,
                      userStatus: data.userStatus,
                      sms_status: data.sms_status || 0,
                      sms_price: data.price || 0,
                    };
                    orders.push(order);
                  });
                  if (smss.length == 0) {
                    if (orders.filter(
                      (order) => order.status == 1 &&
                        order.userStatus != 1 &&
                        order.sms_status != 1).length > 0) {
                      sms.sms_cost({
                        to: orders.filter(
                          (order) => order.status == 1 &&
                            order.userStatus != 1 &&
                            order.sms_status != 1)
                          .map((order) => order.phone),
                        text: "Поступил заказ. Спасибо за заказ!",
                      },
                        function (e) {
                          const balance = e.price * orders.
                            filter((order) => order.status == 1 &&
                              order.userStatus != 1 &&
                              order.sms_status != 1).length;
                          if (userBalance < balance) {
                            return 0;
                          } else {
                            try {
                              // Отправка
                              db.ref(`userData/${key}`).update({
                                balance: snapshot.val() - balance,
                              });
                              orders.filter(
                                (order) => order.status == 1 &&
                                  order.userStatus != 1 &&
                                  order.sms_status != 1).forEach(function (obj) {
                                    admin.firestore()
                                      .collection(`wbData/${key}/sms/`)
                                      .doc(obj.dateCreated).set({
                                        dateCreated: obj.dateCreated,
                                        sms_status: 1,
                                        price: e.price,
                                      });
                                  });
                            } catch (e) {
                              console.log(e);
                            }
                          }
                        });
                    }
                  } if (smss.length != 0) {
                    smss.forEach((obj) => {
                      const filteredOrders = orders.filter(
                        (order) => order.dateCreated ==
                          obj.dateCreated);
                      const nofilteredOrders = orders.filter(
                        (order) => order.dateCreated !=
                          obj.dateCreated);

                      filteredOrders.forEach((order) => {
                        order.sms_status = obj.sms_status;
                        order.sms_price = obj.price;
                      });

                      if (nofilteredOrders.filter(
                        (order) => order.status == 1 &&
                          order.userStatus != 1).length > 0) {
                        sms.sms_cost({
                          to: nofilteredOrders.filter(
                            (order) => order.status == 1 &&
                              order.userStatus != 1)
                            .map((order) => order.phone),
                          text: "Поступил заказ. Спасибо за заказ!",
                        },
                          function (e) {
                            const balance = e.price * nofilteredOrders.
                              filter((order) => order.status == 1 &&
                                order.userStatus != 1).length;
                            if (userBalance < balance) {
                              return 0;
                            } else {
                              try {
                                db.ref(`userData/${key}`).update({
                                  balance: snapshot.val() - balance,
                                });
                                nofilteredOrders.filter(
                                  (order) => order.status == 1 &&
                                    order.userStatus != 1).forEach(function (obj) {
                                      admin.firestore()
                                        .collection(`wbData/${key}/sms/`)
                                        .doc(obj.dateCreated).set({
                                          dateCreated: obj.dateCreated,
                                          sms_status: 1,
                                          price: e.price,
                                        });
                                    });
                              } catch (e) {
                                console.log(e);
                              }
                            }
                          });
                      }

                      if (nofilteredOrders.filter(
                        (order) => order.status == 1 &&
                          order.userStatus != 1 &&
                          order.sms_status != 1).length > 0) {
                        sms.sms_cost({
                          to: nofilteredOrders.filter(
                            (order) => order.status == 1 &&
                              order.userStatus != 1 &&
                              order.sms_status != 1)
                            .map((order) => order.phone),
                          text: "Поступил заказ. Спасибо за заказ!",
                        },
                          function (e) {
                            const balance = e.price * nofilteredOrders.
                              filter((order) => order.status == 1 &&
                                order.userStatus != 1 &&
                                order.sms_status != 1).length;
                            if (userBalance < balance) {
                              return 0;
                            } else {
                              try {
                                db.ref(`userData/${key}`).update({
                                  balance: snapshot.val() - balance,
                                });
                                nofilteredOrders.filter(
                                  (order) => order.status == 1 &&
                                    order.userStatus != 1 &&
                                    order.sms_status != 1).forEach(function (obj) {
                                      admin.firestore()
                                        .collection(`wbData/${key}/sms/`)
                                        .doc(obj.dateCreated).set({
                                          dateCreated: obj.dateCreated,
                                          sms_status: 1,
                                          price: e.price,
                                        });
                                    });
                              } catch (e) {
                                console.log(e);
                              }
                            }
                          });
                      }

                      if (filteredOrders.filter(
                        (order) => order.status == 1 &&
                          order.userStatus != 1 &&
                          order.sms_status != 1).length > 0) {
                        sms.sms_cost({
                          to: filteredOrders.filter(
                            (order) => order.status == 1 &&
                              order.userStatus != 1 &&
                              order.sms_status != 1)
                            .map((order) => order.phone),
                          text: "Поступил заказ. Спасибо за заказ!",
                        },
                          function (e) {
                            const balance = e.price * filteredOrders.
                              filter((order) => order.status == 1 &&
                                order.userStatus != 1 &&
                                order.sms_status != 1).length;
                            if (userBalance < balance) {
                              return 0;
                            } else {
                              try {
                                db.ref(`userData/${key}`).update({
                                  balance: snapshot.val() - balance,
                                });
                                filteredOrders.filter(
                                  (order) => order.status == 1 &&
                                    order.userStatus != 1 &&
                                    order.sms_status != 1).forEach(function (obj) {
                                      admin.firestore()
                                        .collection(`wbData/${key}/sms/`)
                                        .doc(obj.dateCreated).set({
                                          dateCreated: obj.dateCreated,
                                          sms_status: 1,
                                          price: e.price,
                                        });
                                    });
                              } catch (e) {
                                console.log(e);
                              }
                            }
                          });
                      }
                      if (filteredOrders.filter(
                        (order) => order.status == 2 &&
                          order.userStatus == 2 &&
                          order.sms_status != 2).length > 0) {
                        sms.sms_cost({
                          to: "79261438245",
                          text:
                            "Заказ доставлен. Спасибо что выкупили.",
                        },
                          function (e) {
                            const balance = e.price * filteredOrders.
                              filter((order) => order.status == 2 &&
                                order.userStatus == 2 &&
                                order.sms_status != 2).length;
                            if (userBalance < balance) {
                              return 0;
                            } else {
                              try {
                                db.ref(`userData/${key}`).update({
                                  balance: snapshot.val() - balance,
                                });
                                filteredOrders.filter(
                                  (order) => order.status == 2 &&
                                    order.userStatus == 2 &&
                                    order.sms_status != 2)
                                  .forEach(function (obj) {
                                    admin
                                      .firestore()
                                      .collection(
                                        `wbData/${key}/sms/`
                                      )
                                      .doc(obj.dateCreated)
                                      .set({
                                        dateCreated:
                                          obj.dateCreated,
                                        sms_status: 2,
                                        price: e.price * 2,
                                      });
                                  });
                              } catch (e) {
                                console.log(e);
                              }
                            }
                          });
                      }
                    });
                  }
                });
            });
        });
      });
    });
  });

exports.batch = functions.firestore
  .document("wbData/{uid}/sms/{smsId}")
  .onWrite((change, context) => {

    const batch = admin.firestore().batch();

    const db = admin.database();
    const users = db.ref("/userData");

    users.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;

        const smsRef = admin.firestore()
          .collection(`wbData/${key}/sms`);
        smsRef.get()
          .then((querySnapshot) => {
            const smss = [];
            querySnapshot.forEach((s) => {
              const data = s.data();
              const sms = {
                dateCreated: data.dateCreated,
                sms_status: data.sms_status,
                price: data.price,
              };
              smss.push(sms);
            });
            smss.forEach(function (obj) {
              batch.update(admin.firestore()
                .collection(`wbData/${key}/orders/`)
                .doc(obj.dateCreated), {
                sms_status: obj.sms_status,
                price: obj.price,
              });
              batch.commit().then(function (r) {
                console.log("ok", r);
              })
                .catch((error) => {
                  console.log(error);
                });
            })
          })

      })
    })

    res.json({ result: `Message with ID: ${original} added.` });
  });
