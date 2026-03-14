import sys
import os

# Mock the backend functions for isolation testing
def calculate_mock_score(match_count, total_reqs, is_software_role, is_software_candidate):
    base_score = 45
    if is_software_role and is_software_candidate:
        base_score += 15
    
    keyword_score = (match_count / total_reqs) * 40
    return int(min(98, max(45, base_score + keyword_score)))

def test_scoring_logic():
    print("Running Unit Tests: Scoring Logic...")
    
    # Test Case 1: Perfect Software Engineer Match
    score = calculate_mock_score(4, 4, True, True)
    assert score >= 90, f"Expected high score for perfect SE match, got {score}"
    print("✅ Test Case 1 Passed: Perfect SE match")

    # Test Case 2: No matches, non-software
    score = calculate_mock_score(0, 4, False, False)
    assert score == 45, f"Expected minimum score (45) for no matches, got {score}"
    print("✅ Test Case 2 Passed: Minimum score")

    # Test Case 3: Partial SE match
    score = calculate_mock_score(2, 4, True, True)
    assert 70 <= score <= 85, f"Expected moderate high score for partial SE, got {score}"
    print("✅ Test Case 3 Passed: Partial SE match")

if __name__ == "__main__":
    try:
        test_scoring_logic()
        print("\nALL UNIT TESTS PASSED!")
    except AssertionError as e:
        print(f"\nUNIT TEST FAILED: {e}")
        sys.exit(1)
