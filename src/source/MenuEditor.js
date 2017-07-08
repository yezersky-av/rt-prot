/**
 * Created by vizrael on 23.05.2017.
 */
import React, {Component} from 'react';

import TransferController from './TransferController';
import Mediator from './Mediator';
// import config from './config';

class MenuEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            editElement: null
        };
    }

    componentWillMount() {
        Mediator.publishEvent('app/loading', true);
        TransferController.send('navi-menu', '', null, (data) => {
            // console.log('HeadMenu ', 'componentWillMount ', data);
            this.setState({menu: data});
            Mediator.publishEvent('app/loading', false);
        });
    }

    chooseElementForEdit(elem)
    {
        if(elem)
        {
            this.setState({editElement: elem});
        }
    }

    render()
    {
        let goDeepInMenu = (elem) =>{
                return <li style={{cursor: 'pointer'}} onClick={()=>{this.chooseElementForEdit(elem)}} key={'menu_' + elem.id} className="list-group-item">
                        {elem.label}
                </li>;
        }

        let menu = this.state.menu.map((item, index) => {
            return goDeepInMenu(item, false);
        });

        let element = null;

        if(this.state.editElement)
        {

            element = <form className="form-horizontal">
                <fieldset>
                    <legend>Текущий элемиент: {this.state.editElement.label}</legend>
                    <div className="form-group">
                        <label htmlFor="inputLabel" className="col-lg-2 control-label">Email</label>
                        <div className="col-lg-10">
                            <input type="text" className="form-control" id="inputLabel" placeholder="Название пунка меню" value={this.state.editElement.label}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-lg-10 col-lg-offset-2">
                            <button type="reset" className="btn btn-default">Cancel</button>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </fieldset>
            </form>;
        }

        return (
            <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                        <ul className="list-group">
                            {menu}
                            <li onClick={()=>{}} style={{ textAlign: "center", cursor: 'pointer'}} className="list-group-item"><span className="glyphicon glyphicon-plus"/></li>
                        </ul >
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        {element}
                    </div>
            </div>
        );
    }
}

export default MenuEditor;