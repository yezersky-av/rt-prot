/**
 * Created by vizrael on 22.05.2017.
 */
import React from 'react';
import { Router, Route } from 'react-router';

import App from './App';
/*
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';
*/
/*
 <Route path="/contact" component={Contact} />
 <Route path="*" component={NotFound} />
 */

const Routes = (props) => (
    <Router {...props}>
        <Route path="/" component={App}>
        </Route>
    </Router>
);
export default Routes;