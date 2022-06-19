
export class TestInfo {
  private static _testId = ''
  private static _volatileId = ''
  private static _testName = ''
  public static get testId(): string {
    return TestInfo._testId
  }
  public static set testId(value: string) {
    TestInfo._testId = value
  }
  public static get volatileId(): string {
    return TestInfo._volatileId
  }
  public static set volatileId(value: string) {
    TestInfo._volatileId = value
  }
  public static get testName(): string {
    return TestInfo._testName
  }
  public static set testName(value: string) {
    TestInfo._testName = value
  }
}

export interface TestData {
  test: string
}

TestInfo.testName = `test${Math.floor(Math.random() * 1000 + 1).toString()}`
