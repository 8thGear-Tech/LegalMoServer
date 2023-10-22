
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
    "productPrice" : 50000000,
    "productDescription" : "contact between two B2B",
    "productImage" : "CLOUDINARY LINK" 
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
    "productPrice" : 93420000,
    "productDescription" : "updated contact between two B2B",
    "productImage" : "another CLOUDINARY LINK" 
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
    "quantity" : 1,
    "detail" : "contact between two B2B"
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
    "companyId" : "sksjhd494940202020brgr",
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
    "companyId" : "sksjhd494940202020brgr",
  }
  ```


## JOB ENDPOINTS


### 1. ASSIGN LAWYER TO A JOB

- **Endpoint:** `/api/assign`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/assign]()
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "lawyerId" : "sksjhd494940202020brgr",
    "jobId": "Contract Drafting and Review"
  }
  ```

### 2. GET ALL JOBS

- **Endpoint:** `/api/jobs`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/jobs]()

  - on success:

  ```json
  {
    
  }
  ```

### 3. GET ALL ASSIGNED JOBS

- **Endpoint:** `/api/assign`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/assign]()

  - on success:

  ```json
  {
    
  }
  ```

### 4. GET ALL UNASSIGNED JOBS

- **Endpoint:** `/api/unassign`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/unassign]()

  - on success:

  ```json
  {
    
  }
  ```

### 5. REMOVE A LAWYER FROM A JOB

- **Endpoint:** `/api/removelawyer`
- **HTTP Method:** DELETE
- **Url**: [https://localhost:5005/api/removelawyer]()
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "lawyerId" : "sksjhd494940202020brgr",
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
  {
    
  }
  ```

### 8. GET ALL COMPLETED JOBS

- **Endpoint:** `/api/completedjobs`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/completedjobs]()

  - on success:

  ```json
  {
    
  }
  ```

### 9. COMPLETE A JOB

- **Endpoint:** `/api/completejob`
- **HTTP Method:** PUT
- **Url**: [https://localhost:5005/api/completejob]()
- **Request params**: url(job id)


