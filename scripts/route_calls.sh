
if [ -z "${PHONE_NUMBER:-}" ]; then
    echo "Error: PHONE_NUMBER environment variable is not set"
    exit 1
fi

if [ -z "${SERVICE_NAME:-}" ]; then
    echo "Error: SERVICE_NAME environment variable is not set"
    exit 1
fi

if [ -z "${ENVIRONMENT_NAME:-}" ]; then
    echo "Error: ENVIRONMENT_NAME environment variable is not set"
    exit 1
fi

if [ -z "${FUNCTION_NAME:-}" ]; then
    echo "Error: FUNCTION_NAME environment variable is not set"
    exit 1
fi

domainBase=$(
    twilio api:serverless:v1:services:list -o=json \
    | jq -r '.[] | select(.uniqueName=="'${SERVICE_NAME}'") | .domainBase'
)

url="https://${domainBase}-${ENVIRONMENT_NAME}.twil.io/${FUNCTION_NAME}"

echo "Routing ${PHONE_NUMBER} to ${url}"

twilio phone-numbers:update "$PHONE_NUMBER" \
  --voice-url "$url" \
  --voice-method POST
