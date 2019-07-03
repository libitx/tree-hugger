const nock = require('nock')
const TreeHugger = require('../lib/index')
const MetaNode = require('../lib/meta-node')

const setupMock = path => {
  nock('https://metanaria.planaria.network')
    .filteringPath(path => '/testing')
    .get('/testing')
    .once()
    .replyWithFile(200, `./test/mocks/${ path }`)
}

describe('findSingleNode', () => {
  it('must return null when no results found', async done => {
    const find = { 'node.id': 'abc' }
    setupMock('blank.json')
    const node = await TreeHugger.findSingleNode({ find })
    expect(node).toEqual(null)
    done()
  })

  it('must return MetaNode instance when result is found', async done => {
    const find = { 'node.id': '586a7e14c0b4653ec0e342e0810b1242973138c1e327871256841606a690f44c' }
    setupMock('root.json')
    const node = await TreeHugger.findSingleNode({ find })
    expect(node.constructor).toEqual(MetaNode)
    done()
  })
})

describe('findAllNodes', () => {
  it('must return empty array when no results found', async done => {
    const find = { 'parent.id': 'abc' }
    setupMock('blank.json')
    const node = await TreeHugger.findAllNodes({ find })
    expect(node).toEqual([])
    done()
  })

  it('must return array of MetaNode instances when result is found', async done => {
    const find = { 'parent.id': '586a7e14c0b4653ec0e342e0810b1242973138c1e327871256841606a690f44c' }
    setupMock('root-children.json')
    const nodes = await TreeHugger.findAllNodes({ find })
    expect(nodes.length).toEqual(2)
    expect(nodes[0].constructor).toEqual(MetaNode)
    done()
  })
})

describe('findNodeById', () => {
  it('must return correct node', async done => {
    const id = '586a7e14c0b4653ec0e342e0810b1242973138c1e327871256841606a690f44c';
    setupMock('root.json')
    const node = await TreeHugger.findNodeById(id)
    expect(node.id).toEqual(id)
    done()
  })
})

describe('findNodeByTxid', () => {
  it('must return correct node', async done => {
    const txid = '66094e053724980819aa2e1010549a7161c33394c8f86b5e03b979c5b3856297';
    setupMock('root.json')
    const node = await TreeHugger.findNodeByTxid(txid)
    expect(node.txid).toEqual(txid)
    done()
  })
})

describe('findNodesByAddress', () => {
  it('must return array of MetaNode instances with correct address', async done => {
    const address = '1DwLduKv9FbxCL1GyB7rZxuUNXh5FJbjb';
    setupMock('node-versions.json')
    const nodes = await TreeHugger.findNodesByAddress(address)
    expect(nodes.length).toEqual(2)
    expect(nodes[0].address).toEqual(address)
    done()
  })
})

describe('findNodesByParentId', () => {
  it('must return array of MetaNode instances with correct parent id', async done => {
    const id = '586a7e14c0b4653ec0e342e0810b1242973138c1e327871256841606a690f44c';
    setupMock('root-children.json')
    const nodes = await TreeHugger.findNodesByParentId(id)
    expect(nodes.length).toEqual(2)
    expect(nodes[0].tx.parent.id).toEqual(id)
    done()
  })

  it('must allow optional bitquery config', async done => {
    const id = '586a7e14c0b4653ec0e342e0810b1242973138c1e327871256841606a690f44c';
    setupMock('root-children-limited.json')
    const nodes = await TreeHugger.findNodesByParentId(id, { limit: 1 })
    expect(nodes.length).toEqual(1)
    done()
  })
})

describe('findNodeAndDescendants', () => {
  it('must return array of MetaNode instances including self', async done => {
    const id = '586a7e14c0b4653ec0e342e0810b1242973138c1e327871256841606a690f44c';
    setupMock('root-and-descendants.json')
    const nodes = await TreeHugger.findNodeAndDescendants(id)
    expect(nodes.length).toEqual(7)
    expect(nodes.some(n => n.id === id)).toEqual(true)
    done()
  })
})
