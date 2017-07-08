/**
 * Created by Vizrael on 26.04.2017.
 */
import React, {Component} from 'react';
import TransferController from './TransferController';
import Mediator from './Mediator'
import { Link } from 'react-router-dom';
import User from './User';
import config from './config'

class HeadMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: []
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



    render() {

        let MenuElements = ({elem}) => {
            // console.log('MenuElements ',elem);
            if (elem.link) {
                let dropdown = elem.link.map((item, index) => {
                    return <MenuElements key={item.id} elem={item}/>;
                });

                return <li className="dropdown">
                    <a className="dropdown-toggle" data-toggle="dropdown">
                        {elem.label} <span className="caret"/>
                    </a>
                    <ul className="dropdown-menu navbar-inverse">
                        {dropdown}
                    </ul>
                </li>;

            }
            else {
                /*
                 <a onClick={() => {
                 // console.log('menu: click');
                 Mediator.publishEvent('router/route', {state: elem.route, url: elem.route})
                 }}>
                 {elem.label}
                 </a>
                 */
                return <li>
                    <Link to={{ pathname: '/'+elem.route }}>{elem.label}</Link>
                </li>;
            }
        }

        const UserMenu = () => <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
                <a className="dropdown-toggle" data-toggle="dropdown">
                    {User.name} <span className="glyphicon glyphicon-option-vertical"/>
                </a>
                <ul className="dropdown-menu navbar-inverse">
                    <li>
                        <Link to={{ pathname: '/user-info' }}>Информация</Link>
                    </li>
                    <li>
                        <Link to={{ pathname: '/user-settings' }}>Настройки</Link>
                    </li>
                    <li><a onClick={() => this.props.logout()}> Выйти</a></li>
                </ul>
            </li>
        </ul>;

        let menu = this.state.menu.map((item, index) => {
            // console.log('menu map ',item);
            return <MenuElements key={item.id} elem={item}/>;
        });

        // console.log('this.props.user: ', this.props.user.name);
        return (<div className="row navbar-inverse">
            <div className="container-fluid">
                <nav style={{marginBottom: 0}} className="navbar navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <Link to={{ pathname: '/' }} className="navbar-brand">{config.name}</Link>
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                    data-target="#bs-example-navbar-collapse-1">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="glyphicon glyphicon-tasks"/>
                            </button>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                {menu}
                            </ul>
                            <UserMenu/>
                        </div>
                    </div>
                </nav>
            </div>
        </div>);
    }
}

export default HeadMenu;