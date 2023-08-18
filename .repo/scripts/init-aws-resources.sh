#!/usr/bin/env bash

set -euo pipefail

LOCALSTACK_HOST=localhost
AWS_REGION=us-east-1

echo "Configuring KMS"
echo "==========================="
echo "######### Creating kms key and alias ###########"
kmsKey=$(awslocal kms create-key --description "local kms key" --key-usage ENCRYPT_DECRYPT)
keyId=$(echo ${kmsKey} | python3 -c "import sys, json; print(json.load(sys.stdin)['KeyMetadata']['KeyId'])")

echo "Configuring Secrets Manager"
echo "==========================="

# aws local is a dependency
echo "######### Creating secrets ###########"
awslocal secretsmanager create-secret \
  --name local-api \
  --description "Default secrets" \
  --secret-string "{\"DEFAULT_SECRET\":\"I love dogs\", \"API_KMS_KEY_ID\": \"${keyId}\"}"
