# Category Management Project

This project is a Node.js application that provides authentication functionality. It includes user registration, login, and protected routes.

## Installation

1. Clone the repository:
    git clone https://github.com/ShahRaj12/Category_Management_System
2. Navigate to the project directory:
    cd Category_Management_System-main
3. Create env file as given below
    -> Create .env with the following varialbles
        ````
        PORT=9000
        JWT_SECRET=your_jwt_secret_key
        MONGO_URI=mongodb+srv://rs7875483:3332Mongo@cluster0.0wuv0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
        ````
4. Install the dependencies:
    npm install
5. To run the project
    npm run start
6. To run the test cases
    npm test

## API Endpoints (Local)

1. http://localhost:9000/api/auth/register - Register

Body: {
    "name":"John Doe",
    "email":"johndoe@gmail.com",
    "password":"password123"
}

2. http://localhost:9000/api/auth/login - Login - POST
----
Body: {
    "email":"johndoe@gmail.com",
    "password":"password123"
}

3. http://localhost:9000/api/categories - Create Category - POST
Headers: 
Authorization: Bearer <your_token_here>
----
Body: {
    "name":"Samsung",
    "parent":"67aa2c41fc9776b115e37a9d",
    "status":"active"
}

4. http://localhost:9000/api/categories - Get Categories - GET
Headers: 
Authorization: Bearer <your_token_here>

5. http://localhost:9000/api/categories/:id - Update Category - PUT
Headers: 
Authorization: Bearer <your_token_here>
----
Body: {
    "name":"Samsung",
    "parent":"67aa2c41fc9776b115e37a9d",
    "status":"active"
}

6. http://localhost:9000/api/categories/:id - Delete Category - DELETE
Headers: 
Authorization: Bearer <your_token_here>
