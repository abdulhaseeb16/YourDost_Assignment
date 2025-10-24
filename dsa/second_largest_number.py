"""
🧠 Part 1 – DSA Problem
Problem: Given an array of integers, return the second largest unique number in the array.
If it doesn’t exist, return -1.

Example:
Input: [3, 5, 2, 5, 6, 6, 1]
Output: 5

Input: [7, 7, 7]
Output: -1

Approach:
  - Keep track of the largest and second largest unique elements
  - Traverse the array once (O(n))
  - Use only constant extra space (O(1))
"""

def second_largest_unique(nums):
    largest = second_largest = float('-inf')

    for num in nums:
        if num > largest:
            second_largest = largest
            largest = num
        elif largest > num > second_largest:
            second_largest = num

    return second_largest if second_largest != float('-inf') else -1


# Sample Test Cases
print(second_largest_unique([3, 5, 2, 5, 6, 6, 1]))  # Output: 5
print(second_largest_unique([7, 7, 7]))              # Output: -1
print(second_largest_unique([1, 2]))                 # Output: 1
print(second_largest_unique([9]))                    # Output: -1
print(second_largest_unique([-1, -2, -3, -1]))       # Output: -2
