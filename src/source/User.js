/**
 * Created by vizrael on 20.05.2017.
 */
import TransferController from './TransferController';
import Mediator from './Mediator'
class User {
    constructor()
    {
        this._accessToken = null;
        this._id = null;
        this._username = null;
        this._name = null;
        this._surname = null;
        this._patronymic = null;
        this._status = null;
        this._isLogin = false;
        this._info = null;

        if(localStorage.accessToken) {
            this._accessToken = localStorage.accessToken;
            Mediator.publishEvent('app/login',true);
        }
    }

    getInfo()
    {
        TransferController.send('user-info','',{
        },(data)=>{
            console.log('getInfo: ',data);
        });
    }

    logout()
    {
        localStorage.removeItem('accessToken');
        this.constructor();
    }

    checkAccessToken()
    {
        if(localStorage.accessToken)
        {
            this._accessToken = localStorage.accessToken;

            //Mediator.publishEvent('app/loading',true);
            TransferController.send('login','check-token',{
                accessToken: this._accessToken
            },(data)=>{
                //console.log('login: ',data);
                if(data.access_token)
                {
                    this._accessToken = data.access_token;
                    if(localStorage.accessToken)
                    {
                        localStorage.setItem('accessToken',this.accessToken);
                    }
                    Mediator.publishEvent('app/login',true);
                    this.getInfo();
                    if(data.user)
                    {
                        this._id = data.user.id;
                        this._username = data.user.username;
                        this._status = data.user.status;
                    }
                    if(data.userInfo)
                    {
                        this._name = data.userInfo.name;
                        this._surname = data.userInfo.surname;
                        this._patronymic = data.userInfo.patronymic;
                    }
                    //console.log('user: ', this);
                }
                else
                {
                    Mediator.publishEvent('app/login',false);
                    Mediator.publishEvent('exception/error',new Error('Ошибка входа по токену'));
                }
            });
            //Mediator.publishEvent('app/loading',false);
        }
    }

    login(login,password,rememberMe)
    {
        Mediator.publishEvent('app/loading',true);
        TransferController.send('login','',{
            username: login,
            password: password
        },(data)=>{
            console.log('login: ',data);
            if(data.access_token)
            {
                this._accessToken = data.access_token;
                if(rememberMe === true)
                {
                    localStorage.setItem('accessToken',this.accessToken);
                }
                Mediator.publishEvent('app/login',true);
                this.getInfo();
                if(data.user)
                {
                    this._id = data.user.id;
                    this._username = data.user.username;
                    this._status = data.user.status;
                }
                if(data.userInfo)
                {
                    this._name = data.userInfo.name;
                    this._surname = data.userInfo.surname;
                    this._patronymic = data.userInfo.patronymic;
                }
                console.log('user: ', this);
            }
            else
            {
                Mediator.publishEvent('app/login',false);
                Mediator.publishEvent('exeption/error',new Error('Ошибка авторизации, проверьте введенные данные'));
            }
        });
        Mediator.publishEvent('app/loading',false);
    }

    get accessToken()
    {
        return this._accessToken;
    }

    get isLogin()
    {
        return this._isLogin;
    }

    get id()
    {
        return this._id;
    }
    get username()
    {
        return this._username;
    }
    get name()
    {
        return this._name;
    }
    get surname()
    {
        return this._surname;
    }
    get patronymic()
    {
        return this._patronymic;
    }
    get status()
    {
        return this._status;
    }


}
 export default new User();