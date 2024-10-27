<!-- # contact-management-app


to run the backend server : node sever.js

I used postman to test the apis

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


*** get contacts filter and sort ***

path : http://localhost:3000/contacts/get-contacts

body : {
    "user_mail": "testone@example.com",
    "filters": {
        "name": "John Doe7",
        "timezone":"America/New_York22"
    },
    "sort": {
        "field": "created_at",
        "order": "desc"
    }
}

*** update contact ***

path : http://localhost:3000/contacts/update-contact

body : {
    "user_mail": "testone@example.com",
   "contactId": 13,
   "updates":{
    "name": "John Doe13"
   }
}
 
we can update any number of available columns.Its optional.

*** delete contact ***

path : http://localhost:3000/contacts/delete-contact

body : {
    "user_mail": "testone@example.com",
   "contactId": 13
   
}

*** download contacts file in .csv ***

path : http://localhost:3000/contacts/download

body : {
    "user_mail": "testone@example.com"
   
}

*** batch update contacts *** 

path : http://localhost:3000/contacts/batch-update-contacts

body : {
    "user_mail": "testone@example.com",
    "contacts" : [
    {
        "name": "Dev",
        "email": "dev2@example.com",
        "phone": 987654321,
        "address": "H No 123, USA",
        "timezone": "America/New_York"
    },
    {
        "name": "Sam",
        "email": "sam@example.com",
        "phone": 123456789,
        "address": "H No 456, Canada",
        "timezone": "America/Toronto"
    },
    {
        "name": "Alex",
        "email": "alex@example.com",
        "phone": 555123456,
        "address": "123 Main St, UK",
        "timezone": "Europe/London"
    },
    {
        "name": "Maria",
        "email": "maria@example.com",
        "phone": 789123456,
        "address": "Apt 4, Mexico City, Mexico",
        "timezone": "America/Mexico_City"
    },
    {
        "name": "Lee",
        "email": "lee@example.com",
        "phone": 321654987,
        "address": "101 Seoul St, South Korea",
        "timezone": "Asia/Seoul"
    }
]

   
}


*** upload contacts file .csv or excel sheet *** 

path : http://localhost:3000/contacts/upload

body : {
    "user_mail": "testone@example.com"
   
}

upload file in postman: file in req.file -->


Certainly! Here’s the `README.md` written in your direct style, retaining your original approach but expanded to include the additional information.

---

# Contact Management App

## Overview

This is a backend application for managing user contacts. It includes registration, login, and various contact management features like adding, updating, deleting, and batch updating contacts. The application is tested using Postman.

## Getting Started

### Prerequisites

- Ensure you have Node.js installed.

### Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the backend server:
   ```bash
   node server.js
   ```

---

## API Endpoints

### **User Registration**

- **Path**: `http://localhost:3000/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "email": "testten@example.com",
      "password": "pass10"
  }
  ```
- A verification link is sent to the registered email. Clicking the link sets `isVerified` to true in the users table.

### **User Login**

- **Path**: `http://localhost:3000/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "email": "testten@example.com",
      "password": "pass10"
  }
  ```
- Returns an authorization token.

### **Forgot Password**

- **Path**: `http://localhost:3000/auth/forgot/forgot-password`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "email": "testten@example.com"
  }
  ```
- Sends an OTP to the registered email for password reset.

### **Reset Password**

- **Path**: `http://localhost:3000/auth/reset/reset-password`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "email": "testten@example.com",
      "otp": 992911,
      "newPassword": "passnew"
  }
  ```
- Returns a success message after updating the password.

---

### **Add Contact**

- **Path**: `http://localhost:3000/contacts/add-contact`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "user_mail": "testten@example.com",
      "contact": {
          "name": "dev",
          "email": "dev@example.com",
          "phone": 987654321,
          "address": "h no 123, usa",
          "timezone": "america/newyork"
      }
  }
  ```
- Adds a contact to the specified user's account.

### **Get Contacts with Filter and Sort**

- **Path**: `http://localhost:3000/contacts/get-contacts`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "user_mail": "testone@example.com",
      "filters": {
          "name": "John Doe7",
          "timezone": "America/New_York22"
      },
      "sort": {
          "field": "created_at",
          "order": "desc"
      }
  }
  ```
- Fetches contacts based on provided filter and sort options.

### **Update Contact**

- **Path**: `http://localhost:3000/contacts/update-contact`
- **Method**: `PUT`
- **Body**:
  ```json
  {
      "user_mail": "testone@example.com",
      "contactId": 13,
      "updates": {
          "name": "John Doe13"
      }
  }
  ```
- Updates contact details in the database.

### **Delete Contact**

- **Path**: `http://localhost:3000/contacts/delete-contact`
- **Method**: `DELETE`
- **Body**:
  ```json
  {
      "user_mail": "testone@example.com",
      "contactId": 13
  }
  ```
- Deletes the specified contact from the database.

### **Download Contacts as CSV**

- **Path**: `http://localhost:3000/contacts/download`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "user_mail": "testone@example.com"
  }
  ```
- Returns a `.csv` file of the user's contacts.

### **Batch Update Contacts**

- **Path**: `http://localhost:3000/contacts/batch-update-contacts`
- **Method**: `PUT`
- **Body**:
  ```json
  {
      "user_mail": "testone@example.com",
      "contacts": [
          {
              "name": "Dev",
              "email": "dev2@example.com",
              "phone": 987654321,
              "address": "H No 123, USA",
              "timezone": "America/New_York"
          },
          {
              "name": "Sam",
              "email": "sam@example.com",
              "phone": 123456789,
              "address": "H No 456, Canada",
              "timezone": "America/Toronto"
          }
      ]
  }
  ```
- Updates multiple contacts at once.

### **Upload Contacts via CSV or Excel**

- **Path**: `http://localhost:3000/contacts/upload`
- **Method**: `POST`
- **Body**:
  ```json
  {
      "user_mail": "testone@example.com"
  }
  ```
- Uploads a `.csv` or `.xls` file of contacts. Use `req.file` in Postman for the file.

---

## Database Information

The application uses a `users` table and a `contacts` table to store data:

- **Users Table**: Contains `id`, `email`, `password`, and `isVerified` fields.
- **Contacts Table**: Contains `id`, `user_mail` (foreign key), `name`, `email`, `phone`, `address`, `timezone`, `created_at`, `updated_at`, `is_deleted` fields.

### Migrations

Set up the database migrations using a tool like Sequelize or Knex.js. Configure your database connection settings in the `.env` file.


