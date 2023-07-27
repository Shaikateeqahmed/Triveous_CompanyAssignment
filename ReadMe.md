### Following Are The Request Related To Users

## Request for Register A User

> POST /user/signup

- if User Provides Name, Email, Password, Phone_NO then server will Store the data after Bcrypt the password.

- user will get the following response
   - 200 as Response, if user got register successfully.
   - 400 as Response, if user not fills all the fields for registration.
   - 409 as Response, if user already registered.
   - 500 as Response, if server not response.


## Request for Login A User

> POST /user/login

- if User Provides  Email, Password then server will Check the data and Provides a Token.

- User will get the following response
   - 200 as Response, if user got Login successfully.
   - 400 as Response, if user not fills all the fields for Login or user not provide the correct password.
   - 404 as Response, if user not signup before login.
   - 500 as Response, if server not response.


### Following Are The Request Related To Category

## Request for creating a Category

> POST /category

- if Admin provides a CategoryName, Active status then serve will store the data.

- Admin will get the following response
   - 200 as Response, if admin post category successfully.
   - 400 as Response, if admin not fills all the fields for creation of category.
   - 409 as Response, if Category already exist in collection of category.
   - 500 as Response, if server not response.


## Request for getting a list of Categories.

> GET /category

 - Both Admin and Customer can Access the List of a Category.

 - User will get the following response
    - 200 as Response, get a list of categories.
    - 500 as Response, if server not response.


## Request for Updating a Category By ID.

> PATCH /category

- if Admin provides a ID of a category in params, then server will get that caterogy by ID and Update.

- Admin will get the following response
   - 200 as Response, if Category Updated successfully.
   - 409 as Response, if Category with that ID not exist.
   - 500 as Response, if server not response.


## Request for Deleting a Category By ID.

> DELETE /category

- if Admin provides a ID of a category in params, then server will get that caterogy by ID and Delete.

- Admin will get the following response
   - 200 as Response, if Category Delete successfully.
   - 409 as Response, if Category with that ID not exist.
   - 500 as Response, if server not response.


### Following Are The Request Related To Products

## Request for creating a Product

> POST /product

- if Admin provides a Title, Price, Description, Availability, CategoryID then serve will store the data.

- Admin will get the following response
   - 200 as Response, if admin post product successfully.
   - 400 as Response, if admin not fills all the fields for creation of product.
   - 500 as Response, if server not response.


## Request for getting a list of Products

> GET /product

 - Both Admin and Customer can Access the List of a product.

 - User will get the following response
    - 200 as Response, get a list of product.
    - 500 as Response, if server not response.


## Request for getting a Details of a Products By ID

> GET /product/:id

 - Both Admin and Customer can Access the details of a product by providing a id of a product.

 - User will get the following response
    - 200 as Response, get a details of product.
    - 500 as Response, if server not response.


## Request for Updating a product By ID.

> PATCH /product

- if Admin provides a ID of a product in params, then server will get that product by ID and Update the availability of a product.

- Admin will get the following response
   - 200 as Response, if product Updated successfully.
   - 409 as Response, if product with that ID not exist.
   - 500 as Response, if server not response.


## Request for Deleting a product By ID.

> DELETE /product

- if Admin provides a ID of a product in params, then server will get that product by ID and Delete.

- Admin will get the following response
   - 200 as Response, if product Delete successfully.
   - 409 as Response, if product with that ID not exist.
   - 500 as Response, if server not response.


### Following Are The Request Related To Cart

## Request for Adding a product to Cart

> POST /cart

- if user provides a ProductID, Quantity, Price then serve will store the data.

- User will get the following response
   - 200 as Response, if user added the product to cart successfully.
   - 400 as Response, if user not fills all the fields for adding a prodct to acrt.
   - 500 as Response, if server not response.


## Request for getting a list of Products in cart.

> GET /cart

 - User can Access the List of a product in cart.

 - User will get the following response
    - 200 as Response, get a list of product in cart.
    - 500 as Response, if server not response.


## Request for Updating a Quantity of a product in cart By ID.

> PATCH /cart

- if user provides a ID of a cart in params, then server will get that cart by ID and Update the Quantity of a cart.

- Admin will get the following response
   - 200 as Response, if Quantity Updated successfully.
   - 401 as Response, if user is not a authorised user.
   - 409 as Response, if cart with that ID not exist.
   - 500 as Response, if server not response.


## Request for Deleting a Cart By ID.

> DELETE /cart

- if user provides a ID of a cart in params, then server will get that cart by ID and Delete the cart.

- Admin will get the following response
   - 200 as Response, if Cart Delete successfully.
   - 401 as Response, if user is not a authorised user.
   - 409 as Response, if Cart with that ID not exist.
   - 500 as Response, if server not response.


### Following Are The Request Related To Orders

## Request for creating a order

> GET /order/:id

- if user provides a CartID in params then server will store the data in orders collection.

- User will get the following response
   - 200 as Response, if User placed a Order successfully.
   - 409 as Response, if CartID is not exist in collection of Cart.
   - 500 as Response, if server not response.


## Request for getting a History of Orders.

> GET /order

 - User can Access the history of order.

 - User will get the following response
    - 200 as Response, get a History of order.
    - 409 as Response, if user not order anything.
    - 500 as Response, if server not response.


## Request for getting a Details of a Order by ID.

> GET /order

 - User can Access the details of a order by providing a ID in params.

 - User will get the following response
    - 200 as Response, get a details of a order.
    - 409 as Response, if order with the ID not exist.
    - 500 as Response, if server not response.


## Request for Deleting a Order By ID.

> DELETE /order

- if user provides a ID of a order in params, then server will get that order by ID and Delete.

- user will get the following response
   - 200 as Response, if order Delete successfully.
   - 409 as Response, if order with that ID not exist.
   - 500 as Response, if server not response.


====================================================================================================================================

Link of a Swagger Documentation: http://localhost:3000/api-docs/#/

Link of a Presentation vedio: https://drive.google.com/file/d/1TMLsE9BRalfzJoe8Z-Dq-s9UFurj7CJO/view?usp=sharing