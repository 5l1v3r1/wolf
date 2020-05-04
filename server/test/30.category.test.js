
const mocha = require('./util/mocha')
const util = require('./util/util')

const headers = util.adminHeaders()

function getAddResponseSchema() {
  const schema = util.okSchema({
    type: 'object',
    properties: {
      category: {type: 'object'},
    },
    required: ['category'],
  })
  return schema
}

function getListResponseSchema() {
  const schema = util.okSchema({
    type: 'object',
    properties: {
      categorys: {
        type: 'array',
        items: {
          type: 'object',
        },
        minItems: 1,
      },
      total: {type: 'integer'},
    },
    required: ['categorys', 'total'],
  })
  return schema
}

let category = null;

describe('category', function() {
  const name = 'test-category-name'

  it('check exist', async function() {
    const schema = util.okSchema()
    const body = {value: {name: 'not-exist'}, exclude: {id: 100}}

    const url = '/wolf/category/checkExist';
    await mocha.post({url, headers, body, schema})
  });

  it('add', async function() {
    const schema = getAddResponseSchema();
    const appID = 'test-application-id'
    const body = {appID, name}

    const url = '/wolf/category';
    const res = await mocha.post({url, headers, body, schema})
    category = res.body.data.category;
  });

  it('update', async function() {
    if (!category) {
      this.skip();
    }
    const schema = getAddResponseSchema();
    const id = category.id;
    const name = 'test-category-name:updated'
    const body = {id, name}

    const url = '/wolf/category';
    await mocha.put({url, headers, body, schema})
  });

  it('list', async function() {
    const schema = getListResponseSchema()
    const url = '/wolf/category/list'
    const appID = 'test-application-id'
    const args = {appID, key: name}
    const res = await mocha.get({url, headers, args, schema})
  });

  after(async function() {
    if (!category) {
      this.skip();
    }
    const url = '/wolf/category';
    const id = category.id
    const body = {id}
    await mocha.delete({url, headers, body})
  });
});
