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
                # "--directory",
                "C:\\Users\\Vishal Davey\\Desktop\\Hackfinity\\Dharti_Mcp_Server\\server_code.py",
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

    async def send_prompt(self, prompt:str):
    
        # Run the query
        result = await self.agent.run(
            prompt
        )
        print (f"\nResult: {result}")
        return (f"\nResult: {result}")

if __name__ == "__main__":
    client = LLM_Client()
    asyncio.run(client.send_prompt("आप कौन हो? give answer in english"))  # Example prompt