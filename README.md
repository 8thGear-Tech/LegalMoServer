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

## JOB ENDPOINTS

### 1. GET ALL JOBS

- **Endpoint:** `/api/jobs`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/jobs]()

  - on success:

  ```json
  {}
  ```

### 2. GET SINGLE JOBS

- **Endpoint:** `/api/job/:jobId`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/job/:jobId]()

  - on success:

  ```json
  {}
  ```

### 3. DELETE JOB

- **Endpoint:** `/api/deletejob`
- **HTTP Method:** DELETE
- **Url**: [https://localhost:5005/api/deletejob]()
- **Auhorization:** `User Bearer token`
- **Request Params**: jobId

  - on success:

  ```json
  {
    {"message" : "Job deleted successfully"}
  }
  ```

### 4. ASSIGN LAWYER TO A JOB

- **Endpoint:** `/api/assign`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/assign]()
- **Auhorization:** `User Bearer token`
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "lawyerId": "sksjhd494940202020brgr",
    "jobId": "Contract Drafting and Review"
  }
  ```

### 5. REMOVE A LAWYER FROM A JOB

- **Endpoint:** `/api/removelawyer`
- **HTTP Method:** DELETE
- **Url**: [https://localhost:5005/api/removelawyer]()
- **Auhorization:** `User Bearer token`
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

### 6. GET ALL ASSIGNED JOBS

- **Endpoint:** `/api/assign`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/assign]()

  - on success:

  ```json
  {}
  ```

### 7. GET ALL UNASSIGNED JOBS

- **Endpoint:** `/api/unassign`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/unassign]()

  - on success:

  ```json
  {}
  ```

### 8. GET ALL PENDING JOBS

- **Endpoint:** `/api/pendingjobs`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/pendingjobs]()

  - on success:

  ```json
  {}
  ```

### 9. GET ALL COMPLETED JOBS

- **Endpoint:** `/api/completedjobs`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/completedjobs]()

  - on success:

  ```json
  {}
  ```

### 10. COMPLETE A JOB

- **Endpoint:** `/api/completejob`
- **HTTP Method:** PUT
- **Url**: [https://localhost:5005/api/completejob]()
- **Request params**: url(job id)

### 11. VIEW JOB DETAILS

- **Endpoint:** `/api/viewjobdetails/:jobId`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/viewjobdetails/:jobId]()
- **Auhorization:** `User Bearer token`

  - on success:

  ```json
  {}
  ```

### 12. ADMIN ADDING DETAILS TO A JOB

- **Endpoint:** `/api/job/:jobId`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/job/:jobId]()
- **Auhorization:** `User Bearer token`
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "detail": "additional details to the job",
    "file": "cloudinary respone file",
    "fileName": "name of the original file"
  }
  ```

### 13. COMPANY ADDING DETAILS TO A JOB

- **Endpoint:** `/api/company/editjobdetails/:jobId`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/company/editjobdetails/:jobId]()
- **Auhorization:** `User Bearer token`
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "detail": "additional details to the job",
    "file": "cloudinary respone file",
    "fileName": "name of the original file"
  }
  ```

### 14. APPLY FOR JOB (LAWYER)

- **Endpoint:** `/api/applyforjob/:jobId`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/applyforjob/:jobId]()
- **Auhorization:** `User Bearer token`

### 15. APPLY FOR JOB (LAWYER)

- **Endpoint:** `/api/requestmorejobdetails/:jobId`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/requestmorejobdetails/:jobId]()
- **Auhorization:** `User Bearer token`
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "detail": "additional details thelawyer is requesting for"
  }
  ```

## FOR LAWYER

### 1. GET LAWYER PAYMENT DETAILS

- **Endpoint:** `/api/get-payment-details`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/get-payment-details]()

  - on success:

  ```json
  {}
  ```

### 2. ADD LAWYER PAYMENT DETAILS

- **Endpoint:** `/api/add-payment-details`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/add-payment-details]()
- **Auhorization:** `User Bearer token`
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "accountNumber": "0241228197",
    "accountName": "LegalMo",
    "bank": "Wema Bank"
  }
  ```

### 3. EDIT LAWYER PAYMENT DETAILS

- **Endpoint:** `/api/edit-payment-details`
- **HTTP Method:** PATCH
- **Url**: [https://localhost:5005/api/edit-payment-details]()
- **Auhorization:** `User Bearer token`
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "accountNumber": "0241228197",
    "accountName": "LegalMo",
    "bank": "Wema Bank"
  }
  ```

### 4. SEND ONE TIME PASSWORD (OTP)

- **Endpoint:** `/api/send-otp`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/send-otp]()
- **Auhorization:** `User Bearer token`

### 5. CONFIRM ONE TIME PASSWORD (OTP)

- **Endpoint:** `/api/confirm-otp`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/confirm-otp]()
- **Auhorization:** `User Bearer token`

## FOR RATINGS

### 1. GET ALL RATINGS

- **Endpoint:** `/api/rating`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/rating]()

  - on success:

  ```json
  {}
  ```

### 2. GET SINGLE RATING

- **Endpoint:** `/api/rating/:id`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/rating/:id]()

  - on success:

  ```json
  {}
  ```

### 3. ADD RATING

- **Endpoint:** `/api/rating`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/rating]()
- **Auhorization:** `User Bearer token`
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "productId": "0sksnkn nq1219ennnfnnnndn2f",
    "reviewTitle": "Nice Product",
    "review": "Quality andd timely product",
    "status": 3
  }
  ```

### 4. UPDATE RATING

- **Endpoint:** `/api/rating/:id`
- **HTTP Method:** PATCH
- **Url**: [https://localhost:5005/api/rating/:id]()
- **Auhorization:** `User Bearer token`
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "productId": "0sksnkn nq1219ennnfnnnndn2f",
    "reviewTitle": "Nice Product",
    "review": "Quality andd timely product",
    "status": 3
  }
  ```

### 5. DELETE RATING

- **Endpoint:** `"/api/rating/:id`
- **HTTP Method:** DELETE
- **Url**: [https://localhost:5005/api/rating/:id]()
- **Auhorization:** `User Bearer token`

  - on success:

  ```json
  {
    {success: true}
  }
  ```
