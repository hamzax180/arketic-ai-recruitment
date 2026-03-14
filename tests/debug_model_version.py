import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found in .env")
    exit(1)

try:
    genai.configure(api_key=GEMINI_API_KEY)
    # Testing the user's specific model string
    model = genai.GenerativeModel('gemini-3.1-flash-lite')
    response = model.generate_content("Hello")
    print("Success! Response:")
    print(response.text)
except Exception as e:
    print(f"Error with gemini-3.1-flash-lite: {e}")
