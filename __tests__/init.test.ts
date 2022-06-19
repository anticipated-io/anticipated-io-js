import AnticipatedEvents from '../src/index'

test('Initialize the Anticipated IO API', () => {
  const options = { key: process.env.ANTICIPATED_IO_KEY || '' }
  const np = new AnticipatedEvents<object>(options)
  expect(np).not.toBe(null)
})
