combineSectionReducers
====
One of the best ways to create a big reducer.  

[![npm version](https://badge.fury.io/js/combine-section-reducers.svg)](https://badge.fury.io/js/combine-section-reducers)
## Installation
`npm install --save combine-section-reducers`

## What's the section reducers?
**Section** reducers is the same as reducers but it requires the third argument to get the entire state.  
`(sectionState, action, state) => newSectionState`  
It's called a **section** reducer.  
But we had better write it as below not to be confused when we use `combineReducers` and `combineSectionReducers` together.  
`(state, action, entireState) => newState`  

## Usage
The usage of `combineSectionReducers` is the same as [Redux's combineReducers](http://redux.js.org/docs/api/combineReducers.html)'s one.  
But you can pass not only **normal** reducers but also **section** reducers to it.  
Also, the result of `combineSectionReducers` can be used as not only a **normal** reducer but also a **section** reducers.

## Example
```javascript
import { combineReducers } from 'redux'
import combineSectionReducers from 'combine-section-reducers'

// Create a big reducer.
combineSectionReducers({
  a: combineSectionReducers({
    a: sectionReducerA,
    b: sectionReducerB
  }),
  b: combineSectionReducers({
    a: sectionReducerC,
    b: reducerA
  })
})

// Use combineReducers together.
combineReducers({
  a: combineSectionReducers({
    a: combineReducers({
      a: sectionReducerA,
      b: reducerA
    },
    b: combineSectionReducers({
      a: sectionReducerB,
      b: reducerB
    },
  }),
  b: combineReducers({
    a: combineReducers({
      a: sectionReducerC,
      b: reducerC
    },
    b: combineSectionReducers({
      a: sectionReducerD,
      b: reducerD
    },
  }),
})
```

## License
MIT
