import requests
import json

BASE_URL = "http://localhost:8001"

def test_security():
    print("Running Security Tests...")

    # 1. Test Unauthenticated Access to Protected Endpoint
    print("\n[Security] Testing Unauthenticated Access to /analyze-cv...")
    response = requests.post(f"{BASE_URL}/analyze-cv", json={})
    if response.status_code == 401:
        print("✅ SUCCESS: Unauthenticated access blocked (401 Unauthorized)")
    else:
        print(f"❌ FAILURE: Unauthenticated access NOT blocked. Status: {response.status_code}")

    # 2. Test Invalid Token
    print("\n[Security] Testing Invalid Token...")
    headers = {"Authorization": "Bearer invalid_token_here"}
    response = requests.post(f"{BASE_URL}/analyze-cv", json={}, headers=headers)
    if response.status_code == 401:
        print("✅ SUCCESS: Invalid token rejected (401 Unauthorized)")
    else:
        print(f"❌ FAILURE: Invalid token NOT correctly rejected. Status: {response.status_code}")

    # 3. Test Admin Protected Dashboard Access (assuming /hr/jobs or similar exists and is protected)
    # Note: In this specific app, /jobs is often public, but let's check a sensitive POST if any.
    # We'll check login with wrong credentials.
    print("\n[Security] Testing Login with Wrong Credentials...")
    login_data = {"username": "hacker@evil.com", "password": "wrongpassword"}
    response = requests.post(f"{BASE_URL}/token", data=login_data)
    if response.status_code == 401:
        print("✅ SUCCESS: Malicious login blocked (401 Unauthorized)")
    else:
        print(f"❌ FAILURE: Malicious login NOT blocked. Status: {response.status_code}")

if __name__ == "__main__":
    test_security()
    print("\nSECURITY TESTING COMPLETE.")
