from mcp.server.fastmcp import FastMCP
import requests
import os
from dotenv import load_dotenv

load_dotenv()
app = FastMCP("DhartiMCPServer")
DJANGO_API = os.getenv("DJANGO_API", "http://localhost:8000/api")
@app.tool(description="Create a new product")
def create_product(data: dict) -> dict:
    response = requests.post(f"{DJANGO_API}/products/", json=data)
    return response.json()

@app.tool(description="Get all products")
def get_all_products() -> dict:
    response = requests.get(f"{DJANGO_API}/products/")
    return response.json()

@app.tool(description="Get a product by ID")
def get_product(product_id: int) -> dict:
    response = requests.get(f"{DJANGO_API}/products/{product_id}/")
    return response.json()

@app.tool(description="Update a product by ID")
def update_product(product_id: int, data: dict) -> dict:
    response = requests.put(f"{DJANGO_API}/products/{product_id}/", json=data)
    return response.json()

@app.tool(description="Delete a product by ID")
def delete_product(product_id: int) -> dict:
    response = requests.delete(f"{DJANGO_API}/products/{product_id}/")
    return {"deleted": response.status_code == 204}

# ---------- CATALOG TOOLS ----------

@app.tool(description="Create a new catalog")
def create_catalog(data: dict) -> dict:
    response = requests.post(f"{DJANGO_API}/catalogs/", json=data)
    return response.json()

@app.tool(description="Get all catalogs")
def get_all_catalogs() -> dict:
    response = requests.get(f"{DJANGO_API}/catalogs/")
    return response.json()

@app.tool(description="Get a catalog by ID")
def get_catalog(catalog_id: int) -> dict:
    response = requests.get(f"{DJANGO_API}/catalogs/{catalog_id}/")
    return response.json()

@app.tool(description="Update a catalog by ID")
def update_catalog(catalog_id: int, data: dict) -> dict:
    response = requests.put(f"{DJANGO_API}/catalogs/{catalog_id}/", json=data)
    return response.json()

@app.tool(description="Delete a catalog by ID")
def delete_catalog(catalog_id: int) -> dict:
    response = requests.delete(f"{DJANGO_API}/catalogs/{catalog_id}/")
    return {"deleted": response.status_code == 204}

# ---------- TRANSACTION TOOLS ----------

@app.tool(description="Create a new transaction")
def create_transaction(data: dict) -> dict:
    response = requests.post(f"{DJANGO_API}/transactions/", json=data)
    return response.json()

@app.tool(description="Get all transactions")
def get_all_transactions() -> dict:
    response = requests.get(f"{DJANGO_API}/transactions/")
    return response.json()

@app.tool(description="Get a transaction by ID")
def get_transaction(transaction_id: int) -> dict:
    response = requests.get(f"{DJANGO_API}/transactions/{transaction_id}/")
    return response.json()

@app.tool(description="Update a transaction by ID")
def update_transaction(transaction_id: int, data: dict) -> dict:
    response = requests.put(f"{DJANGO_API}/transactions/{transaction_id}/", json=data)
    return response.json()

@app.tool(description="Delete a transaction by ID")
def delete_transaction(transaction_id: int) -> dict:
    response = requests.delete(f"{DJANGO_API}/transactions/{transaction_id}/")
    return {"deleted": response.status_code == 204}

# ---------- USER TOOLS ----------

@app.tool(description="Create a new user")
def create_user(data: dict) -> dict:
    response = requests.post(f"{DJANGO_API}/users/", json=data)
    return response.json()

@app.tool(description="Login the user")
def login_user(data: str) -> dict:
    response = requests.post(f"{DJANGO_API}/login/", json={"username":data})
    return response.json()

@app.tool(description="Get all users")
def get_all_users() -> dict:
    response = requests.get(f"{DJANGO_API}/users/")
    return response.json()

@app.tool(description="Get a user by ID")
def get_user(user_id: int) -> dict:
    response = requests.get(f"{DJANGO_API}/users/{user_id}/")
    return response.json()

@app.tool(description="Update a user by ID")
def update_user(user_id: int, data: dict) -> dict:
    response = requests.put(f"{DJANGO_API}/users/{user_id}/", json=data)
    return response.json()

@app.tool(description="Delete a user by ID")
def delete_user(user_id: int) -> dict:
    response = requests.delete(f"{DJANGO_API}/users/{user_id}/")
    return {"deleted": response.status_code == 204}

# ---------- RESTOCK REMINDER TOOLS ----------

@app.tool(description="Create a restock reminder")
def create_restock_reminder(data: dict) -> dict:
    response = requests.post(f"{DJANGO_API}/restockreminders/", json=data)
    return response.json()

@app.tool(description="Get all restock reminders")
def get_all_restock_reminders() -> dict:
    response = requests.get(f"{DJANGO_API}/restockreminders/")
    return response.json()

@app.tool(description="Delete a restock reminder by ID")
def delete_restock_reminder(reminder_id: int) -> dict:
    response = requests.delete(f"{DJANGO_API}/restockreminders/{reminder_id}/")
    return {"deleted": response.status_code == 204}

# ---------- AI LOG TOOLS ----------

@app.tool(description="Create an AI log entry")
def create_ai_log(data: dict) -> dict:
    response = requests.post(f"{DJANGO_API}/ailogs/", json=data)
    return response.json()

@app.tool(description="Get all AI logs")
def get_all_ai_logs() -> dict:
    response = requests.get(f"{DJANGO_API}/ailogs/")
    return response.json()

# Add more tools for update, delete, etc.

if __name__ == "__main__":
    try:
        print("Starting FastMCP server on http://localhost:8005...")
        app.run(transport='stdio')
    except Exception as e:
        print(e)