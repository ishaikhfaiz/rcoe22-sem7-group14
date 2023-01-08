import { React } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; //Tracks store as a GV, Allows to access that store from anywhere
import { legacy_createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import App from './App';
import './index.css';
import reducers from './reducers';

const store = legacy_createStore(reducers, compose(applyMiddleware(thunk)))

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
