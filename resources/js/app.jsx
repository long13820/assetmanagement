import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './redux/store';
import Index from './index';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter forceRefresh={true}>
      <Index />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
