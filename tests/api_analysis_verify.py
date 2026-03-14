import requests
import json
import time

BASE_URL = "http://localhost:8001"

# 1. Login to get token
login_data = {
    "username": "admin@arketic.ai",
    "password": "admin123"
}
response = requests.post(f"{BASE_URL}/token", data=login_data)
token = response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 2. Mock Application Data for a Software Engineer
# This mimics the request sent by the frontend
analysis_request = {
    "application_id": "1773479370409", # Using an existing ID from DB
    "job_title": "Senior Software Engineer",
    "job_description": "We are looking for a rockstar developer with Node.js and React experience.",
    "requirements": ["Node.js", "React", "AWS", "English"],
    "candidate_name": "Hamza (Test)",
    "candidate_skills": ["Node", "ReactJS", "Python", "Problem Solving"],
    "cv_content": "Experience: Senior Software Engineer at Tech Corp. Built scalable apps with Node and React."
}

print("Sending analysis request...")
response = requests.post(f"{BASE_URL}/analyze-cv", json=analysis_request, headers=headers)

if response.status_code == 200:
    result = response.json()
    print("\n--- Analysis Result ---")
    print(f"Score: {result['score']}%")
    print(f"Summary: {result['summary']}")
    print(f"Pros: {result['pros']}")
    print(f"Keywords Matched: {result['keywordsMatched']}")
    
    if result['score'] > 60:
        print("\nSUCCESS: Score is much improved (was 40%).")
    else:
        print("\nFAILURE: Score is still low.")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
