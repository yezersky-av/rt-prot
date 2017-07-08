/**
 * Created by Vizrael on 07.06.2017.
 */
import React, {Component} from 'react';
import GroupFilter from './GroupFilter';
import TransferController from './TransferController';
import Mediator from './Mediator'

class GroupEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: [],
            department: [],
            financing: [],
            specialization: [],
            edit: null,
            add: false
        };
        this._group = [];
    }

    getGroup = (group) => {
        if (group) {
            this.setState({collection: group});
        }
    }

    componentWillMount() {
        Mediator.publishEvent('app/loading', true);
        TransferController.send('group', '', {}, (data) => {
            if (data) {
                this._group = data;
            }
            Mediator.publishEvent('app/loading', false);
        });
    }

    componentDidMount() {
        //Mediator.publishEvent('app/loading', true);
        Promise.all([

            TransferController.send('department', '', {}, (data) => {
                if (data) {
                    this.setState({department: data});
                }
            }),
            TransferController.send('financing', '', {}, (data) => {
                if (data) {
                    this.setState({financing: data});
                }
            }),
            TransferController.send('specialization', '', {}, (data) => {
                if (data) {
                    this.setState({specialization: data});
                }
            })
        ]).then(() => {
            //Mediator.publishEvent('app/loading', false);
        });
        /*TransferController.send('group','',{},(data)=>{
         if(data)
         {
         this.setState({collection: data});
         }
         });*/
        /*
         TransferController.send('department','',{},(data)=>{
         if(data)
         {
         this.setState({department: data});
         }
         });
         TransferController.send('financing','',{},(data)=>{
         if(data)
         {
         this.setState({financing: data});
         }
         });
         TransferController.send('specialization','',{},(data)=>{
         if(data)
         {
         this.setState({specialization: data});
         }
         });
         */
    }

    handleListItemClick = (index, event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log(index, 'click');
    }

    handleListItemDelete = (event) => {
        event.stopPropagation();
        event.preventDefault();

        TransferController.send('group', 'delete', {id: this.state.edit.id}, (data) => {

            let index = this._group.findIndex((element, index, array) => {
                return (element.id === this.state.edit.id);
            });

            if (index !== -1) {
                // collection[index] = data;
                let collection = this._group;
                delete collection[index];
                this.handleCansel();
            }
        });
    }
    /*
     {
     event.stopPropagation();
     event.preventDefault();
     Mediator.publishEvent('app/loading', true);
     TransferController.send('group', 'delete', {id: this.state.collection[index]}, (data) => {
     //if(data)
     {
     let collection = this.state.collection;
     delete collection[index];
     this.setState({collection: collection});
     Mediator.publishEvent('app/loading', false);
     }
     });

     }
     */

    handleListItemEdit = (index, event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log(index, 'Edit');
        let item = Object.assign({}, this.state.collection[index]);
        this.setState({edit: item});
    }

    handleEditorSave = (event) => {
        event.stopPropagation();
        event.preventDefault();

        let action = 'update';
        if (this.state.add) {
            action = 'add';
        }
        TransferController.send('group', action, this.state.edit, (data) => {
            let collection = this.state.collection;
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
                collection.unshift(data);
            }
            this.setState({collection: collection});
            // console.log(action,data);
            this.handleCansel();
        });
    }

    handleCansel = () => {
        this.setState({edit: null, add: false});
    }

    onChangeItemAttribute = (attribute, event) => {
        let value = event.target.value;
        let item = this.state.edit;
        if (item.hasOwnProperty(attribute)) {
            item[attribute] = value;
            this.setState({edit: item});
        }
    }

    handleOnChangeCode = (event) => {
        this.onChangeItemAttribute('code', event);
    }

    handleOnChangeDuration = (event) => {
        this.onChangeItemAttribute('duration', event);
    }


    handleOnChangeYear = (event) => {
        this.onChangeItemAttribute('year', event);
    }

    handleOnChangeDepartment = (event) => {
        this.onChangeItemAttribute('department', event);
    }

    handleOnChangeFinancing = (event) => {
        this.onChangeItemAttribute('financing', event);
    }

    handleOnChangeSpecialization = (event) => {
        this.onChangeItemAttribute('specialization', event);
    }

    handleAddListItem = () => {
        this.setState({
            edit: {
                id: null,
                code: '',
                year: new Date().getFullYear(),
                department: 1,
                duration: 4,
                financing: 1,
                specialization: 1,
            }, add: true
        });
    }


    render() {
        const ListItem = (props) => {
            let classes = "list-group-item";
            // console.log(this);
            if (this.state.edit && this.state.edit.id === props.id) {
                classes += ' active';
            }
            return <a style={{wordSpacing: '3px'}} className={classes} onClick={props.click}>
                {props.label}
            </a>;
        };
        let collection = this.state.collection.map((item, index) => {
            return <ListItem key={item.id} id={item.id} label={item.code}
                             click={(event) => this.handleListItemEdit(index, event)}
                             edit={(event) => this.handleListItemEdit(index, event)}
                             delete={(event) => this.handleListItemDelete(index, event)}/>;
        });

        let editorContainer = null;
        if (this.state.edit) {
            editorContainer = <form className="form-horizontal">
                <fieldset>
                    {/*<legend>{this.state.edit.code}</legend>*/}
                    <div className="form-group">
                        <label htmlFor="inputCode" className="col-lg-3 control-label">Код</label>
                        <div className="col-lg-9">
                            <input autoFocus={true} type="text" className="form-control" id="inputCode"
                                   placeholder="Код группы"
                                   onChange={this.handleOnChangeCode} value={this.state.edit.code}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputLabel" className="col-lg-3 control-label">Год поступления</label>
                        <div className="col-lg-9">
                            <input type="number" className="form-control" id="inputLabel" placeholder="Год поступления"
                                   onChange={this.handleOnChangeYear} value={this.state.edit.year}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputLabel" className="col-lg-3 control-label">Срок обучения (семестров)</label>
                        <div className="col-lg-9">
                            <input min="1" max="10" type="number" className="form-control" id="inputLabel"
                                   placeholder="Срок обучения (семестров)"
                                   onChange={this.handleOnChangeDuration} value={this.state.edit.duration}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="select" className="col-lg-3 control-label">Отделение</label>
                        <div className="col-lg-9">
                            <select value={this.state.edit.department} onChange={this.handleOnChangeDepartment}
                                    className="form-control" id="select">
                                {this.state.department.map((item, index) => {
                                    return <option key={item.id} value={item.id}>{item.label}</option>;
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="select" className="col-lg-3 control-label">Финансирование</label>
                        <div className="col-lg-9">
                            <select value={this.state.edit.financing} onChange={this.handleOnChangeFinancing}
                                    className="form-control" id="select">
                                {this.state.financing.map((item, index) => {
                                    return <option key={item.id} value={item.id}>{item.label}</option>;
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="select" className="col-lg-3 control-label">Специализация</label>
                        <div className="col-lg-9">
                            <select value={this.state.edit.specialization} onChange={this.handleOnChangeSpecialization}
                                    className="form-control" id="select">
                                {this.state.specialization.map((item, index) => {
                                    return <option key={item.id}
                                                   value={item.id}>{item.code + ' ' + item.label}</option>;
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-lg-9 col-lg-offset-2">
                            <button onClick={this.handleCansel} type="reset" className="btn btn-default">Отмена</button>
                            <button onClick={this.handleEditorSave} className="btn btn-primary">Сохранить</button>
                            <button style={{float: 'right'}} onClick={this.handleListItemDelete}
                                    className="btn btn-danger">Удалить
                            </button>
                        </div>
                    </div>
                </fieldset>
            </form>;
        }
        return <div className="row">
            <div className="row">
                <GroupFilter group={this._group} getGroup={this.getGroup}/>
            </div>
            <div className="row">
                <div className="col-lg-2 col-md-3 col-sm-12">
                    <div className="list-group">
                        <div className="list-group-item">
                            <a style={{textAlign: 'center'}} className="list-group-item"
                               onClick={this.handleAddListItem}>
                                <span style={{color: 'white'}} className="glyphicon glyphicon-plus"/>
                            </a>
                        </div>
                        <div style={{overflowY: 'scroll', maxHeight: '440px'}}
                             className="list-group-item scroll-style-1">
                            {collection}
                        </div>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-sm-12">
                    {editorContainer}
                </div>
            </div>
        </div>;
    }
}

export default GroupEditor;