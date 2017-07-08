/**
 * Created by vizrael on 19.05.2017.
 */
import React, { Component } from 'react';
import Mediator from './Mediator'

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.login = null;
        this.password = null;
        this.remember = false;
        if(localStorage.rememberMe)
        {
            this.remember = ((localStorage.rememberMe === 'true')?true:false);
        }
    }

    changeLogin(e){
        //console.log('changeLogin: ',this,e);
        this.login = e.target.value;
    }

    changePassword(e)
    {
        //console.log('changePassword: ',this,e);
        this.password = e.target.value;
    }

    changeRemember(e)
    {
        this.remember = !this.remember;
        localStorage.setItem('rememberMe',this.remember);
        if(this.remember === false)
        {
            localStorage.removeItem('accessToken');
        }
        //console.log('changeRemember: ',this.remember);
    }

    formSubmit(e)
    {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        Mediator.publishEvent('app/loading',true);
        // console.log('e.nativeEvent: ',e.nativeEvent);
        // console.log('login: ',this.login,'\npassword: ',this.password, '\nremember: ', this.remember);
        this.props.login(this.login,this.password,this.remember);
        /*Ajax.send({

        },(data)=>{
            console.log('LoginForm: formSubmit: callback');
        })*/
    }

    render()
    {
        /*<h2 className="form-signin-heading">Пожалуйста авторизируйтесь</h2>*/
        return(<div className="row">
                <div className="login-form-container">
                    <div className="panel panel-success">
                        <div className="panel-heading">
                            <h3 className="panel-title">Войти</h3>
                        </div>
                        <div className="panel-body">
                            <form className="form-signin" onSubmit={(e) => this.formSubmit(e)}>
                                <div className="form-group">
                                    <label htmlFor="inputLogin" className="sr-only">Логин</label>
                                    <input onChange={(e)=>this.changeLogin(e)} type="login" id="inputEmail" className="form-control" placeholder="Логин" required="" autoFocus=""/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputPassword" className="sr-only">Пароль</label>
                                    <input onChange={(e)=>this.changePassword(e)} type="password" id="inputPassword" className="form-control" placeholder="Пароль" required=""/>
                                </div>
                                <div className="checkbox">
                                    <label>
                                        <input defaultChecked={this.remember} onChange={ (e) => this.changeRemember(e) } type="checkbox" value="remember-me"/> Запомнить меня
                                    </label>
                                </div>
                                <button className="btn btn-md btn-primary btn-block" type="submit" onSubmit={(e) => this.formSubmit(e)}>Войти</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

    export default LoginForm;


