# AUTHENTICATION

## Creating an account

There are 3 usercases that can create accounts on the legalMo platform. The admin, a lawyer and a company. And all three accounts have different signup requirements hence diferent endpoints.

1. **To create an admin account, you can make a POST request to the /api/admin/signup endpoint. The request body should contain the following information:**

- name (string): The name of the Admin user.
- officialEmail (string): The email of the Admin user.
- phoneNumber (string): The phonenumber of the Admin user.
- password (string): A desired password for the Admin account.
- passwordConfirm (string): To confirm the password entered earlier.

2. **To create a company account, you can make a POST request to the /api/company/signup endpoint. The request body should contain the following information:**

- name (string): The name of the company to be registered.
- contactName (string): The name of a person from the company that speeaks for the company.
- officialEmail (string): The email of the company.
- phoneNumber (string): contact phonenumber of the company.
- officeAddress (string): contact physical address of the company.
- cacRegNo (string): CAC registration number of the company.
- industry (string): the industry the company belongs to.
- password (string): A desired password for the Admin account.
- passwordConfirm (string): To confirm the password entered earlier.

3. **To create a lawyer account, you can make a POST request to the /api/lawyer/signup endpoint. The request body should contain the following information:**

- name (string): The name of the lawyer.
- officialEmail (string): The email of the lawyer.
- phoneNumber (string): The phonenumber of the lawyer.
- areasOfPractise (string): The list of areas of practice of the lawyer.
- scn (string): The supreme court enrolment number of the lawyer.
- cacAccNo (string): The CAC accreditation number of the lawyer.
- lawFirmName (string): The name of the law firm the lawyer works.
- lawFirmAddress (string): The physical address of the lawfirm the lawyer works.
- password (string): A desired password for the Admin account.
- passwordConfirm (string): To confirm the password entered earlier.

(On registering on the app, an email is sent to the email address provided for verification and confrimation).

The response to these will be a JSON object with the following information:

- status (string): The status of the request (success or failure).
- message (string): A message indicating the success or failure of the sending of confirmation email.
- data (object): The details of the created account (name, officialEmail, phoneNumber etc).

## Account confirmation email

**The link sent to the user for confirmation send a GET request to /api/useremail/confirm/:token endpoint, which confirms the account in the db and a returns a message indicating the account confirmation.**

## Signing into an account

Only a confirmed account is allowed to signin.
Signing in an account is role based because there is only one endpoint to all signin.

**To signin into an account, you can make a POST request to the /api/login/:userType endpoint. The userType attcahed as a parameter explicitly includes one of the following depending on who is signining in; admin, company or lawyer.**
**The request body should contain the following information:**

- officialEmail (string): The email of the user.
- password (string): The password for the account provided during registration.

## Sign-in with Google

**To signin with a google account, you make a GET request to the /auth/google/:userType endpoint. The userType attcahed as a parameter also explicitly includes one of the following depending on who is signining in; admin, company or lawyer.**

The response to these will be a JSON object with the following information:

- status (string): The status of the request (success or failure).
- data (object): The details of the created account (name, officialEmail, phoneNumber etc).

### Passwords

Passwords are expected to adhere to the following conventions:

1. **Contains at least one uppercase letter.**

   - Your password must include at least one uppercase letter (A-Z).

2. **Contains at least one lowercase letter.**

   - Your password must include at least one lowercase letter (a-z).

3. **Contains at least one digit.**

   - Your password must include at least one digit (0-9).

4. **Can include special characters from the specified set (customize as needed).**

   - You are allowed to use special characters like `@`, `$`, `!`, `%`, `*`, `?`, and `&` in your password. However, please note that the set of allowed special characters may vary depending on your specific application's requirements. Refer to the password creation interface for the exact list of accepted special characters.

5. **Has a length between 8 and 30 characters.**
   - Your password must have a length that falls within the range of 8 to 30 characters.

Please make sure to create a password that adheres to these rules to help ensure the security of your account.

# Endpoints

## FOR ADMIN

### 1. Create a New Product

- **Endpoint:** `/api/create`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/create]()
- **Auhorization:** `User Bearer token`
- **Request Body**: JSON field

- **Example**:
  ```json
  {
  <<<<<<< HEAD
    "adminId": "sksjhd494940202020brgr",
  =======
  >>>>>>> ed63706ebd99dc43b11afb1a4a2c897a2a7c15fd
    "productName": "Contract Drafting and Review",
    "productPrice": 50000000,
    "productDescription": "contact between two B2B",
    "productImage": "CLOUDINARY LINK"
  }
  ```

### 2. GET ALL PRODUCTS

- **Endpoint:** `/api/products`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/products]()
- **Auhorization:** `User Bearer token`

  - on success:

  ```json
  {
    "id": "12345",
    "productName": "PRODUCTS"
  }
  ```

### 3. Update a product

- **Endpoint**: `/{userId}`
- **HTTP Method:** PUT
- **Url**: [https://localhost:5005/api/products]()
- **Auhorization:** `User Bearer token`
- **Request Body**: JSON field

  - **Example**:

```json
{
  "productName": "Updated Contract Drafting and Review",
  "productPrice": 93420000,
  "productDescription": "updated contact between two B2B",
  "productImage": "another CLOUDINARY LINK"
}
```

### 4. GET SINGLE PRODUCT

- **Endpoint:** `/api/product/:id`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/product/:id]()
- **Auhorization:** `User Bearer token`

  - on success:

  ```json
  {
    "id": "12345",
    "productName": "PRODUCT 1"
  }
  ```

