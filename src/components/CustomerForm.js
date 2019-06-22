import React, { Component } from 'react';
import { addToCusList, updateCusItem } from './CustomerFunctions';

class CustomerForm extends Component {

    constructor() {
        super()
        this.state = {
          id: '',
          cus_code: '',
          first_name: '',
          last_name: '',
          phone: '',
          email: '',
          address: ''
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    componentWillMount(){        
        console.log(this.props.itemEdit);
         
        if (this.props.itemEdit) {
            this.setState({id: this.props.itemEdit.id,
                cus_code: this.props.itemEdit.cus_code,
                first_name: this.props.itemEdit.first_name,
                last_name: this.props.itemEdit.last_name,
                phone: this.props.itemEdit.phone,
                email: this.props.itemEdit.email,
                address: this.props.itemEdit.address
                 })
        }
    }  

    componentWillReceiveProps(nextProps){      
            console.log("nextProps.itemEdit"+ nextProps.itemEdit);
            
            if (nextProps.itemEdit) {            
                console.log("ABC: "+ nextProps.itemEdit.id);
                
                this.setState({id: nextProps.itemEdit.itemId,
                    cus_code:nextProps.itemEdit.cus_code,
                    first_name: nextProps.itemEdit.first_name,
                    last_name: nextProps.itemEdit.last_name,
                    phone:nextProps.itemEdit.phone,
                    email: nextProps.itemEdit.email,
                    address: nextProps.itemEdit.address
                })
            }
    }

    onChange=(event)=>{
        const name = event.target.name;
        const value = event.target.value;        
        this.setState({
          [name]:value
        })
    
    }

    onSubmit = e => {
        e.preventDefault()
        
        addToCusList(this.state.cus_code, this.state.first_name, this.state.last_name, this.state.phone, this.state.email, this.state.address).then(() => {
            
        })
        this.setState({  
            id: '',
            cus_code: '',
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            address: '' 
        })  
    }

    onUpdate = e => {
        e.preventDefault()      
        updateCusItem(this.state.cus_code, this.state.first_name, this.state.last_name, this.state.phone, this.state.email, this.state.address, this.state.id).then(() => {
            
        })         
    }

    onSave=(event)=>{                               
        if (this.state.id){        
          this.onUpdate(event)        
        }
        else{           
          this.onSubmit(event)
        }             
        alert("Saving successfully!")
      }

    render() {
        return (
            <div>
                <div className="col-md-12">
                 <div align="center"> 
                    <h1>
                        Customer Form
                    </h1>                                    
                </div>         
                         
                <div className="container">
                    <form>                        
                        <div className="row">
                            <div className="col">                                                                   
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Customer ID</span>
                                    </div>
                                    <input type="text" className="form-control" id="cus_code" name="cus_code"   
                                        onChange={this.onChange.bind(this)}  value={this.state.cus_code || ''} />                                    
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">First Name</span>
                                            </div>
                                            <input type="text" className="form-control" id="first_name" name="first_name" 
                                                 onChange={this.onChange.bind(this)} value={this.state.first_name || ''} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Last Name</span>
                                            </div>
                                            <input type="text" className="form-control" id="last_name" name="last_name"  
                                             onChange={this.onChange.bind(this)} value={this.state.last_name || ''} />
                                        </div>
                                    </div>
                                </div>
                             
                                <div className="row">
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Phone</span>
                                            </div>
                                            <input type="text" className="form-control" id="phone" name="phone"  
                                             onChange={this.onChange.bind(this)} value={this.state.phone || ''}/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Email</span>
                                            </div>
                                            <input type="text"  className="form-control" id="email" name="email" placeholder="john@example.com"  
                                             onChange={this.onChange.bind(this)} value={this.state.email || ''}/>
                                        </div>
                                    </div>                                        
                                </div>    
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Address</span>
                                    </div>
                                    <input type="text"  className="form-control" id="address" name="address"  
                                     onChange={this.onChange.bind(this)} value={this.state.address || ''}/>
                                </div>                              
                            </div>
                        </div>
                        <input type="reset" onClick={(event)=>this.onSave(event)} className="btnNormal" value="Save" />
                    </form>
                </div>                                                                              
            </div>
            </div>
        );
    }
}

export default CustomerForm;