/**
 * Created by vizrael on 23.05.2017.
 */
import React, {Component} from 'react';
import User from './User';
/*
import TransferController from './TransferController';
import Mediator from './Mediator'
import config from './config'
*/

class UserEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render()
    {
        return (
            <div className="container-fluid">
                <div className="col-lg-6">
                    <div className="panel panel-primary" style={{wordSpacing: "5px"}}>
                        <div className="panel-heading">
                            <h3 className="panel-title">Информация</h3>
                        </div>
                        <div className="panel-body">
                            <div className="container-fluid">
                                <label>ФИО:</label>
                                {User.surname + " " +User.name + " " + User.patronymic}
                            </div>
                            <div className="container-fluid">
                                <label>Статус:</label>
                                {User.surname + " " +User.name + " " + User.patronymic}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserEdit;