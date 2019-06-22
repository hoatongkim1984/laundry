import React, { Component } from 'react';
import { getCustomerList, deleteCusItem } from './CustomerFunctions';
import CustomerForm from './CustomerForm';
import { Modal, Button } from 'antd';
import 'antd/es/modal/style/index.css';

class CustomerList extends Component {
    constructor() {
        super()
        this.state = {   
            showCustomerForm: false,
            showEditCustomerForm: false,            
            items: [],
            itemEdit: null
        }       
    }

    onClickCustomerForm(){                
        this.setState({showCustomerForm: true})
    }

    handleCloseShowCustomerForm(){
        this.setState({
            showCustomerForm: false,
            showEditCustomerForm:false
        })
        this.getAll();
    }

      componentDidMount() {
        this.getAll()
      }

     getAll = () => {
        getCustomerList().then(data => {
            // console.log("CUSTOMER:" );
            // console.log(data);            
            if(data){
                this.setState(
                    {              
                    items: [...data]
                    },
                    () => {
                    console.log(this.state.items)
                    }
                )
            }
            
        })
        //console.log( this.state.items);
        
      }

    onEdit = (item) => {             
        this.setState({
            showEditCustomerForm: true,
            itemEdit: {...item}
        })
        console.log(this.state.itemEdit);        
      }
      

    onDelete = (val, e) => {
        e.preventDefault()
        deleteCusItem(val).then(() => {
          this.getAll()
        })
      }

    render() {
        return (
            <div>
                <div align="center"> 
                    <h1>
                        Customer Managment
                    </h1>     
                    <div className="float-right">                   
                        <button className="btnNormal" onClick={this.onClickCustomerForm.bind(this)}>Add New Customer</button>                    
                    </div>
                        <Modal
                        title="Add New Customer" 
                        visible={this.state.showCustomerForm}                        
                        footer ={null}       
                        onCancel={this.handleCloseShowCustomerForm.bind(this)}
                        width={'50%'}
                        >
                        <CustomerForm></CustomerForm>
                    </Modal>      
                </div>                            
                <br/> <br/><br/>                                                                            
                <div className="container">
                    <Modal
                        title="Edit Customer" 
                        visible={this.state.showEditCustomerForm}                        
                        footer ={null}       
                        onCancel={this.handleCloseShowCustomerForm.bind(this)}
                        width={'50%'}
                        >
                        <CustomerForm itemEdit={this.state.itemEdit}></CustomerForm>
                    </Modal>
                    
                    <div id="noteList" role="tablist" aria-multiselectable="true">
                        {this.state.items.map((item, index) => (
                        <div className="card"  >
                            <div className="card-header" role="tab" id="note1"  >
                                <h5 className="mb-0">
                                    <div className="btn-group float-left" >
                                        <a data-toggle="collapse" data-parent="#noteList" href={"#number"+index} aria-expanded="true" aria-controls="noteContent1">
                                        {item.cus_code + ": " + item.first_name + " " + item.last_name + " - " + item.phone}
                                        </a>
                                    </div>
                                    <div className="btn-group float-right" >
                                        <button className="btnNormal" 
                                            onClick={()=>this.onEdit(item)}>Sửa</button> 
                                            &nbsp;                                       
                                        <button className="btnNormal" 
                                            onClick={this.onDelete.bind(this, item.id)}>Xóa</button>
                                    </div>
                                </h5>
                            </div>
                            <div id={"number"+index} className="collapse in" role="tabpanel" aria-labelledby="note1">
                                <div className="card-body">
                                    <b>Customer code: </b> {item.cus_code}  <br/>
                                    <b>Full name: </b>{item.first_name + " " + item.last_name} <br/>
                                    <b>Phone: </b>{item.phone} <br/>
                                    <b>Email: </b>{item.email} <br/>
                                    <b>Address: </b>{item.address} <br/>                                
                                </div>                                                                                          
                            </div>
                        </div>        
                        ))}
                    </div>
                </div>  
            </div>
        );
    }
}

export default CustomerList;