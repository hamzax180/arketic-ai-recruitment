import requests
import time
import statistics

BASE_URL = "http://localhost:8001"

def benchmark_endpoint(name, method, url, data=None, headers=None, iterations=10):
    print(f"\nBenchmarking {name} ({iterations} iterations)...")
    latencies = []
    
    for i in range(iterations):
        start_time = time.perf_counter()
        if method == "GET":
            response = requests.get(url, headers=headers)
        else:
            response = requests.post(url, json=data, headers=headers)
        end_time = time.perf_counter()
        
        if response.status_code in [200, 201]:
            latencies.append((end_time - start_time) * 1000)
        else:
            print(f"  Iteration {i+1} failed with status {response.status_code}")
            
    if latencies:
        avg = statistics.mean(latencies)
        p95 = statistics.quantiles(latencies, n=20)[18] if len(latencies) >= 20 else max(latencies)
        print(f"  Avg Latency: {avg:.2f}ms")
        print(f"  Max Latency: {max(latencies):.2f}ms")
        print(f"  Min Latency: {min(latencies):.2f}ms")
    else:
        print("  No successful runs to report.")

def run_benchmarks():
    print("Running Performance Benchmarks...")
    
    # 1. Public Jobs List
    benchmark_endpoint("GET /jobs", "GET", f"{BASE_URL}/jobs")

    # 2. Authenticated Token Request
    login_data = {"username": "admin@arketic.ai", "password": "admin123"}
    # requests.post with 'data' for form-data (OAuth2 format)
    start = time.perf_counter()
    resp = requests.post(f"{BASE_URL}/token", data=login_data)
    token_latency = (time.perf_counter() - start) * 1000
    print(f"\nToken fetch latency: {token_latency:.2f}ms")
    
    if resp.status_code == 200:
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 3. Authenticated Analysis (Simulated)
        # Note: Avoid heavy AI calls for benchmarking unless intended
        analysis_request = {
            "application_id": "1",
            "job_title": "Software Engineer",
            "job_description": "Test",
            "requirements": ["Python"],
            "candidate_name": "Test User",
            "candidate_skills": ["Python"],
            "cv_content": "Technical lead"
        }
        benchmark_endpoint("POST /analyze-cv (Authenticated)", "POST", f"{BASE_URL}/analyze-cv", data=analysis_request, headers=headers, iterations=5)

if __name__ == "__main__":
    run_benchmarks()
    print("\nPERFORMANCE TESTING COMPLETE.")
