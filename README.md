
# Endpoints

## FOR ADMIN

### 1. Create a New Product

- **Endpoint:** `/api/create`
- **HTTP Method:** POST
- **Url**: [https://localhost:5005/api/create]()
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "adminId" : "sksjhd494940202020brgr",
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
- **Request Body**: JSON field

  - **Example**:
 ```json
  {
    "adminId" : "sksjhd494940202020brgr",
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
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "companyId" : "sksjhd494940202020brgr",
    "productId": "23894848422840",
    "quantity" : 1,
    "detail" : "contact between two B2B"
  }
  ```

### 2. GET COMPANY CART

- **Endpoint:** `/api/cart/:id`
- **HTTP Method:** GET
- **Url**: [https://localhost:5005/api/cart/:id]()

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
- **Url**: [https://localhost:5005/api/cart]()
- **Request Body**: JSON field

- **Example**:
  ```json
  {
    "companyId" : "sksjhd494940202020brgr",
    "productId": "23894848422840",
  }
  ```

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