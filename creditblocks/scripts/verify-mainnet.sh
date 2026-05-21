#!/bin/bash
# Built by vsrupeshkumar

# QIE Mainnet Contract Verification Script
# This script helps verify NeuroCred contracts on QIE Mainnet

set -e  # Exit on error

echo "🔍 NeuroCred QIE Mainnet Contract Verification"
echo "==============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "contracts" ]; then
    echo -e "${RED}❌ Error: Must run from project root directory${NC}"
    exit 1
fi

# Check environment
if [ -z "$QIE_NETWORK" ]; then
    export QIE_NETWORK=mainnet
fi

if [ "$QIE_NETWORK" != "mainnet" ]; then
    echo -e "${YELLOW}⚠️  Warning: QIE_NETWORK is not set to 'mainnet'${NC}"
    echo "   Current value: $QIE_NETWORK"
    echo "   Continuing anyway..."
    echo ""
fi

# Check for contract addresses
if [ ! -f "contracts/.env" ] && [ ! -f "contracts/.env.mainnet" ]; then
    echo -e "${RED}❌ Error: No .env file found in contracts/ directory${NC}"
    echo "   Please set contract addresses in contracts/.env"
    exit 1
fi

# Load addresses from .env.mainnet if available, otherwise .env
ENV_FILE="contracts/.env"
if [ -f "contracts/.env.mainnet" ]; then
    ENV_FILE="contracts/.env.mainnet"
    echo "📋 Using addresses from contracts/.env.mainnet"
else
    echo "📋 Using addresses from contracts/.env"
fi

# Check if addresses are set
if ! grep -q "CREDIT_PASSPORT_NFT_ADDRESS=" "$ENV_FILE" || grep -q "CREDIT_PASSPORT_NFT_ADDRESS=$" "$ENV_FILE"; then
    echo -e "${RED}❌ Error: CREDIT_PASSPORT_NFT_ADDRESS not set${NC}"
    exit 1
fi

echo ""
echo "🔍 Step 1: Verifying contracts..."
echo ""

cd contracts

# Run verification script
npx hardhat run scripts/verify-mainnet.ts --network qieMainnet

VERIFICATION_EXIT_CODE=$?

cd ..

if [ $VERIFICATION_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}❌ Verification failed with exit code $VERIFICATION_EXIT_CODE${NC}"
    echo ""
    echo "You can verify contracts manually:"
    echo "   cd contracts"
    echo "   npx hardhat verify --network qieMainnet <ADDRESS> <CONSTRUCTOR_ARGS...>"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Verification completed${NC}"
echo ""
echo "📝 View verified contracts on explorer:"
echo "   https://mainnet.qie.digital/"

