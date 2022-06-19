import AnticipatedEvents from '../src/index'
import { DateTime } from 'luxon'
import { TestData, TestInfo } from './test.info'

describe('create and delete', () => {

  const initEvent = async () => {
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
        TestInfo.volatileId = response.event.id
      })
  }
  
  beforeAll(() => {
    return initEvent();
  });

  test('delete JSON event', async () => {
    const options = { key: process.env.ANTICIPATED_IO_KEY || '' }
    return new AnticipatedEvents<TestData>(options)
      .delete(TestInfo.volatileId)
      .then((response) => {
        expect(response.event.id).not.toBe(null)
        expect(response.event.deleted).toEqual(true)
      })
  })
  
})
