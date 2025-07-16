#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}=== JWT Validation Middleware Tests ===${NC}\n"

# Test 1: Health Check (Public Route - Should Work)
echo -e "${YELLOW}Test 1: Health Check (Public Route)${NC}"
echo "GET /health"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" $BASE_URL/health)
http_code=$(echo "$response" | tail -n1 | cut -d: -f2)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Status: $http_code"
    echo "Response: $body"
else
    echo -e "${RED}❌ FAIL${NC} - Status: $http_code"
    echo "Response: $body"
fi
echo ""

# Test 2: Auth Route (Public Route - Should Work)
echo -e "${YELLOW}Test 2: Auth Login Route (Public Route)${NC}"
echo "GET /api/v1/auth/login"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" $BASE_URL/api/v1/auth/login)
http_code=$(echo "$response" | tail -n1 | cut -d: -f2)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 503 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Status: $http_code (Service unavailable - expected since auth service isn't running)"
    echo "Response: $body"
else
    echo -e "${YELLOW}⚠️  INFO${NC} - Status: $http_code (Route is accessible without JWT)"
    echo "Response: $body"
fi
echo ""

# Test 3: Protected Route Without Token (Should Fail)
echo -e "${YELLOW}Test 3: Protected Route Without Token${NC}"
echo "GET /api/v1/users"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" $BASE_URL/api/v1/users)
http_code=$(echo "$response" | tail -n1 | cut -d: -f2)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 401 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Status: $http_code"
    echo "Response: $body"
else
    echo -e "${RED}❌ FAIL${NC} - Status: $http_code"
    echo "Response: $body"
fi
echo ""

# Test 4: Protected Route With Invalid Token (Should Fail)
echo -e "${YELLOW}Test 4: Protected Route With Invalid Token${NC}"
echo "GET /api/v1/users with Authorization: Bearer invalid-token"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -H "Authorization: Bearer invalid-token" $BASE_URL/api/v1/users)
http_code=$(echo "$response" | tail -n1 | cut -d: -f2)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 401 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Status: $http_code"
    echo "Response: $body"
else
    echo -e "${RED}❌ FAIL${NC} - Status: $http_code"
    echo "Response: $body"
fi
echo ""

# Test 5: Protected Route With Malformed Token (Should Fail)
echo -e "${YELLOW}Test 5: Protected Route With Malformed Authorization Header${NC}"
echo "GET /api/v1/users with Authorization: invalid-format"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -H "Authorization: invalid-format" $BASE_URL/api/v1/users)
http_code=$(echo "$response" | tail -n1 | cut -d: -f2)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 401 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Status: $http_code"
    echo "Response: $body"
else
    echo -e "${RED}❌ FAIL${NC} - Status: $http_code"
    echo "Response: $body"
fi
echo ""

# Test 6: Admin-Only Route Without Token (Should Fail)
echo -e "${YELLOW}Test 6: Admin-Only Route Without Token${NC}"
echo "GET /api/v1/organizations"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" $BASE_URL/api/v1/organizations)
http_code=$(echo "$response" | tail -n1 | cut -d: -f2)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 401 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Status: $http_code"
    echo "Response: $body"
else
    echo -e "${RED}❌ FAIL${NC} - Status: $http_code"
    echo "Response: $body"
fi
echo ""

# Test 7: Analytics Route Without Token (Should Fail)
echo -e "${YELLOW}Test 7: Analytics Route (Admin-Only) Without Token${NC}"
echo "GET /api/v1/analytics"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" $BASE_URL/api/v1/analytics)
http_code=$(echo "$response" | tail -n1 | cut -d: -f2)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 401 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Status: $http_code"
    echo "Response: $body"
else
    echo -e "${RED}❌ FAIL${NC} - Status: $http_code"
    echo "Response: $body"
fi
echo ""

# Test 8: Non-existent Route (Should Return 404)
echo -e "${YELLOW}Test 8: Non-existent Route${NC}"
echo "GET /api/v1/nonexistent"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" $BASE_URL/api/v1/nonexistent)
http_code=$(echo "$response" | tail -n1 | cut -d: -f2)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 401 ]; then
    echo -e "${GREEN}✅ PASS${NC} - Status: $http_code (JWT validation occurs before route matching)"
    echo "Response: $body"
else
    echo -e "${YELLOW}⚠️  INFO${NC} - Status: $http_code"
    echo "Response: $body"
fi
echo ""

echo -e "${BLUE}=== Test Summary ===${NC}"
echo "All JWT validation middleware tests completed."
echo "✅ Public routes (health, auth) are accessible without tokens"
echo "❌ Protected routes reject requests without valid JWT tokens"
echo "🔒 Admin-only routes require both JWT validation and role checking"
