# Payload Samples

## Incoming call to trace-call webhook

These payloads were captured by logging the inputs to the webhook handler function:

```javascript
export const handler = (context, event, callback) => {
  // ...
}
```

### Event

This is the value of the `event` parameter after calling the Twilio number from Michael's phone.

* For privacy, Michael's number is replaced by `+18181234567`
* For security, the Twilio number is replaced by `+13231234567`

```json
{
  "request": {
    "headers": {
      "host": "radiable-agnatically-lionel.ngrok-free.app",
      "user-agent": "TwilioProxy/1.1",
      "content-length": "865",
      "accept": "*/*",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-home-region": "us1",
      "x-twilio-service-flow-event": "%7B%22flow_id%22%3A%22RQff5971bd667b60637e725407045998bf%22%2C%22type%22%3A%22api_event%22%2C%22action%22%3A%22twiml_fetch%22%2C%22sub_action%22%3A%22completed%22%2C%22result%22%3A%22success%22%2C%22metadata%22%3A%7B%22transfer_type%22%3A%22call_transfer_url%22%7D%7D",
      "x-twilio-signature": "ZJFOm7xvKPIKyd/RrS5PNLF2fo4=",
      "accept-encoding": "gzip"
    },
    "cookies": {}
  },
  "Called": "+13231234567",
  "ToState": "CA",
  "CallerCountry": "US",
  "Direction": "inbound",
  "CallerState": "CA",
  "ToZip": "",
  "CallSid": "CA450188bc524230c5086da78b80861648",
  "To": "+13231234567",
  "CallerZip": "91604",
  "ToCountry": "US",
  "StirVerstat": "TN-Validation-Passed-A",
  "CallToken": "%7B%22parentCallInfoToken%22%3A%22eyJhbGciOiJFUzI1NiJ9.eyJjYWxsU2lkIjoiQ0E0NTAxODhiYzUyNDIzMGM1MDg2ZGE3OGI4MDg2MTY0OCIsImZyb20iOiIrMTgxODk3MDEzMjQiLCJ0byI6IisxMzIzODg2NDY3NiIsImlhdCI6IjE3NTc3NzQ3NzkifQ.L_g13gr500t9sDu4SMKHFzmFiYS5D0bx4CT1VEkCCoCvS6g5T7E0MEABwmrUDV-xR5zvh6Y7tJd2LjiSpwhrFQ%22%2C%22identityHeaderTokens%22%3A%5B%5D%7D",
  "CalledZip": "",
  "ApiVersion": "2010-04-01",
  "CalledCity": "",
  "CallStatus": "ringing",
  "From": "+18181234567",
  "AccountSid": "**********",
  "CalledCountry": "US",
  "CallerCity": "LOS ANGELES",
  "ToCity": "",
  "FromCountry": "US",
  "Caller": "+18181234567",
  "FromCity": "LOS ANGELES",
  "CalledState": "CA",
  "FromZip": "91604",
  "FromState": "CA"
}
```

### Context

```json
{
  "PATH": "/trace-call",
  "DOMAIN_NAME": "localhost:3001",
  "ACCOUNT_SID": "**********",
  "AUTH_TOKEN": "**********",
  "GREETING": "Good day to you"
}
```
