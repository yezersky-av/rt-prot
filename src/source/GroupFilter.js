/**
 * Created by Vizrael on 09.06.2017.
 */
import React, {Component} from 'react';
import TransferController from './TransferController';
// import Mediator from './Mediator'

class GroupFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            department: [],
            financing: [],
            specialization: [],
        };
        this._year = '';
        this._department = 0;
        this._financing = 0;
        this._specialization = 0;
        this._group = [];
    }

    applyFilter() {
        let collection = this.props.group.slice();

        for (let index = collection.length - 1; index >= 0; index--) {
            // console.log(index);
            let item = collection[index];
            let willDelete = false;
            let year = (item.year !== Number(this._year) && this._year !== '');
            let department = (Number(this._department) !== 0 && item.department !== Number(this._department));
            let financing = (Number(this._financing) !== 0 && item.financing !== Number(this._financing));
            let specialization = (Number(this._specialization) !== 0 && item.specialization !== Number(this._specialization));
            if (year || department || financing || specialization) {
                willDelete = true;
            }
            if (willDelete) delete collection[index];
        }
        // console.log(collection);

        if (this.props.getGroup) {
            this.props.getGroup(collection);
        }

    }

    onChangeItemAttribute = (attribute, event) => {
        if (event) {
            let value = event.target.value;
            if (this.hasOwnProperty('_' + attribute)) {
                this['_' + attribute] = value;
                console.log(attribute, this['_' + attribute]);
                this.applyFilter();
            }
        }
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

    componentWillReceiveProps(nextProps) {
        if (this.props.group) {
            if (nextProps.group.length !== this.props.group.length) {
                if (this.props.getGroup) {
                    this.props.getGroup(nextProps.group);
                }
            }
        }
    }

    componentDidMount() {

        if (this.props.group) {
            //if(nextProps.group.length !== this.props.group.length)
            // {
            if (this.props.getGroup) {
                this.props.getGroup(this.props.group);
            }
            // }
        }

        TransferController.send('department', '', {}, (data) => {
            if (data) {
                this.setState({department: data});
            }
        });
        TransferController.send('financing', '', {}, (data) => {
            if (data) {
                this.setState({financing: data});
            }
        });
        TransferController.send('specialization', '', {}, (data) => {
            if (data) {
                this.setState({specialization: data});
            }
        });
    }

    render() {
        if (!this.props.group) {
            return <div className="col-lg-12">
                <div className="alert alert-dismissible alert-danger">
                    <strong>Внимание!</strong> Свойство <strong> group </strong> не установлено
                </div>
            </div>;
        }
        return <div className="col-lg-12">
            <div className="panel panel-info">
                <div className="panel-heading">
                    <h3 className="panel-title">Фильтр групп</h3>
                </div>
                <div className="panel-body">
                    <div style={{padding: "3px 5px"}} className="col-lg-2 col-md-2">
                        <input min={new Date().getFullYear() - 15} max={new Date().getFullYear()} defaultValue=''
                               onChange={this.handleOnChangeYear} className="form-control"
                               type="number" placeholder="Введите год"/>
                    </div>
                    <div style={{padding: "3px 5px"}} className="col-lg-2 col-md-2">
                        <select className="form-control" onChange={this.handleOnChangeDepartment}>
                            <option value="0">Отделение</option>
                            {this.state.department.map((item) => {
                                return <option key={item.id} value={item.id}>{item.label}</option>;
                            })}
                        </select>
                    </div>
                    <div style={{padding: "3px 5px"}} className="col-lg-3 col-md-3">
                        <select className="form-control" onChange={this.handleOnChangeFinancing}>
                            <option value="0">Финансирование</option>
                            {this.state.financing.map((item) => {
                                return <option key={item.id} value={item.id}>{item.label}</option>;
                            })}
                        </select>
                    </div>
                    <div style={{padding: "3px 5px"}} className="col-lg-5 col-md-5">
                        <select className="form-control" onChange={this.handleOnChangeSpecialization}>
                            <option value="0">Специальность</option>
                            {this.state.specialization.map((item) => {
                                return <option key={item.id} value={item.id}>{item.code + ' ' + item.label}</option>;
                            })}
                        </select>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default GroupFilter;