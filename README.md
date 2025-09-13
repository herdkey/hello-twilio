# Hello Twilio

## Setup

1. Install [Volta](https://volta.sh/).
2. Ensure corepack is enabled for pnpm: `corepack enable`
3. Install deps: `pnpm install`
4. Install Twilio CLI: `brew install twilio`
5. Install Twilio Serverless CLI Plugin: `twilio plugins:install @twilio-labs/plugin-serverless`
6. Install ngrok (Optional, for local development): `brew install ngrok`

# Twilio Serverless

## Import from assets

Third party libraries can be deployed as dependencies to the serverless project. However, to make our internal imports work, we have to [load modules from assets](https://www.twilio.com/docs/serverless/functions-assets/client#load-a-module-from-an-asset).

We deal with this using `tsc-alias`. First, it resolves our aliases like `@shared` to paths like `../shared/...`. Then, using custom "replacers", we rewrite these to use `Runtime.getAssets()[...].path`. We also rewrite our files to use the `.private.js` extension, to [make them private](https://www.twilio.com/docs/serverless/functions-assets/visibility#how-to-set-visibility), because we do not want to expose them to the public.
