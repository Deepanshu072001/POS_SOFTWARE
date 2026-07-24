Login

POST /api/v1/auth/login
{
  "email": "john.doe@gmail.com",
    "password": "Password@123"
}


create 

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@gmail.com",
  "phone": "9876543210",
  "password": "Password@123"
}

create branch 

POST /api/v1/branches
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Main Branch",
  "code": "MAIN",
  "email": "main@cafeflow.com",
  "phone": "9876543210",
  "gstNumber": "07ABCDE1234F1Z5",
  "address": {
    "street": "MG Road",
    "city": "New Delhi",
    "state": "Delhi",
    "country": "India",
    "pincode": "110001"
  },
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "openingTime": "09:00",
  "closingTime": "22:00",
  "timezone": "Asia/Kolkata",
  "currency": "INR"
}

update  branches
PUT /api/v1/branches/:id

{
  "name": "Main Branch Updated",
  "code": "MAIN",
  "email": "updated@cafeflow.com",
  "phone": "9999999999",
  "gstNumber": "07ABCDE1234F1Z5",
  "address": {
    "street": "Connaught Place",
    "city": "New Delhi",
    "state": "Delhi",
    "country": "India",
    "pincode": "110001"
  }
}

Get All
GET /api/v1/branches


Get By ID
GET /api/v1/branches/:id


Update by id
PUT /api/v1/branches/:id
{
  "phone": "9999999999"
}

Change Status
PATCH /api/v1/branches/:id/status
{
  "status": "INACTIVE"
}


Delete
DELETE /api/v1/branches/:id


POST   /api/v1/categories
GET    /api/v1/categories
GET    /api/v1/categories/:id
PUT    /api/v1/categories/:id
PATCH  /api/v1/categories/:id/status
DELETE /api/v1/categories/:id