import AnticipatedEvents from '../src/index'
import { DateTime } from 'luxon'
import { TestData, TestInfo } from './test.info'

test('Schedule: test number: ' + TestInfo.testName, () => {
  expect(TestInfo.testName).not.toBe(null)
  expect(TestInfo.testName).not.toBe(0)
})

test('Schedule: -1 min (should 400)', async () => {
  const options = { key: process.env.ANTICIPATED_IO_KEY || '' }
  const when = DateTime.utc().minus({ minutes: 1 }).toISO()
  const url = process.env.SQS_URL || ''
  return new AnticipatedEvents<TestData>(options)
    .createSqs({ when, details: { url, document: { test: TestInfo.testName } } })
    .catch((e) => {
      expect(e).toMatch(/^you cannot create an event in the past/)
    })
})

test('Schedule: 0 min (should 400)', async () => {
  const options = { key: process.env.ANTICIPATED_IO_KEY || '' }
  const when = DateTime.utc().toISO()
  const url = process.env.SQS_URL || ''
  return new AnticipatedEvents<TestData>(options)
    .createSqs({ when, details: { url, document: { test: TestInfo.testName } } })
    .catch((e) => {
      expect(e).toMatch(/^you cannot create an event in the past/)
    })
})

test('Schedule: +5 min (should 200)(sqs)', async () => {
  const options = { key: process.env.ANTICIPATED_IO_KEY || '' }
  const when = DateTime.utc().plus({ minutes: 5 }).toISO()
  const url = process.env.SQS_URL || ''
  return new AnticipatedEvents<TestData>(options)
    .createSqs({
      when,
      details: {
        url,
        document: { test: TestInfo.testName }
      }
    })
    .then((response) => {
      expect(response.event.id).not.toBe(null)
      expect(response.event.when).toEqual(when)
      expect(response.event.details.document.test).toEqual(TestInfo.testName)
    })
})

test('Schedule: +1 min (should 200)(webhook - json)', async () => {
  const options = { key: process.env.ANTICIPATED_IO_KEY || '' }
  const when = DateTime.utc().plus({ minutes: 1 }).toISO()
  const url = process.env.POST_URL || 'https://dev-diagnostics.anticipated.io/v1/post'
  return new AnticipatedEvents<TestData>(options)
    .createJson({
      when,
      details: {
        method: 'post',
        url,
        document: { test: TestInfo.testName }
      }
    })
    .then((response) => {
      expect(response.event.id).not.toBe(null)
      expect(response.event.when).toEqual(when)
      expect(response.event.details.document.test).toEqual(TestInfo.testName)
    })
})

test('Schedule: +5 min (should 200)(webhook - json)', async () => {
  const options = { key: process.env.ANTICIPATED_IO_KEY || '' }
  const when = DateTime.utc().plus({ minutes: 5 }).toISO()
  const url = process.env.POST_URL || 'https://dev-diagnostics.anticipated.io/v1/post'
  return new AnticipatedEvents<TestData>(options)
    .createJson({
      when,
      details: {
        method: 'post',
        url,
        document: { test: TestInfo.testName }
      }
    })
    .then((response) => {
      expect(response.event.id).not.toBe(null)
      expect(response.event.when).toEqual(when)
      expect(response.event.details.document.test).toEqual(TestInfo.testName)
    })
})


test('Schedule: +5 min (should 200)(webhook - xml)', async () => {
  const options = { key: process.env.ANTICIPATED_IO_KEY || '' }
  const when = DateTime.utc().plus({ minutes: 5 }).toISO()
  const url = process.env.POST_URL || 'https://dev-diagnostics.anticipated.io/v1/post'
  const xml = '<xml><test>' + TestInfo.testName + '</test></xml>'
  return new AnticipatedEvents<string>(options)
    .createXml({
      when,
      details: {
        method: 'post',
        url,
        document: xml
      }
    })
    .then((response) => {
      expect(response.event.id).not.toBe(null)
      expect(response.event.when).toEqual(when)
      expect(response.event.details.document).toEqual(xml)
    })
})
