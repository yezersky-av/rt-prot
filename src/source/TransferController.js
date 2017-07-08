/**
 * Created by vizrael on 19.05.2017.
 */
import config from './config';
import Mediator from './Mediator'

class TransferController
{
    constructor() {
        this.serverAdress = config.network.apiUrl;
        this._accessToken = null;
    }

    get accessToken(){
        return this._accessToken;
    }

    set accessToken(accessToken){
        if(accessToken)
        {
            this._accessToken = accessToken;
        }
    }

    send(controller, action, data, callback)
    {
        //// console.log('Ajax: send');

        let url = this.serverAdress + ((controller)?controller+'/':'') + ((action)?action+'/':'') + ((this._accessToken)?'?access-token='+this._accessToken:'');
        // Mediator.publishEvent('app/loading',true);
        fetch(url, {
            method: 'post',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(function (response) {
                if(response.status !== 200)
                {
                    throw new Error('Status Code: ' + response.status + ' :\n ' +response.statusText);
                }
                return response.json();
            })
            .then(function (result) {
                callback(result);
            })
            .catch (function (error) {
                // console.log('Request failed', error);
                Mediator.publishEvent('exeption/error',error);
                // Mediator.publishEvent('app/loading',false);
            });
    }
}

let transferController = new TransferController();

export default transferController;