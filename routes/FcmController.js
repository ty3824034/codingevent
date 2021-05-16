var request = require("request");

module.exports = {
  sendFcmNotification: async function (fcmId, notification) {
    // this is to send fcm notification, start here
    var optionsFcm = {
      url: "https://fcm.googleapis.com/fcm/send",
      method: "POST",
      headers: {
        "User-Agent": "Super Agent/0.0.1",
        "Content-Type": "application/json",
        Authorization:
          "key=AAAA-CpI60c:APA91bFq8zZtODp3qZ4mSdb_6f2o1MYBiQuGKYvmaR2Z5Iet96rRvpyTKKpf0Gurq894YIVcmrjMIfYMTG-7eU8a8PtXz-6CeJklx8vNcFewxDC1ryK9JBiIgGvZLKcgYBwNaBl4XPsX",
      },
      body: JSON.stringify({
        notification: {
          // icon:
          //   "https://ovaltine.s3.ap-south-1.amazonaws.com/LOGO_Ovantine-compressed.jpg",
          title: notification.title,
          body: notification.body,
          // id: Math.floor(Math.random() * 100 + 1),
        },
        data: {
          type: notification.type,
        },
        to: fcmId,
      }),
    };

    request(optionsFcm, function (error, response, body) {
      console.log(body)
      if (error) {
        console.log(error)
      } else {
        if (response.statusCode == 200) {
          console.log("FCM triggered")
        } else {
          console.log(response.statusCode)
        }
      }
    });
    // end here
  },
};
