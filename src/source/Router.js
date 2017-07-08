/**
 * Created by vizrael on 22.05.2017.
 */

import React, { Component } from 'react';
import Mediator from './Mediator'

class Router extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            route: null
        };
        this.setRoute = this.setRoute.bind(this);
    }

    setRoute(arg)
    {
        if(window.event)
        {
            window.event.preventDefault();
            window.event.stopPropagation();
        }
        let route = arg.url.toLowerCase();
        if (this.props.route[route])
        {
            //console.log('Router: router/route:', arg);
            window.history.pushState(arg.state, 'Title', '/'+ route);
            this.setState({route: route});
        }
        else
        {
            if(route === '')
            {
                window.history.pushState(arg.state, 'Title', '/'+ route);
                this.setState({route: route});
            }
            else
            {
                Mediator.publishEvent('exception/error',new Error('Запрашиваемого вами модуля не существует'));
            }
        }
    }

    componentWillMount()
    {
        Mediator.subscribeEvent('router/route',this.setRoute);
    }

    componentDidMount()
    {
        this.setRoute({state: window.history.state,url: window.history.state});
    }

    render()
    {
        return(<div style={{marginTop: '10px'}} className="container-fluid">
            {this.props.route[this.state.route]}
        </div>);
    }
}

export default Router;