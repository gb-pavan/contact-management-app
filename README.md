# contact-management-app

*** register user ***

path : http://localhost:3000/auth/register
body:{
    "email": "testten@example.com",
    "password": "pass10"
}

link sent to email

When clicked on link, isVerified column in users  table is set to true


*** login user ***

path : http://localhost:3000/auth/login

body : {
    "email": "testten@example.com",
    "password": "pass10"
}

you will receive the token


*** forgot password ***

path : http://localhost:3000/auth/forgot/forgot-password

body: {
    "email": "testten@example.com"
}

otp sent to gmail


*** reset password ***

path: http://localhost:3000/auth/reset/reset-password

body : {
    "email": "testten@example.com",
    "otp": 992911,
    "newPassword": "passnew"
}

password reset successfully message will come


*** add contact *** 

path: http://localhost:3000/contacts/add-contact

body : {
    "user_mail": "testten@example.com",
    "contact":{
        "name":"dev",
    "email":"dev@example.com",
    "phone":987654321,
    "address":"h no 123, usa",
    "timezone":"america/newyork"
    }
}

message : contact added successfully