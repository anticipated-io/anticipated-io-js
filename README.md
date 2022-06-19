# Javascript / Node SDK written in Typescript for the anticipated.io Service

A lightweight library designed to use the [anticipated.io](https://anticipated.io) service in your Javascript / Typescript / Node projects.

The [anticipated.io](https://anticipated.io) service provides a way to schedule and receive events based on a specific date/time. You can set an event to fire a few minutes from now or years from now. Event types are either JSON web event, XML web event or Amazon AWS SQS event.

## Installation

The recommended way to install the anticipated.io SDK is through `npm` or `Yarn`.

npm:

```sh
npm install anticipated-io-js
```

yarn:

```sh
yarn add anticipated-io-js
```

## Prerequisites

You will need an API key from the [anticipated.io](https://anticipated.io) service.

## Import note about using SQS events

If you want to schedule SQS events you will want to create a user in your AWS account and provide the user access ONLY to send messages into the SQS queue. Make sure you ONLY provide access for that user. An example policy might be this:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sqs:SendMessage",
      "Resource": "arn:aws:sqs:{region}:{accountID}:{queueName}"
    }
  ]
}
```

## Usage

With the Javascript/Node/Typescript SDK you can create / schedule events and delete events.  There is not an option to update an event.  You can, however, delete the event and build a new event.  Please note the new event would have a new ID.

### Scheduling a JSON Webhook Event

To create an event you need to call the `createJson` function with the information you want to schedule.

```javascript
const a = new AnticipatedEvent({ key: API_KEY })
const results = await a.createJson({
  when: new Date('2022-06-14T22:09:00.000Z'),
  url: YOUR_URL,
  method: 'post', // or 'post' or 'GET' or 'POST'
  document: {
    info: 'custom information sent back in the payload for the POST',
    id: 2352
  }
})
console.log(results)
```

output:

```json
{
    "now": "2022-06-14T22:05:49.272Z",
    "event": {
        "id": "4jcBhmdUFnwxUpNSzivAGt",
        "company": "x3BHxPtCEgoM323EKxKbiEh7",
        "type": "json",
        "when": "2022-06-14T22:09:00.000Z",
        "created": "2022-06-14T22:05:49.256Z",
        "details": {
            "document": {
                "info": "custom information sent back in the payload for the POST",
                "id": 2352
            },
            "url": "YOUR_URL",
            "method": "post",
            "headers": []
        }
    }
}
```

### Scheduling an SQS Event

To create an event you need to call the `createSqs` function with the information you want to schedule.

```javascript
const a = new AnticipatedEvent({ key: API_KEY })
const results = await a.createSqs({
  when: new Date('2022-05-24 20:10:00'),
  url: YOUR_SQS_QUEUE_URL,
  document: {
    info: 'custom information sent in the MessageBode',
    id: 2352
  }
})
console.log(results)
```

output:

```json
{
  "now": "2022-05-20T22:10:00.623Z",
  "event": {
    "id": "B1tPZBFPSUMfYU4PCPCGjc",
    "company": "x3BHxPtCEgoM323EKxKbiEh7",
    "type": "sqs",
    "when": "2022-05-25T20:10:00.000Z",
    "created": "2022-05-20T22:10:00.123Z",
    "details": {
      "document": {
        "info": "custom information sent in the MessageBody",
        "id": 2352
      },
      "url": "YOUR_SQS_QUEUE_URL",
      "delaySeconds": 0
    }
  }
}
```

### Deleting an Event

To create an event you need to call the `createSqs` function with the information you want to schedule.

```javascript
const a = new AnticipatedEvent({ key: API_KEY })
const results = await a.delete('B1tPZBFPSUMfYU4PCPCGjc')
console.log(results)
```

output:

```json
{
    "now": "2022-06-14T22:41:31.986Z",
    "event": {
        "id": "MC4a3fskFv5pFiZ9JNjXGu",
        "company": "x3BHxPtCEgoM323EKxKbiEh7",
        "when": "2022-06-14T22:46:31.571Z",
        "created": "2022-06-14T21:33:31.893Z",
        "type": "json",
        "details": {
            "headers": [],
            "method": "post",
            "url": "https://dev-diagnostics.anticipated.io/v1/event/4aVTdjM4fJXAXFxBWyaFT3/5eG76FnniNXzqkgALAas8Q",
            "document": {
                "id": "4aVTdjM4fJXAXFxBWyaFT3",
                "application": "deltaTest",
                "key": "5eG76FnniNXzqkgALAas8Q",
                "url": "https://dev-diagnostics.anticipated.io/v1/event/4aVTdjM4fJXAXFxBWyaFT3/5eG76FnniNXzqkgALAas8Q",
                "minutesAhead": 73
            }
        },
        "deletedTime": "2022-06-14T22:41:31.974Z",
        "deletedBy": "CMwVDx844JMsfNgALLLX51"
    }
}
```


## Tests

Tests are executed via Jest.

```shell script
npm run test
```
