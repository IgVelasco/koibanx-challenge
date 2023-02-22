const { expect } = require('chai')
const { processValue } = require('../../services/file_processing') // import the 'utils' module used in the code

describe('processValue function', () => {
  //   before(() => {
  //   })

  //   after(() => {
  //   })

  it('should return the same value when type is not "number"', async () => {
    const value = await processValue('text', 'hello')
    expect(value).to.equal('hello')
  })

  it('should return a number when type is "number" and cellValue contains only numbers', async () => {
    const value = await processValue('number', '123')
    expect(value).to.equal(123)
  })

  it('should throw an error when type is "number" and cellValue contains non-numeric characters', async () => {
    try {
      await processValue('number', 'abc123')
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error)
      expect(error.message).to.equal('Value: abc123 is not full number')
    }
  })
})
