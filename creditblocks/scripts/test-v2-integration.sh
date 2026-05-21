#!/bin/bash
# Built by vsrupeshkumar
# Test V2 contract integration

set -e

echo "🧪 Testing NeuroCred V2 Contract Integration"
echo "============================================"

cd "$(dirname "$0")/.."

# Check environment variables
echo ""
echo "📋 Checking environment variables..."
echo ""

if [ -f "backend/.env" ]; then
    echo "Backend .env found"
    grep -q "CREDIT_PASSPORT_NFT_ADDRESS=0x34904952E5269290B783071f1eBba51c22ef6219" backend/.env && echo "  ✓ CREDIT_PASSPORT_NFT_ADDRESS set" || echo "  ✗ CREDIT_PASSPORT_NFT_ADDRESS not set correctly"
    grep -q "STAKING_ADDRESS=0x3E9943694a37d26987C1af36DE169e631b30F153" backend/.env && echo "  ✓ STAKING_ADDRESS set" || echo "  ✗ STAKING_ADDRESS not set correctly"
else
    echo "  ✗ Backend .env not found"
fi

if [ -f "frontend/.env.local" ]; then
    echo "Frontend .env.local found"
    grep -q "NEXT_PUBLIC_CONTRACT_ADDRESS=0x34904952E5269290B783071f1eBba51c22ef6219" frontend/.env.local && echo "  ✓ NEXT_PUBLIC_CONTRACT_ADDRESS set" || echo "  ✗ NEXT_PUBLIC_CONTRACT_ADDRESS not set correctly"
    grep -q "NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=0x3E9943694a37d26987C1af36DE169e631b30F153" frontend/.env.local && echo "  ✓ NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS set" || echo "  ✗ NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS not set correctly"
else
    echo "  ✗ Frontend .env.local not found"
fi

# Check ABIs
echo ""
echo "📄 Checking ABIs..."
echo ""

[ -f "backend/abis/CreditPassportNFTV2.json" ] && echo "  ✓ CreditPassportNFTV2.json" || echo "  ✗ CreditPassportNFTV2.json missing"
[ -f "backend/abis/NeuroCredStakingV2.json" ] && echo "  ✓ NeuroCredStakingV2.json" || echo "  ✗ NeuroCredStakingV2.json missing"
[ -f "backend/abis/LendingVaultV2.json" ] && echo "  ✓ LendingVaultV2.json" || echo "  ✗ LendingVaultV2.json missing"

[ -f "frontend/abis/CreditPassportNFTV2.json" ] && echo "  ✓ Frontend CreditPassportNFTV2.json" || echo "  ✗ Frontend CreditPassportNFTV2.json missing"

# Test contract connectivity (if backend is running)
echo ""
echo "🔗 Testing contract connectivity..."
echo ""

if command -v curl &> /dev/null; then
    API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8000}"
    if curl -s "$API_URL/health" > /dev/null 2>&1; then
        echo "  ✓ Backend is running"
        echo "  → Test score generation: curl $API_URL/api/score/0x3e7716bee2d7e923cb9b572eb169edfb6cdbdab6"
    else
        echo "  ⚠ Backend not running (start with: cd backend && python -m uvicorn app:app --reload)"
    fi
else
    echo "  ⚠ curl not available, skipping connectivity test"
fi

echo ""
echo "✅ Integration check complete!"
echo ""
echo "Next steps:"
echo "  1. Start backend: cd backend && python -m uvicorn app:app --reload"
echo "  2. Start frontend: cd frontend && npm run dev"
echo "  3. Test score generation in the UI"
echo "  4. Test staking functionality"
echo ""

