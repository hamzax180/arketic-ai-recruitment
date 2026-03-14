import os
import json
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin():
    print("--- arketic.ai | Admin Creation Tool ---")
    name = input("Enter Admin Full Name: ")
    email = input("Enter Admin Email: ")
    password = input("Enter Admin Password: ")
    
    hashed_password = pwd_context.hash(password)
    
    user_data = {
        "email": email,
        "name": name,
        "role": "admin",
        "hashed_password": hashed_password
    }
    
    db_path = os.path.join(os.path.dirname(__file__), "backend", "db", "users.json")
    
    users = []
    if os.path.exists(db_path):
        with open(db_path, "r") as f:
            users = json.load(f)
    
    # Check if user already exists
    if any(u["email"] == email for u in users):
        print(f"Error: User with email {email} already exists.")
        return

    users.append(user_data)
    
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    with open(db_path, "w") as f:
        json.dump(users, f, indent=4)
        
    print(f"\nSUCCESS: Admin user '{name}' created successfully!")

if __name__ == "__main__":
    create_admin()
