Write an application for travel plans

User must be able to create an account and log in. (If a mobile application, this means that more users can use the app from the same phone).
When logged in, a user can see, edit and delete trips he entered.
Implement at least three roles with different permission levels:

- a regular user would only be able to CRUD on their owned records,
- a user manager would be able to CRUD users, and
- an admin would be able to CRUD all records and users.
  When a trip is entered, it has Destination, StartDate, EndDate, Comment.
  When displayed, each entry also has day count to trip start (only for future trips).
  User can filter trips.
  Print travel plan for next month.
  REST API. Make it possible to perform all user actions via the API, including authentication (If a mobile application and you don’t know how to create your own backend you can use Firebase.com or similar services to create the API).
  In any case, you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.
  If it's a web application, it must be a single-page application. All actions need to be done client side using AJAX, refreshing the page is not acceptable. (If a mobile application, disregard this).
  Functional UI/UX design is needed. You are not required to create a unique design, however, do follow best practices to make the project as functional as possible.
