import AnticipatedEvents, { JsonEvent } from '../src/index'
import { DateTime } from 'luxon'
import { TestData, TestInfo } from './test.info'

export const initEvent = async () => {
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
      TestInfo.testId = response.event.id
    })
}

beforeAll(() => {
  return initEvent();
});

test('Get (should 200 with info)', async () => {
  const options = { key: process.env.ANTICIPATED_IO_KEY || '' }
  return new AnticipatedEvents<TestData>(options)
    .get(TestInfo.testId)
    .then((r) => {
      const event = r.event as JsonEvent<TestData>
      expect(event.id).toEqual(TestInfo.testId)
      expect(event.details.document.test).toEqual(TestInfo.testName)
    }).catch(e=>console.error(e))
})

test('Response list as an empty array', async () => {
  const options = { key: process.env.ANTICIPATED_IO_KEY || '' }
  return new AnticipatedEvents<TestData>(options)
    .get(TestInfo.testId)
    .then((r) => {
      expect(r.responses).toHaveLength(0)
    }).catch(e=>console.error(e))
})
