
const mocha = require('./util/mocha')
const util = require('./util/util')

const headers = util.adminHeaders()

function getAddResponseSchema() {
  const schema = util.okSchema({
    type: 'object',
    properties: {
      role: {type: 'object'},
    },
    required: ['role'],
  })
  return schema
}

function getListResponseSchema() {
  const schema = util.okSchema({
    type: 'object',
    properties: {
      roles: {
        type: 'array',
        items: {
          type: 'object',
        },
        minItems: 1,
      },
      total: {type: 'integer'},
    },
    required: ['roles', 'total'],
  })
  return schema
}

// const role = null;

describe('role', function() {
  const appID = 'role-test-app-id'
  let name = 'test-role-name'
  it('add', async function() {
    const schema = getAddResponseSchema();
    const id = 'test-role-id'
    const description = 'test-role-description'
    const body = {id, name, description, appID, permIDs: ['PERM_OK', 'PERM_02']}

    const url = '/wolf/role';
    await mocha.post({url, headers, body, schema})
  });

  it('update', async function() {
    const schema = getAddResponseSchema();
    const id = 'test-role-id'
    name += ':updated'
    const permIds = ['PERM_UPDATE', 'PERM_OK'];
    const description = 'test-role-description:updated'
    const body = {id, name, description, permIDs: permIds}

    const url = '/wolf/role';
    await mocha.put({url, headers, body, schema})
  });

  it('list', async function() {
    const schema = getListResponseSchema()
    const url = '/wolf/role/list'
    const args = {appID, key: name}
    const res = await mocha.get({url, headers, args, schema})
  });


  after(async function() {
    const url = '/wolf/role';
    const id = 'test-role-id'
    const body = {id}
    await mocha.delete({url, headers, body})
  });
});
