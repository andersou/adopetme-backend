const FB = require('fb').default;
const UserDAO = require("../dao/UserDAO")
const User = require("../models/User")

const crypto = require("crypto");
FB.options({ appId: process.env.FACEBOOK_APP_ID, appSecret: process.env.FACEBOOK_APP_SECRET })

//Every permission below requires App Review except for email and public_profile.
function getUser(access_token) {
    return new Promise((resolve, rej) => {
        FB.api('me', { fields: 'id,first_name,last_name,email,picture', access_token }, function (res) {
            console.log(res);
            if (res.error) rej()
            let userDAO = new UserDAO();

            userDAO.findByEmail(res.email).then((user) => {
                resolve(user)
            }).catch(() => {
                let user = User.fromJSON({
                    firstName: res.first_name,
                    lastName: res.last_name,
                    email: res.email,
                    photoUri: res.picture.data.url,
                    document: '00000000000',
                    registerConfirmed: true
                })
                var password = crypto.randomBytes(20).toString('hex');
                user.password = password
                userDAO.insert(user).then(() => {
                    userDAO.findByEmail(res.email).then((user) => {
                        resolve(user)
                    })
                })

            })


        });
    })
}

module.exports = { getUser }

/**
 *
 * {
  id: '',
  first_name: '',
  last_name: '',
  email: '@hotmail.com',
  birthday: '07/14/1994',
  picture: {
    data: {
      height: 50,
      is_silhouette: false,
      url: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3921365007974895&height=50&width=50&ext=1626548786&hash=AeSKoVzhubrgNWuORLk',
      width: 50
    }
  },
  link: 'https://www.facebook.com/app_scoped_user_id/YXNpZADpBWEdQRm0tRUNmY1NnMVhzdUROVnE5T0dtZAnZA0LVZAyLVJ5WkdzNkVCdFVXRktqajNlQjlCVFB0R0o4UHVRNWlId2ZA5UnBaQUhqaWlySV9xYTN6RjZA5R3RxN2hueDEzdXNCSTNKZAzRNZA2FRWFh1VUlVZAncZD/',
  location: { id: '111195672237858', name: 'Pelotas' }
}
 */