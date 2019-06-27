const bitdb = require('../lib/bitdb')

describe('_buildQuery', () => {
  it('must merge base query and overrides', () => {
    const obj = bitdb._buildQuery({
      find: { foo: 'bar' },
      sort: { baz: -1, taz: -1 }
    }, {
      find: { foo: 'bing', qux: 'flop' },
      sort: { bing: 1 }
    })

    expect(obj.v).toEqual(3)
    expect(obj.q.find).toEqual({ foo: 'bing', qux: 'flop' })
    expect(obj.q.sort).toEqual({ bing: 1 })    
  })

  it('must override "project" option to ensure mandatory attributes', () => {
    const obj = bitdb._buildQuery({
      find: { foo: 'bar' }
    }, {
      project: { blk: 1, 'out.b0': 1 }
    })

    expect(obj.q.project).toEqual({ blk: 1, 'out.b0': 1, node: 1, parent: 1, ancestor: 1, child: 1 })    
  })
})