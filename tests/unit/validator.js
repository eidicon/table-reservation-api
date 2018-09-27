const assert = require('chai')
const sinon = require('sinon')
const validator = require('../../app/utils/bodyVaidator')

describe('Request body validation', function () {
  it('should return 400', async function () {
    const request = sinon.fake()
    const response = sinon.fake()
    const next = sinon.fake()
    const rsp = await validator(request, response, next)
    assertEqual(rsp, 404)
  })
})
