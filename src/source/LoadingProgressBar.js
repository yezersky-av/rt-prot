/**
 * Created by Vizrael on 26.04.2017.
 */
import React, { Component } from 'react';

class LoadingProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        let progress = 0;
        let background = <div className="loading-background"/>
        if(this.props.loading === true)
        {
            progress = 100;
        }
        else
        {
            progress = 0;
            background = '';
        }
        return(<div className="progress">
                <div className="progress-bar progress-bar-danger progress-bar-striped active" role="progressbar"
                     aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width: progress+'%'}}>
                </div>
            {background}
            </div>);
    }
}

export default LoadingProgressBar;