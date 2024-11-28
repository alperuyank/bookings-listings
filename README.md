# Booking and Review System

## Project Description
This project is a system that allows users to reserve accommodations, leave reviews,
and administrators to generate reports. The backend uses MongoDB for database management
and Express.js to create a RESTful API. The system manages core collections like Users,
Listings, Bookings, Reviews, and Admin Reports.

## Features

### Users:
- Can register, log in.
- Can search for and book accommodations, as well as leave reviews for their bookings.

### Administrators:
- Can generate reports on listings filtered by city and country.

### Listings:
- Users can add new listings.

### Bookings:
- Users can add new bookings.

## Technologies
- **MongoDB**: Database management
- **Node.js**: Server-side runtime
- **Express.js**: API framework
- **Mongoose**: ODM (Object Data Modeling) for MongoDB interaction
- **JWT (JSON Web Tokens)**: Used for user authentication

## Database Design
The project uses a MongoDB database with the following collections:
- **Users**: User information (name, email, password, role, etc.)
- **Listings**: Information about accommodations (title, description, price, etc.)
- **Bookings**: User reservations (which user reserved which listing, for what dates, etc.)
- **Reviews**: User reviews (rating, comment, etc.)
- **AdminReports**: Reports generated for administrators (filtered listings by city/country)

## API Endpoints

### Auth (User Management)
- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: User login

### Listings (Accommodations)
- `GET /api/v1/listings/list`: Get all listings
- `GET /api/v1/listings/list/:id`: Get a specific listing by ID
- `POST /api/v1/listings/list`: Add a new listing (authentication required)

### Bookings (Reservations)
- `POST /api/v1/bookings/book`: Create a new booking (authentication required)
- `GET /api/v1/bookings/book/:bookingId`: Get details of a booking (authentication required)

### Reviews (User Reviews)
- `POST /api/v1/reviews/review`: Post a review (authentication required)

### Admin Reports (Administrator Reports)
- `GET /api/v1/admin/reports/listings`: Get listing reports (only admin)

## Installation Instructions

### Requirements
- Node.js (v14.x or newer)
- MongoDB (can be local or use MongoDB Atlas)
  
```
1. Clone the Repository
git clone https://github.com/alperuyank/Booking-and-Listing-API.git

2. Install Dependencies
cd Booking-and-Listing-API
npm install

3. MongoDB Connection
To connect to the MongoDB database, set the following in your .env file:
MONGO_URI=mongodb://localhost:27017/your-database-name

Alternatively, if you're using MongoDB Atlas, get the connection string from MongoDB Atlas and place it in your .env file.

4. Run the Project
npm start

5. Access the Server
The server will be running at http://localhost:5000 and you can access the API documentation via Swagger UI:
http://localhost:5000/api-docs/

ER Diagram
Below is an overview of the relationships in the database:

Users → Listings: One user can create multiple listings (1:N relationship).
Listings → Bookings: One listing can have multiple bookings (1:N relationship).
Users → Bookings: One user can make multiple bookings (1:N relationship).
Bookings → Reviews: A booking can have multiple reviews (1:N relationship).
Listings → Reviews: A listing can have multiple reviews (1:N relationship).

+----------------+     1    +-----------------+    N      +------------------+
|    Users      | <-------- |     Listings    | <-------- |     Bookings     |
+----------------+          +-----------------+           +------------------+
| id (PK)       |           | id (PK)         |           | id (PK)          |
| name          |           | host_id (FK)    |           | guest_id (FK)    |
| email         |           | title           |           | listing_id (FK)  |
| password      |           | description     |           | from             |
| role          |           | country         |           | to               |
| created_at    |           | city            |           | names_of_people  |
+----------------+          | price           |           | status           |
                            | availability    |           | created_at       |
                            | booked_by (FK)  |           +------------------+
                            +-----------------+
                                   |
                                   |
                                   v
                            +------------------+
                            |     Reviews      |
                            +------------------+
                            | id (PK)          |
                            | booking_id (FK)  |
                            | user_id (FK)     |
                            | listing_id (FK)  |
                            | rating           |
                            | comment          |
                            | created_at       |
                            +------------------+


Contributing
If you'd like to contribute to this project, please follow these steps:

Fork the repository.
Create a new branch: git checkout -b new-feature
Make changes and commit: git commit -am 'Added new feature'
Push changes to your fork: git push origin new-feature
Submit a pull request.

License
This project is licensed under the MIT License.
