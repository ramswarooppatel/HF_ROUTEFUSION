import asyncio
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from mcp_use import MCPAgent, MCPClient


class LLM_Client:
    def __init__(self):
         # Load environment variables
        load_dotenv()

        # Create configuration dictionary
        config = {
            "mcpServers": {
            "DhartiMCPServer": {
            "command": "python",
            "args": [
                os.getenv("args", "C:\\Users\\Vishal Davey\\Desktop\\Hackfinity\\Dharti_Mcp_Server\\server_code.py")
                # "--directory",
               
                # "server_code.py",
            ]
            }
        }
        }

        # Create MCPClient from configuration dictionary
        client = MCPClient.from_dict(config)

        # Create LLM
        llm = ChatGroq(model="llama3-70b-8192")

        # Create agent with the client
        self.agent = MCPAgent(llm=llm, client=client, max_steps=30)

        self.system_prompt = """
                    You are an intelligent assistant for a digital product catalog system.
                    Your name is RFAI (Route Fusion AI). 
                    Your job is to help users (farmers, artisans, kirana store owners) manage products, catalogs, transactions, and more using available tools.
                    You have to be a friendly and helpful assistant, the users are not technical and may not know how to use the tools, so you need to guide them.

                    - If a user asks to perform an action (like "add product") but does not provide all required information (such as product name, description, price, category, stock quantity), you must ask the user for the missing details before calling any tool.
                    - User Authentication is bypassed so use the login tool ask only the user name and return the data you get from the tools.
                    - Always confirm with the user before making changes if information is incomplete.
                    - When responding, be clear and concise. If you perform an action, summarize what was done.
                    - If you need more information, ask specific questions (e.g., "What is the product name? What is the price?").
                    - Only call a tool when you have all required fields.

                    You have access to tools for creating, updating, retrieving, and deleting products, catalogs, users, transactions, restock reminders, and AI logs.

                    Avoid using technical jargon or complex terms.
                    Always use simple language that a non-technical user can understand.
                    Be consise and to the point in your responses, unless the user asks for more details.
                    """


    async def send_prompt(self, prompt:str):
        
        prompt=f"System:{self.system_prompt}\nUser:{prompt}"
        # Run the query
        result = await self.agent.run(
            prompt
        )
        print (f"\nResult: {result}")
        return (f"\nResult: {result}")

if __name__ == "__main__":
    client = LLM_Client()
    asyncio.run(client.send_prompt("आप कौन हो? give answer in english"))  # Example prompt