### 5. DELETE PRODUCT

- **Endpoint:** `/api/delete/:id`
- **HTTP Method:** DELETE
- **Url**: [https://localhost:5005/api/delete/:id]()
- **Auhorization:** `User Bearer token`

  - on success:

  ```json
  {
    {success: true}
  }
  ```

## FOR COMPANIES/CLIENTS

### 1. ADD TO CART

- **Endpoint:** `/api/cart`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/cart]()
- **Auhorization:** `User Bearer token`
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "productId": "23894848422840",
    "quantity": 1,
    "detail": "contact between two B2B"
  }
  ```

### 2. GET COMPANY CART

- **Endpoint:** `/api/cart/:id`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/cart/:id]()
- **Auhorization:** `User Bearer token`

  - on success:

  ```json
  {
    "id": "12345",
    "productName": "CART PRODUCTS"
  }
  ```

### 3. DELETE ONE PRODUCT FROM CART

- **Endpoint:** `/api/cart`
- **HTTP Method:** DELETE
- **Url**: [https://localhost:5005/api/cart/:productId]()
- **Auhorization:** `User Bearer token`

### 4. CLEAR CART

- **Endpoint:** `/api/cart`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/cart]()
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "companyId": "sksjhd494940202020brgr"
  }
  ```

### 5. CHECKOUT CART

- **Endpoint:** `/api/checkout`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/checkout]()
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "companyId": "sksjhd494940202020brgr"
  }
  ```
  <<<<<<< HEAD
  - You are allowed to use special characters like `@`,`$`,`!`,`%`,`*`,`?`, and `&` in your password.

5. **Has a length between 8 and 30 characters.**
   - Your password must have a length that falls within the range of 8 to 30 characters.

## Forgot Password

**To fill the form for a user that forgets password, you make a POST request to the /api/forgot-password/:userType endpoint. The userType attcahed as a parameter also explicitly includes one of the following depending on who is signining in; admin, company or lawyer. The request body should contain the following information:**

- officialEmail (string): The email of the user.

On doing this, a token is sent alongside the email.

## Confirm Reset Password token

**To confirm the token sent to the email address of a user that forgets password, you make a POST request to the /api/confirm-reset-token endpoint. The request body should contain the following information:**

- token (string): The token sent to the email address of the user.

After sending the request, a link to create a new password will be displayed on the user's screen.

The response to these will be a JSON object with the following information:

- status (string): The status of the request (success or failure).
- message (string): It contains a link that makes a POST request to /api/reset-password?userType=${userType}&userEmail=${userEmail}&token=${token} redirecting the user to the new password page.

## Create a new password

**To create a new password, you make a POST request to the /api/reset-password endpoint. The request body should contain the following information:**

- password (string): A password different from the initil one.
- passwordConfirm (string): To confirm the password entered earlier.
  Also, the token sent earlier will be included in the request query.

The response to these will be a JSON object with the following information:

- status (string): The status of the request (success or failure).
- # message (string): A message indicating the success or failure of the password reset process.

## JOB ENDPOINTS

### 1. ASSIGN LAWYER TO A JOB

- **Endpoint:** `/api/assign`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/assign]()
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "lawyerId": "sksjhd494940202020brgr",
    "jobId": "Contract Drafting and Review"
  }
  ```

### 2. GET ALL JOBS

- **Endpoint:** `/api/jobs`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/jobs]()

  - on success:

  ```json
  {}
  ```

### 3. GET ALL ASSIGNED JOBS

- **Endpoint:** `/api/assign`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/assign]()

  - on success:

  ```json
  {}
  ```

### 4. GET ALL UNASSIGNED JOBS

- **Endpoint:** `/api/unassign`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/unassign]()

  - on success:

  ```json
  {}
  ```

### 5. REMOVE A LAWYER FROM A JOB

- **Endpoint:** `/api/removelawyer`
- **HTTP Method:** DELETE
- **Url**: [https://localhost:5005/api/removelawyer]()
- **Request Body**: JSON field

- **Example**:

  ```json
  {
    "lawyerId": "sksjhd494940202020brgr",
    "jobId": "Contract Drafting and Review"
  }
  ```

  - on success:

  ```json
  {
    {success: true}
  }
  ```

### 6. DELETE JOB

- **Endpoint:** `/api/deletejob`
- **HTTP Method:** DELETE
- **Url**: [https://localhost:5005/api/deletejob]()
- **Request Params**: jobId

  - on success:

  ```json
  {
    {"message" : "Job deleted successfully"}
  }
  ```

### 7. GET ALL PENDING JOBS

- **Endpoint:** `/api/pendingjobs`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/pendingjobs]()

  - on success:

  ```json
  {}
  ```

### 8. GET ALL COMPLETED JOBS

- **Endpoint:** `/api/completedjobs`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/completedjobs]()

  - on success:

  ```json
  {}
  ```

### 9. COMPLETE A JOB

- **Endpoint:** `/api/completejob`
- **HTTP Method:** PUT
- **Url**: [https://localhost:5005/api/completejob]()
- **Request params**: url(job id)

> > > > > > > 27b7a3e15d49ec4507b40577e418b4ca9318f9a4
