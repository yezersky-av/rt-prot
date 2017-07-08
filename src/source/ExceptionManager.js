/**
 * Created by vizrael on 20.05.2017.
 */
import React, {Component} from 'react';
import Mediator from './Mediator'

class ExceptionManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: []
        };
    }

    throwError(error) {
        if (error.message) {
            let errorMessage = this.state.message;
            errorMessage.push(error.message);
            this.setState({message: errorMessage});
            // console.log('ExceptionManager: throwError: ', this.state.message);

            setTimeout(() => {
                let errorMessage = this.state.message;
                errorMessage.pop();
                this.setState({message: errorMessage});
            }, 1500);
        }

        throw error;
    }

    componentWillMount() {
        Mediator.subscribeEvent('exception/error', (arg) => {
            if (arg) {
                this.throwError(arg);
            }
        });
    }

    close() {
        this.setState({message: []});
    }

    render() {

        let show = <div></div>;

        if (this.state.message.length > 0) {
            let message = this.state.message.map((elem, index) => {
                return (<div key={index}>
                    {elem}
                </div>);
            });

            show = <div className="alert alert-danger">
                <button type="button" onClick={() => this.close()} className="close">&times;</button>
                {message}
            </div>;
        }

        //<button type="button" className="close">&times;</button>
        return (show);
    }
}

export default ExceptionManager;

