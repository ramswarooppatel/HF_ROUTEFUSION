# API Documentation

This API provides endpoints for managing users, products, catalogs, transactions, restock reminders, and AI logs. All endpoints follow RESTful conventions and return JSON responses.

## Base URL
```
/api/
```

## Endpoints

### 1. Users
- **List Users:** `GET /api/users/`
- **Retrieve User:** `GET /api/users/{id}/`
- **Create User:** `POST /api/users/`
- **Update User:** `PUT /api/users/{id}/`
- **Delete User:** `DELETE /api/users/{id}/`

#### User Fields
- `username`, `password`, `phone`, `role`, `created_at`

---

### 2. Products
- **List Products:** `GET /api/products/`
- **Retrieve Product:** `GET /api/products/{id}/`
- **Create Product:** `POST /api/products/`
- **Update Product:** `PUT /api/products/{id}/`
- **Delete Product:** `DELETE /api/products/{id}/`

#### Product Fields
- `user`, `name`, `description`, `category`, `price`, `stock_qty`, `image_url`, `qr_code_url`, `created_at`, `remarks`

---

### 3. Catalogs
- **List Catalogs:** `GET /api/catalogs/`
- **Retrieve Catalog:** `GET /api/catalogs/{id}/`
- **Create Catalog:** `POST /api/catalogs/`
- **Update Catalog:** `PUT /api/catalogs/{id}/`
- **Delete Catalog:** `DELETE /api/catalogs/{id}/`

#### Catalog Fields
- `user`, `title`, `description`, `qr_code_url`, `created_at`

---

### 4. Catalog Products
- **List Catalog Products:** `GET /api/catalog-products/`
- **Retrieve Catalog Product:** `GET /api/catalog-products/{id}/`
- **Create Catalog Product:** `POST /api/catalog-products/`
- **Update Catalog Product:** `PUT /api/catalog-products/{id}/`
- **Delete Catalog Product:** `DELETE /api/catalog-products/{id}/`

#### CatalogProduct Fields
- `catalog`, `product`

---

### 5. Transactions
- **List Transactions:** `GET /api/transactions/`
- **Retrieve Transaction:** `GET /api/transactions/{id}/`
- **Create Transaction:** `POST /api/transactions/`
- **Update Transaction:** `PUT /api/transactions/{id}/`
- **Delete Transaction:** `DELETE /api/transactions/{id}/`

#### Transaction Fields
- `user`, `product`, `payment_link`, `reference_no`, `amount`, `status`, `created_at`

---

### 6. Restock Reminders
- **List Restock Reminders:** `GET /api/restock-reminders/`
- **Retrieve Restock Reminder:** `GET /api/restock-reminders/{id}/`
- **Create Restock Reminder:** `POST /api/restock-reminders/`
- **Update Restock Reminder:** `PUT /api/restock-reminders/{id}/`
- **Delete Restock Reminder:** `DELETE /api/restock-reminders/{id}/`

#### RestockReminder Fields
- `user`, `product`, `suggested_qty`, `season_note`, `created_at`

---

### 7. AI Logs
- **List AI Logs:** `GET /api/ai-logs/`
- **Retrieve AI Log:** `GET /api/ai-logs/{id}/`
- **Create AI Log:** `POST /api/ai-logs/`
- **Update AI Log:** `PUT /api/ai-logs/{id}/`
- **Delete AI Log:** `DELETE /api/ai-logs/{id}/`

#### AILog Fields
- `user`, `action_type`, `input_data`, `ai_output`, `timestamp`

---

## Notes
- All endpoints support standard CRUD operations.
- Authentication is bypassed for hackathon speed.
- Use the `id` field for resource identification in URLs.
- For POST/PUT, send data as JSON in the request body.
- For relationships (e.g., `user`, `product`), use the related object's ID.

---

## Example: Create a Product
```
POST /api/products/
{
  "user": "<user_id>",
  "name": "Organic Wheat",
  "description": "High quality organic wheat.",
  "category": "Grains",
  "price": 120.50,
  "stock_qty": 50,
  "image_url": "https://example.com/wheat.jpg",
  "remarks": "Harvested in July"
}
```

---

Share this file with your frontend teammate for quick integration.
