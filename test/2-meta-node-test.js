const fs = require('fs')
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

const nodeData  = fs.readFileSync('./test/support/base-node.json'),
      subject   = new MetaNode( JSON.parse(nodeData) );

describe('MetaNode instance attributes', () => {

  it('must have shorthand id attributes', () => {
    expect(subject.id).toEqual('8674d24384ef2f4312e9c1c039db57c8a5e3d76ecf2da20a25d264f11b3ff701')
    expect(subject.txid).toEqual('048e7609c70089ee052ddc7e5bceaec14a22b815b20624bcbebad58bc2415f2c')
    expect(subject.address).toEqual('1B43Nn9MEW1sTYw57s31XUXoPX3zuM6fBG')
  })

  it('must have boolean attributes', () => {
    expect(subject.isRoot).toEqual(false)
    expect(subject.isChild).toEqual(true)
    expect(subject.isLeaf).toEqual(false)
  })

  it('must have shorthand tx attributes', () => {
    expect(typeof subject.tx).toEqual('object')
    expect(Array.isArray(subject.inputs)).toBe(true)
    expect(Array.isArray(subject.outputs)).toBe(true)
    expect(typeof subject.opReturn).toEqual('object')
    expect(subject.inputs).toEqual(subject.tx.in)
    expect(subject.outputs).toEqual(subject.tx.out)
    expect(subject.outputs).toContain(subject.opReturn)
  })
})

describe('MetaNode traversal', () => {
  it('must travere to root', async done => {
    setupMock('root.json')
    const node = await subject.root()
    expect(node.id).toEqual(subject.tx.ancestor[0].id)
    done()
  })

  it('must travere to parent', async done => {
    setupMock('root.json')
    const node = await subject.parent()
    expect(node.id).toEqual(subject.tx.parent.id)
    done()
  })

  it('must travere to ancestors', async done => {
    setupMock('root.json')
    const nodes = await subject.ancestors()
    expect(nodes.length).toEqual(1)
    expect(nodes[0].id).toEqual(subject.tx.parent.id)
    expect(nodes).not.toContain(subject)
    done()
  })

  it('must travere to siblings', async done => {
    setupMock('subject-siblings.json')
    const nodes = await subject.siblings()
    expect(nodes.length).toEqual(1)
    expect(nodes).not.toContain(subject)
    done()
  })

  it('must travere to children', async done => {
    setupMock('subject-children.json')
    const nodes = await subject.children()
    expect(nodes.length).toEqual(2)
    expect(nodes.every(n => n.tx.parent.id === subject.id)).toBeTruthy()
    done()
  })

  it('must travere to descendants', async done => {
    setupMock('subject-children.json')
    const nodes = await subject.descendants()
    expect(nodes.length).toEqual(2)
    expect(nodes).not.toContain(subject)
    nodes.every(n => {
      expect(n.tx.ancestor.some(a => a.id === subject.id)).toBeTruthy()
    })
    done()
  })

  it('must travere to ancestors with self in order', async done => {
    setupMock('root.json')
    const nodes = await subject.selfAndAncestors()
    expect(nodes.length).toEqual(2)
    expect(nodes).toContain(subject)
    expect(nodes.indexOf(subject)).toEqual(0)
    done()
  })

  it('must travere to siblings with self in order', async done => {
    setupMock('subject-siblings.json')
    const nodes = await subject.selfAndSiblings()
    expect(nodes.length).toEqual(2)
    expect(nodes).toContain(subject)
    expect(nodes.indexOf(subject)).toEqual(0)
    done()
  })

  it('must travere to descendants with self in order', async done => {
    setupMock('subject-children.json')
    const nodes = await subject.selfAndDescendants()
    expect(nodes.length).toEqual(3)
    expect(nodes).toContain(subject)
    expect(nodes.indexOf(subject)).toEqual(0)
    done()
  })
})

const nodeData2 = fs.readFileSync('./test/support/base-node-2.json'),
      subject2  = new MetaNode( JSON.parse(nodeData2) );

describe('MetaNode with versions', () => {
  it('must traverse to versions', async done => {
    setupMock('subject-versions.json')
    const nodes = await subject2.versions()
    expect(nodes.length).toEqual(1)
    expect(nodes).not.toContain(subject2)
    done()
  })

  it('must traverse to versions with self in order', async done => {
    setupMock('subject-versions.json')
    const nodes = await subject2.selfAndVersions()
    expect(nodes.length).toEqual(2)
    expect(nodes).toContain(subject2)
    done()
  })
})