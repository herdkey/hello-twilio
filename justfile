# Fail immediately on errors
set shell := ["/bin/zsh", "-euo", "pipefail", "-c"]

# gitignored file for devs to place overrides in
set dotenv-filename := ".local.env"

# Make local node binaries available like npm does
export PATH := "node_modules/.bin:" + env_var("PATH")

# the port to serve on locally
port := env_var_or_default("PORT", "3001")
# ngrok domain (claim a free domain on ngrok.com)
ngrok_domain := env_var("NGROK_DOMAIN")
# phone number to map to the ngrok domain (buy a number on twilio.com)
phone := env_var("PHONE_NUMBER")

build: clean
    tsc -p tsconfig.build.json
    @tsc-alias -p tsconfig.build.json
    @node ./scripts/privatize.js
    @node scripts/write-cjs-boundary.js

clean:
    rm -rf dist

# start local dev server
start: build
    root_dir="{{justfile_directory()}}" \
    port="{{port}}" \
    "{{justfile_directory()}}/scripts/start_twilio_server.sh"

# use ngrok to expose dev server publicly
ngrok:
    root_dir="{{justfile_directory()}}" \
    port="{{port}}" \
    "{{justfile_directory()}}/scripts/start_ngrok_server.sh"

# route phone number webhook to local dev server
route-calls function:
    # see https://www.twilio.com/docs/serverless/functions-assets/quickstart/receive-call#create-and-host-a-function
    twilio phone-numbers:update "{{phone}}" --voice-url "https://{{ngrok_domain}}/{{function}}"

# deploy after build
deploy: build
    twilio serverless deploy --override-existing-project

# run tests, pass through extra args
test *args:
    vitest {{args}}

# run tests with UI
test-ui:
    vitest --ui

# run coverage
coverage:
    vitest run --coverage

# lint code
lint:
    ESLINT_STRICT=true eslint . --fix --ext .ts,.js

# format code
fmt:
    prettier --write .
