const SMSru = require("sms_ru");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addMessage = functions.https.onRequest((req, res) => {
  const original = req.query.text;

  const db = admin.database();
  const users = db.ref("/userData");

  users.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;

      if (key) {

        users.child(key).child("methods").once("value", (methods) => {

          if (methods) {
            users.child(key).child("balance").once("value", (balance) => {
              const userBalance = balance.val();
              const sms = new SMSru("8d774f95-4e72-cfd4-7579-0404ca9f2df7");

              methods.val().filter((method) => method.start == true && method.name == "Стартовое уведомление" && method.methods).filter((method) => method.methods.filter((method => method == 0))).forEach((method) => {
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

                          var name = "{ИМЯ}";
                          var surname = "{ФАМИЛИЯ}";
                          var dateCreated = "{ДАТА ЗАКАЗА}";
                          var orderId = "{НОМЕР ЗАКАЗА}";
                          var article = "{АРТИКУЛ ТОВАРА}";
                          var url = "{ССЫЛКА}";
                          var price = "{ЦЕНА ТОВАРА}";
                          var brand = "{БРЕНД}";

                          var replaceName = order.fio;
                          var replaceSurname = "Иванов";
                          var replaceDateCreated = order.dateCreated;
                          var replaceOrderId = order.orderId;
                          var replaceArticle = "24047618";
                          var replaceUrl =
                            "https://www.wildberries.ru/catalog/" +
                            replaceArticle +
                            "/detail.aspx?targetUrl=ST";
                          var replacePrice = "1000";
                          var replaceBrand = "АГРОФИРМА ПАРТНЕР";

                          var text = method.message

                          var regName = new RegExp(name, "gi");
                          text = text.replace(regName, replaceName);

                          var regSurname = new RegExp(surname, "gi");
                          text = text.replace(regSurname, replaceSurname);

                          var regDateCreated = new RegExp(dateCreated, "gi");
                          text = text.replace(regDateCreated, replaceDateCreated);

                          var regOrderId = new RegExp(orderId, "gi");
                          text = text.replace(regOrderId, replaceOrderId);

                          var regArticle = new RegExp(article, "gi");
                          text = text.replace(regArticle, replaceArticle);

                          var regUrl = new RegExp(url, "gi");
                          text = text.replace(regUrl, replaceUrl);

                          var regPrice = new RegExp(price, "gi");
                          text = text.replace(regPrice, replacePrice);

                          var regBrand = new RegExp(brand, "gi");
                          text = text.replace(regBrand, replaceBrand);


                          let status = orders.filter(
                            (order) => order.status == 1 &&
                              order.userStatus != 1 &&
                              order.sms_status != 1
                              && order.dateCreated !=
                              smss.map((s) => s.dateCreated))
                          if (status.length > 0) {
                            sms.sms_cost({
                              to: status
                                .map((order) => order.phone),
                              text: text,
                            },
                              function (e) {
                                const balance = e.price * status
                                  .length;
                                if (userBalance < balance) {
                                  return 0;
                                } else {
                                  try {
                                    // Отправка
                                    db.ref(`userData/${key}`).update({
                                      balance: userBalance - balance,
                                    });
                                    status.forEach(function (obj) {
                                      admin.firestore()
                                        .collection(`wbData/${key}/sms/`)
                                        .doc(obj.dateCreated).set({
                                          dateCreated: obj.dateCreated,
                                          sms_status: 1,
                                          price: e.price / status.length,
                                          message: text
                                        });
                                    });
                                  } catch (e) {
                                    console.log(e);
                                  }
                                }
                              });
                          }
                        })
                      })
                  })
              })
              methods.val().filter((method) => method.start == true && method.name == "Уведомление о получении товара клиентом с ПВЗ" && method.methods).filter((method) => method.methods.filter((method => method == 0))).forEach((method) => {
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

                          var name = "{ИМЯ}";
                          var surname = "{ФАМИЛИЯ}";
                          var dateCreated = "{ДАТА ЗАКАЗА}";
                          var orderId = "{НОМЕР ЗАКАЗА}";
                          var article = "{АРТИКУЛ ТОВАРА}";
                          var url = "{ССЫЛКА}";
                          var price = "{ЦЕНА ТОВАРА}";
                          var brand = "{БРЕНД}";

                          var replaceName = order.fio;
                          var replaceSurname = "Иванов";
                          var replaceDateCreated = order.dateCreated;
                          var replaceOrderId = order.orderId;
                          var replaceArticle = "24047618";
                          var replaceUrl =
                            "https://www.wildberries.ru/catalog/" +
                            replaceArticle +
                            "/detail.aspx?targetUrl=ST";
                          var replacePrice = "1000";
                          var replaceBrand = "АГРОФИРМА ПАРТНЕР";

                          var text = method.message

                          var regName = new RegExp(name, "gi");
                          text = text.replace(regName, replaceName);

                          var regSurname = new RegExp(surname, "gi");
                          text = text.replace(regSurname, replaceSurname);

                          var regDateCreated = new RegExp(dateCreated, "gi");
                          text = text.replace(regDateCreated, replaceDateCreated);

                          var regOrderId = new RegExp(orderId, "gi");
                          text = text.replace(regOrderId, replaceOrderId);

                          var regArticle = new RegExp(article, "gi");
                          text = text.replace(regArticle, replaceArticle);

                          var regUrl = new RegExp(url, "gi");
                          text = text.replace(regUrl, replaceUrl);

                          var regPrice = new RegExp(price, "gi");
                          text = text.replace(regPrice, replacePrice);

                          var regBrand = new RegExp(brand, "gi");
                          text = text.replace(regBrand, replaceBrand);


                          let status = orders.filter(
                            (order) => order.userStatus == 2
                              && order.dateCreated !=
                              smss.map((s) => s.dateCreated))
                          if (status.length > 0) {
                            sms.sms_cost({
                              to: status
                                .map((order) => order.phone),
                              text: text,
                            },
                              function (e) {
                                const balance = e.price * status
                                  .length;
                                if (userBalance < balance) {
                                  return 0;
                                } else {
                                  try {
                                    // Отправка
                                    db.ref(`userData/${key}`).update({
                                      balance: userBalance - balance,
                                    });
                                    status.forEach(function (obj) {
                                      admin.firestore()
                                        .collection(`wbData/${key}/sms/`)
                                        .doc(obj.dateCreated).set({
                                          dateCreated: obj.dateCreated,
                                          sms_status: 1,
                                          price: e.price / status.length,
                                          message: text
                                        });
                                    });
                                  } catch (e) {
                                    console.log(e);
                                  }
                                }
                              });
                          }
                        })
                      })
                  })
              })
              methods.val().filter((method) => method.start == true && method.name == "Напоминание при несвоевременном получении товара с ПВЗ" && method.methods).filter((method) => method.methods.filter((method => method == 0))).forEach((method) => {
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

                          var name = "{ИМЯ}";
                          var surname = "{ФАМИЛИЯ}";
                          var dateCreated = "{ДАТА ЗАКАЗА}";
                          var orderId = "{НОМЕР ЗАКАЗА}";
                          var article = "{АРТИКУЛ ТОВАРА}";
                          var url = "{ССЫЛКА}";
                          var price = "{ЦЕНА ТОВАРА}";
                          var brand = "{БРЕНД}";

                          var replaceName = order.fio;
                          var replaceSurname = "Иванов";
                          var replaceDateCreated = order.dateCreated;
                          var replaceOrderId = order.orderId;
                          var replaceArticle = "24047618";
                          var replaceUrl =
                            "https://www.wildberries.ru/catalog/" +
                            replaceArticle +
                            "/detail.aspx?targetUrl=ST";
                          var replacePrice = "1000";
                          var replaceBrand = "АГРОФИРМА ПАРТНЕР";

                          var text = method.message

                          var regName = new RegExp(name, "gi");
                          text = text.replace(regName, replaceName);

                          var regSurname = new RegExp(surname, "gi");
                          text = text.replace(regSurname, replaceSurname);

                          var regDateCreated = new RegExp(dateCreated, "gi");
                          text = text.replace(regDateCreated, replaceDateCreated);

                          var regOrderId = new RegExp(orderId, "gi");
                          text = text.replace(regOrderId, replaceOrderId);

                          var regArticle = new RegExp(article, "gi");
                          text = text.replace(regArticle, replaceArticle);

                          var regUrl = new RegExp(url, "gi");
                          text = text.replace(regUrl, replaceUrl);

                          var regPrice = new RegExp(price, "gi");
                          text = text.replace(regPrice, replacePrice);

                          var regBrand = new RegExp(brand, "gi");
                          text = text.replace(regBrand, replaceBrand);
                          
                          smss.forEach((obj) => {
                            const filteredOrders = orders.filter(
                              (order) => order.dateCreated !=
                                obj.dateCreated);

                          let status = filteredOrders.filter(
                            (order) => order.userStatus == 4
                              && order.status == 2)
                          if (status.length > 0) {
                            sms.sms_cost({
                              to: status
                                .map((order) => order.phone),
                              text: text,
                            },
                              function (e) {
                                const balance = e.price * status
                                  .length;
                                if (userBalance < balance) {
                                  return 0;
                                } else {
                                  try {
                                    // Отправка
                                    db.ref(`userData/${key}`).update({
                                      balance: userBalance - balance,
                                    });
                                    status.forEach(function (obj) {
                                      admin.firestore()
                                        .collection(`wbData/${key}/sms/`)
                                        .doc(obj.dateCreated).set({
                                          dateCreated: obj.dateCreated,
                                          sms_status: 1,
                                          price: e.price / status.length,
                                          message: text
                                        });
                                    });
                                  } catch (e) {
                                    console.log(e);
                                  }
                                }
                              });
                          }
                        })
                      })
                  })
                })
              })
              methods.val().filter((method) => method.start == true && method.name == "Уведомление об отказе клиентом" && method.methods).filter((method) => method.methods.filter((method => method == 0))).forEach((method) => {
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

                          var name = "{ИМЯ}";
                          var surname = "{ФАМИЛИЯ}";
                          var dateCreated = "{ДАТА ЗАКАЗА}";
                          var orderId = "{НОМЕР ЗАКАЗА}";
                          var article = "{АРТИКУЛ ТОВАРА}";
                          var url = "{ССЫЛКА}";
                          var price = "{ЦЕНА ТОВАРА}";
                          var brand = "{БРЕНД}";

                          var replaceName = order.fio;
                          var replaceSurname = "Иванов";
                          var replaceDateCreated = order.dateCreated;
                          var replaceOrderId = order.orderId;
                          var replaceArticle = "24047618";
                          var replaceUrl =
                            "https://www.wildberries.ru/catalog/" +
                            replaceArticle +
                            "/detail.aspx?targetUrl=ST";
                          var replacePrice = "1000";
                          var replaceBrand = "АГРОФИРМА ПАРТНЕР";

                          var text = method.message

                          var regName = new RegExp(name, "gi");
                          text = text.replace(regName, replaceName);

                          var regSurname = new RegExp(surname, "gi");
                          text = text.replace(regSurname, replaceSurname);

                          var regDateCreated = new RegExp(dateCreated, "gi");
                          text = text.replace(regDateCreated, replaceDateCreated);

                          var regOrderId = new RegExp(orderId, "gi");
                          text = text.replace(regOrderId, replaceOrderId);

                          var regArticle = new RegExp(article, "gi");
                          text = text.replace(regArticle, replaceArticle);

                          var regUrl = new RegExp(url, "gi");
                          text = text.replace(regUrl, replaceUrl);

                          var regPrice = new RegExp(price, "gi");
                          text = text.replace(regPrice, replacePrice);

                          var regBrand = new RegExp(brand, "gi");
                          text = text.replace(regBrand, replaceBrand);


                          let status = orders.filter(
                            (order) => order.userStatus == 3
                              && order.dateCreated ))
                          if (status.length > 0) {
                            sms.sms_cost({
                              to: status
                                .map((order) => order.phone),
                              text: text,
                            },
                              function (e) {
                                const balance = e.price * status
                                  .length;
                                if (userBalance < balance) {
                                  return 0;
                                } else {
                                  try {
                                    // Отправка
                                    db.ref(`userData/${key}`).update({
                                      balance: userBalance - balance,
                                    });
                                    status.forEach(function (obj) {
                                      admin.firestore()
                                        .collection(`wbData/${key}/sms/`)
                                        .doc(obj.dateCreated).set({
                                          dateCreated: obj.dateCreated,
                                          sms_status: 1,
                                          price: e.price / status.length,
                                          message: text
                                        });
                                    });
                                  } catch (e) {
                                    console.log(e);
                                  }
                                }
                              });
                          }
                        })
                      })
                  })
              })
            });

          }
        });
      }
    });
  });

  res.json({ result: `Message with ID: ${original} added.` });
});
