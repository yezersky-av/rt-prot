/**
 * Created by Vizrael on 07.06.2017.
 */
import React, {Component} from 'react';
import TransferController from './TransferController';
import Mediator from './Mediator'

class KeyValueEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: [],
            edit: null,
            add: false
        };
        this._config = {
            contoller: null,
            action: {
                index: '',
                create: 'add',
                update: 'update',
                delete: 'delete'
            }
        };

        if(props.config)
        {
            this.updateConfig(props.config);
        }
        this._collection = [];
        this._filter = '';
    }

    updateConfig(newConfig)
    {
        if(newConfig.contoller)
        {
            this._config.contoller = newConfig.contoller;
        }
        if(newConfig.action)
        {
            for(let key in newConfig.action)
            {
                this._config.action[key] = newConfig.action[key];
            }
        }

    }

    componentWillReceiveProps(nextProps)
    {
        if(nextProps.config)
        {
            this.updateConfig(nextProps.config);
        }
    }

    componentWillMount() {
        TransferController.send(this._config.contoller, this._config.action.index, {}, (data) => {
            if (data) {
                this._collection = data;
                this.applyFilter();
            }
        });
    }

    applyFilter(filter){
        let collection = this._collection.slice();
        if (filter) {
            filter = filter.toLowerCase();
            for (let i = collection.length - 1; i >= 0; i--) {
                //.*.*
                let regex = new RegExp('.*' + filter + '.*');
                if (collection[i])
                {
                    if (!regex.test(collection[i].label.toLowerCase())) {
                        delete collection[i];
                    }
                }

            }
        }
        this.setState({collection: collection});
    }

    handleOnFilterChange = (event) => {
        this._filter = event.target.value;
        this.applyFilter(this._filter);
    }

    handleListItemClick = (index, event) => {
        event.stopPropagation();
        event.preventDefault();
        // console.log(index, 'click');
    }

    handleListItemDelete = (event) => {
        event.stopPropagation();
        event.preventDefault();

        TransferController.send(this._config.contoller, this._config.action.delete, {id: this.state.edit.id}, (data) => {

            let index = this._collection.findIndex((element, index, array) => {
                if (element.id === this.state.edit.id) {
                    return true;
                }
                else {
                    return false;
                }
            });

            if (index !== -1) {
                // collection[index] = data;
                let collection = this._collection;
                delete collection[index];
                this.applyFilter(this._filter);
                this.handleCansel();
            }
        });
    }

    handleListItemEdit = (index, event) => {
        event.stopPropagation();
        event.preventDefault();
        // console.log(index, 'Edit');
        let item = Object.assign({}, this.state.collection[index]);
        this.setState({edit: item});
    }

    handleEditorSave = (event) => {
        event.stopPropagation();
        event.preventDefault();

        let action = this._config.action.update;
        if (this.state.add) {
            action = this._config.action.create;
        }
        Mediator.publishEvent('app/loading', true);
        TransferController.send(this._config.contoller, action, this.state.edit, (data) => {
            let collection = this._collection;
            let index = collection.findIndex((element, index, array) => {
                if (element.id === data.id) {
                    return true;
                }
                else {
                    return false;
                }
            });
            if (index !== -1) {
                collection[index] = data;
            }
            else {
                collection.push(data);
            }
            // this.setState({collection: collection});
            // console.log(action,data);
            this.applyFilter(this._filter);
            this.handleCansel();
            Mediator.publishEvent('app/loading', false);
        });
    }

    handleCansel = () => {
        this.setState({edit: null, add: false});
    }

    handleOnChange = (event) => {
        let value = event.target.value;
        let item = this.state.edit;
        item.label = value;
        this.setState({edit: item});
    }

    handleAddListItem = () => {
        this.setState({edit: {id: null, label: ''}, add: true});
    }


    render() {
        const ListItem = (props) => {
            // console.log(this.state.edit,props.id);
            let classes = 'list-group-item';
            classes+= ((this.state.edit && this.state.edit.id === props.id)?' active':'');
            return <a style={{wordSpacing: '3px'}} className={classes} onClick={props.click}>
                {props.label}
            </a>;
        };
        let collection = this.state.collection.map((item, index) => {
            return <ListItem key={item.id} id={item.id} label={item.label}
                             click={(event) => this.handleListItemEdit(index, event)}
                             edit={(event) => this.handleListItemEdit(index, event)}
                             delete={(event) => this.handleListItemDelete(index, event)}/>;
        });

        let editorContainer = null;
        if (this.state.edit) {
            editorContainer = <form className="form-horizontal">
                <fieldset>
                    {/*{<legend>Legend</legend>}*/}
                    <div className="form-group">
                        <label htmlFor="inputDepartment" className="col-lg-2 control-label">Название</label>
                        <div className="col-lg-10">
                            <input autoFocus={true} type="text" className="form-control" id="inputDepartment"
                                   placeholder="Названия"
                                   onChange={this.handleOnChange} value={this.state.edit.label}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-lg-10 col-lg-offset-2">
                            <button onClick={this.handleCansel} type="reset" className="btn btn-default">Отмена</button>
                            <button onClick={this.handleEditorSave} className="btn btn-primary">Сохранить</button>
                            <button style={{float: 'right'}} onClick={this.handleListItemDelete} className="btn btn-danger">Удалить</button>
                        </div>
                    </div>
                </fieldset>
            </form>;
        }
        return <div className="container-fluid">
            <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="list-group">
                    <div className="list-group-item">
                        <div className="list-group-item">
                            <input autoFocus={true} value={this._filter} type="text" onChange={this.handleOnFilterChange} className="form-control"
                                   placeholder="Поиск"/>
                        </div>
                        <a style={{textAlign: 'center'}} className="list-group-item"
                           onClick={this.handleAddListItem}>
                            <span style={{color: 'white'}} className="glyphicon glyphicon-plus"/>
                        </a>
                    </div>
                    <div style={{overflowY: 'scroll', maxHeight: '440px'}} className="list-group-item scroll-style-1">
                        {collection}
                    </div>
                </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
                {editorContainer}
            </div>
        </div>;
    }
}

export default KeyValueEditor;