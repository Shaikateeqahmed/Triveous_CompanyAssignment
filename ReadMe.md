### Request for Register A User

> Post /user/signup

- if User Provides Name, Email, Password, Phone_NO then server will Store the data after Bcrypt the password.

- user will get the following response
   - 200 as Response, if user got register successfully.
   - 500 as Response, if server not response.
   - 400 as Response, if user not fills all the fields for registration.
   - 409 as Response, if user already registered.
