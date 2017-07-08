import React, {Component} from 'react';

import Mediator from './source/Mediator'
import TransferController from './source/TransferController';

import LoadingProgressBar from './source/LoadingProgressBar';
import HeadMenu from './source/HeadMenu';
import LoginForm from './source/LoginForm';
import ExceptionManager from './source/ExceptionManager'
// import Router from './source/Router'
import {Switch, Route} from 'react-router-dom';

import User from './source/User';

import UserSetting from './source/UserSetting';
// import DepartmentEditor from './source/DepartmentEditor';
import SpecializationEditor from './source/SpecializationEditor';
import GroupEditor from './source/GroupEditor';
import KeyValueEditor from './source/KeyValueEditor';
import UserInfo from './source/UserInfo';
import MenuEditor from './source/MenuEditor';

import './App.css';
// import KeyValueEditor from "./source/KeyValueEditor";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            login: false
        };
        this.user = User;
    }

    componentWillMount() {
        Mediator.subscribeEvent('app/login', (loginState) => {
            if (typeof loginState === "boolean") {
                if (loginState === true) {
                    if (this.user && this.user.accessToken) {
                        TransferController.accessToken = this.user.accessToken;
                    }
                }
                this.setState({login: loginState});
            }
        });
        Mediator.subscribeEvent('app/loading', (loadingState) => {
            if (typeof loadingState === "boolean") {
                if (this.state.loading !== loadingState) {
                    this.setState({loading: loadingState});
                }
            }
        });
        this.user.checkAccessToken();
    }

    componentDidMount() {
        Mediator.publishEvent('app/loading', false);
    }

    logout() {
        /*event.preventDefault();
         event.stopPropagation();*/
        window.history.pushState('', 'Title', '/');

        localStorage.removeItem('accessToken');
        //delete this.user;
        this.user.logout();
        Mediator.publishEvent('app/login', false);
        //this.user = new User();
    }

    render() {
        /*

         <Router route={
         {
         'user-settings': <UserSetting user={this.user}/>,
         'user-edit': <UserEdit user={this.user}/>,
         'menu-editor': <MenuEditor/>,
         }
         }/>

         */

        let show = <div className="container-fluid"/>;
        if (this.state.login) {
            show = <div className="row'">
                <HeadMenu user={this.user} logout={() => this.logout()} role="navigation"/>
                <div style={{marginTop: '10px'}} className="container-fluid">
                    <div style={{
                        float: 'none',
                        margin: '0 auto'
                    }}
                         className="col-lg-9">
                        <Switch>
                            <Route exact path='/' render={() => {
                                return <div>
                                </div>
                            }}/>
                            <Route path='/user-settings' component={UserSetting}/>
                            <Route path='/department-editor' component={() => <KeyValueEditor config={
                                {
                                    contoller: 'department'
                                }
                            }/>}/>
                            <Route path='/financing-editor' component={() => <KeyValueEditor config={
                                {
                                    contoller: 'financing'
                                }
                            }/>}/>
                            <Route path='/discipline-editor' component={() => <KeyValueEditor config={
                                {
                                    contoller: 'discipline'
                                }
                            }/>}/>

                            <Route path='/specialization-editor' component={SpecializationEditor}/>
                            <Route path='/group-editor' component={GroupEditor}/>
                            <Route path='/user-info' component={UserInfo}/>
                            <Route path='/menu-editor' component={MenuEditor}/>
                            <Route render={() => {
                                return <div>
                                    Страница не найдена
                                </div>
                            }}/>
                        </Switch>
                    </div>
                </div>
            </div>;
        }
        else {
            show = <div className="container-fluid">
                <LoginForm login={(login, password, rememberMe) => this.user.login(login, password, rememberMe)}/>
            </div>;
        }

        // Mediator.publishEvent('app/loading', false);
        return (<div className="container-fluid">
            <ExceptionManager/>
            <div className="row navbar-inverse">
                <LoadingProgressBar loading={this.state.loading}/>
            </div>
            {show}
        </div>);
    }
}

export default App;
