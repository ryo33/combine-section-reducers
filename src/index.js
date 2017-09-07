import isValidReduxReducer from 'is-valid-redux-reducer/lib/index'

export default function combineSectionReducers(reducers) {
  const reducerKeys = Object.keys(reducers)

  let error
  try {
    for (let i = 0; i < reducerKeys.length; i ++) {
      isValidReduxReducer(reducers[reducerKeys[i]], true)
    }
  } catch (e) {
    error = e
  }

  return function (state, action, entireState) {
    if (error) {
      throw error
    }

    let hasChanged = false
    let nextState = typeof state === 'undefined' ? {} : Object.assign({}, state)
    function forEachReducers(state, action, entireState) {
      for (let i = 0; i < reducerKeys.length; i ++) {
        const key = reducerKeys[i]
        const previousStateForKey = state(key)
        const nextStateForKey = reducers[key](previousStateForKey, action, entireState)
        nextState[key] = nextStateForKey
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey
      }
    }
    if (typeof state === 'undefined') {
      // Initialize
      forEachReducers(key => undefined, action, undefined)
    } else if (typeof entireState === 'undefined') {
      // Be used as a normal reducer
      forEachReducers(key => state[key], action, state)
    } else {
      // Be used as a section reducer
      forEachReducers(key => state[key], action, entireState)
    }

    return hasChanged ? nextState : state
  }
}
