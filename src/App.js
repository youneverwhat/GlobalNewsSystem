import React from 'react'
import { Provider } from 'react-redux'
import IndexRouter from './router/IndexRouter'
import './App.css'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter></IndexRouter>
      </PersistGate>
    </Provider>
  )
}
