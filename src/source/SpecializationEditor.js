/**
 * Created by Vizrael on 07.06.2017.
 */
import React, {Component} from 'react';
import TransferController from './TransferController';
import Mediator from './Mediator'

class SpecializationEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: [],
            edit: null,
            add: false
        };
    }

    componentWillMount()
    {
        TransferController.send('specialization','',{},(data)=>{
            if(data)
            {
                this.setState({collection: data});
            }
        });
    }

    handleListItemClick = (index,event)=>{
        event.stopPropagation();
        event.preventDefault();
        console.log(index,'click');
    }

    handleListItemDelete = (index,event)=>{
        event.stopPropagation();
        event.preventDefault();
        Mediator.publishEvent('app/loading',true);
        TransferController.send('specialization','delete',{id: this.state.collection[index]},(data)=>{
            //if(data)
            {
                let collection = this.state.collection;
                delete collection[index];
                this.setState({collection: collection});
                Mediator.publishEvent('app/loading',false);
            }
        });

    }

    handleListItemEdit = (index,event)=>{
        event.stopPropagation();
        event.preventDefault();
        console.log(index,'Edit');
        let item = Object.assign({},this.state.collection[index]);
        this.setState({edit:item});
    }

    handleEditorSave = (event) =>
    {
        event.stopPropagation();
        event.preventDefault();

        let action = 'update';
        if(this.state.add)
        {
            action = 'add';
        }
        TransferController.send('specialization',action,this.state.edit,(data)=>{
            let collection = this.state.collection;
            let index = collection.findIndex((element, index, array)=>{
                if(element.id === data.id)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            });
            if(index!==-1)
            {
                collection[index] = data;
            }
            else
            {
                collection.push(data);
            }
            this.setState({collection: collection});
            // console.log(action,data);
            this.handleCansel();
        });
    }

    handleCansel = () => {
        this.setState({edit:null,add:false});
    }

    handleOnChangeCode = (event) => {
        let value = event.target.value;
        let item = this.state.edit;
        item.code = value;
        this.setState({edit: item});
    }

    handleOnChangeLabel = (event) => {
        let value = event.target.value;
        let item = this.state.edit;
        item.label = value;
        this.setState({edit: item});
    }

    handleAddListItem = () => {
        this.setState({edit:{id:null,code: '',label: ''},add:true});
    }


    render()
    {
        const ListItem = (props) => {
            return <a style={{wordSpacing: '3px'}} className="list-group-item" onClick={props.click}>
                {props.label}
                <span style={{ color: 'red', float: 'right', padding: '0 3px'}}
                      className="glyphicon glyphicon-trash"
                      onClick={props.delete}/>
                <span style={{ float: 'right', padding: '0 3px'}}
                      className="glyphicon glyphicon-edit"
                      onClick={props.edit}/>
            </a>;
        };
        let collection = this.state.collection.map((item,index)=>{
            return <ListItem key={item.id} label={item.code + ' ' + item.label}
                             click={(event)=>this.handleListItemEdit(index,event)}
                             edit={(event)=>this.handleListItemEdit(index,event)}
                             delete={(event)=>this.handleListItemDelete(index,event)}/>;
        });

        let editorContainer = null;
        if(this.state.edit)
        {
            editorContainer = <form className="form-horizontal">
                <fieldset>
                    {/*{<legend>Legend</legend>}*/}
                    <div className="form-group">
                        <label htmlFor="inputCode" className="col-lg-2 control-label">Код</label>
                        <div className="col-lg-10">
                            <input type="text" className="form-control" id="inputCode" placeholder="Код специальности" onChange={this.handleOnChangeCode} value={this.state.edit.code}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputLabel" className="col-lg-2 control-label">Название</label>
                        <div className="col-lg-10">
                            <input type="text" className="form-control" id="inputLabel" placeholder="Названия специальности" onChange={this.handleOnChangeLabel} value={this.state.edit.label}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-lg-10 col-lg-offset-2">
                            <button onClick={this.handleCansel} type="reset" className="btn btn-default">Отмена</button>
                            <button onClick={this.handleEditorSave} className="btn btn-primary">Сохранить</button>
                        </div>
                    </div>
                </fieldset>
            </form>;
        }
        return <div className="container-fluid">
            <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="list-group">
                    {collection}
                    <a style={{textAlign: 'center'}} className="list-group-item"
                       onClick={this.handleAddListItem}>
                        <span style={{color: 'white'}} className="glyphicon glyphicon-plus"/>
                    </a>
                </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
                {editorContainer}
            </div>
        </div>;
    }
}

export default SpecializationEditor;