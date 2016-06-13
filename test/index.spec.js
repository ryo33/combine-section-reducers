import { expect } from 'chai'
import { combineReducers } from 'redux'
import combineSectionReducers from '../src/index.js'

describe('combineSectionReducers', () => {
  const validReducer = (state = {}, action) => state

  it('should throw a error when invalid reducer is included', () => {
    expect(combineSectionReducers({
      a: validReducer,
      b: {}
    })).to.throw(Error)
    expect(combineSectionReducers({
      a: validReducer,
      b: (state, action) => state
    })).to.throw(Error)
    expect(combineSectionReducers({
      a: validReducer,
      b: (state, action) => ({})
    })).to.throw(Error)
  })

  it('should not throw a error when invalid reducer is not included', () => {
    expect(combineSectionReducers({
      a: validReducer,
      b: validReducer,
      c: validReducer
    })).not.to.throw(Error)
  })

  it('should return the initial state', () => {
    const reducerA = (state = 0, action) => state
    const reducerB = (state = 1, action) => state
    const reducerC = (state = 2, action) => state
    const reducer = combineSectionReducers({
      a: reducerA,
      b: reducerB,
      c: reducerC
    })
    expect(reducer(undefined, {type: 'INIT'})).to.eql({a: 0, b: 1, c: 2})
  })

  const reducerA = (state = [0], {type, payload}, entireState) => {
    switch (type) {
      case 'ADD':
        return state.concat(payload, entireState)
      case 'ADD_TO_A':
        return state.concat(payload, entireState)
      default:
        return state
    }
  }

  const reducerB = (state = [1], {type, payload}, entireState) => {
    switch (type) {
      case 'ADD':
        return state.concat(payload, entireState)
      case 'ADD_TO_B':
        return state.concat(payload, entireState)
      default:
        return state
    }
  }

  const reducerC = (state = [2], {type, payload}, entireState) => {
    switch (type) {
      case 'ADD':
        return state.concat(payload, entireState)
      case 'ADD_TO_C':
        return state.concat(payload, entireState)
      default:
        return state
    }
  }

  it('should pass the state and the action to each reducers properly', () => {
    const reducer = combineSectionReducers({
      a: reducerA,
      b: reducerB,
      c: reducerC
    })
    const state = reducer(undefined, {type: 'INIT'})
    expect(reducer(state, {type: 'ADD_TO_A', payload: 'a'}, state)).to.eql({a: [
      0,
      'a',
      state
    ], b: [1], c: [2]})
    expect(reducer(state, {type: 'ADD_TO_B', payload: 'b'}, state)).to.eql({a: [0], b: [
      1,
      'b',
      state
    ], c: [2]})
    expect(reducer(state, {type: 'ADD_TO_C', payload: 'c'}, state)).to.eql({a: [0], b: [1], c: [
      2,
      'c',
      state
    ]})
    expect(reducer(state, {type: 'ADD', payload: 'd'}, state)).to.eql({a: [
      0,
      'd',
      state
    ], b: [
      1,
      'd',
      state
    ], c: [
      2,
      'd',
      state
    ]})
    const anotherState = {
      a: [0, 1, 2, 3],
      b: [],
      c: [4]
    }
    expect(reducer(anotherState, {type: 'ADD_TO_A', payload: 'a'}, state)).to.eql({a: [
      0, 1, 2, 3,
      'a',
      state
    ], b: [], c: [4]})
    expect(reducer(anotherState, {type: 'ADD', payload: 'd'}, state)).to.eql({a: [
      0, 1, 2, 3,
      'd',
      state
    ], b: [
      'd',
      state
    ], c: [
      4,
      'd',
      state
    ]})
  })

  it('should pass the entire state to each reducers properly', () => {
    const reducer = combineSectionReducers({
      a: reducerA,
      b: reducerB,
      c: reducerC
    })
    const state = reducer(undefined, {type: 'INIT'})
    expect(reducer(state, {type: 'ADD', payload: 'd'}, "entireState")).to.eql({a: [
      0,
      'd',
      "entireState"
    ], b: [
      1,
      'd',
      "entireState"
    ], c: [
      2,
      'd',
      "entireState"
    ]})
  })

  it('should be able to be used as normal reducer', () => {
    const reducer = combineSectionReducers({
      a: reducerA,
      b: reducerB,
      c: reducerC
    })
    const state = reducer(undefined, {type: 'INIT'})
    expect(reducer(state, {type: 'ADD', payload: 'd'})).to.eql({a: [
      0,
      'd',
      state
    ], b: [
      1,
      'd',
      state
    ], c: [
      2,
      'd',
      state
    ]})
  })

  it('should change the state only when necessary', () => {
    const reducerA = (state = 0, action) => state
    const reducerB = (state = 1, action) => state
    const reducerC = (state = 2, action) => state
    const reducer = combineSectionReducers({
      a: reducerA,
      b: reducerB,
      c: reducerC
    })
    const state = { a: 0, b: 1, c: 2 }
    expect({ a: 0, b: 1, c: 2 }).not.to.equal({ a: 0, b: 1, c: 2 })
    expect(reducer(state, {type: 'DO_NOTHING'}, state)).to.equal(state)
  })

  it('should work with combineReducers', () => {
    const reducerA = (state = 0, action) => state
    const reducerB = (state = 1, action) => state
    const reducerC = (state = 2, action) => state
    const reducer1 = combineSectionReducers({
      a: combineReducers({
        a: reducerA,
        b: reducerB,
        c: reducerC
      }),
      b: reducerA
    })
    expect(reducer1(undefined, { type: 'INIT' })).to.eql({a: {a: 0, b: 1, c: 2}, b: 0})
    const reducer2 = combineReducers({
      a: combineReducers({
        a: reducerA,
        b: reducerB,
        c: reducerC
      }),
      b: reducerA
    })
    expect(reducer2(undefined, { type: 'INIT' })).to.eql({a: {a: 0, b: 1, c: 2}, b: 0})
  })
})
