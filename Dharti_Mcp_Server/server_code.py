from mcp.server.fastmcp import FastMCP
import requests

app = FastMCP("DhartiMCPServer")

@app.tool(description="This is to create a new product")
def create_product(data: dict) -> dict:
    response = requests.post("http://localhost:8000/api/products/", json=data)
    return response.json()

@app.tool(description="This is to see all the available products")
def see_all_product() -> dict:
    response = requests.get("http://localhost:8000/api/products/")
    print(f"Response: {response.json()}")
    return response.json()


# Add more tools for update, delete, etc.

if __name__ == "__main__":
    try:
        print("Starting FastMCP server on http://localhost:8005...")
        app.run(transport='stdio')
    except Exception as e:
        print(e)