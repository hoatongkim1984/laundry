import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Modal, Button, InputNumber } from 'antd';
import 'antd/es/modal/style/index.css';
import 'antd/dist/antd.css';

import TableCustomer from './TableCustomer';
import TableProduct from './TableProduct';
import CustomerList from './CustomerList';
import { getCustomerByCODE } from './CustomerFunctions';
import { getProductByCODE } from './ProductFunctions';
import {getOrderHeaderByOrderNo, getMaxOrderHeaderNo, addToOrderHeaderList, deleteOrderHeaderItem, updateOrderHeaderItem} from './OrderheaderFunctions';
import {getOrderDetailByOrderNo, addToOrderDetailList, deleteOrderDetailItemByOrderNo, deleteOrderDetailItem, updateOrderDetailItem} from './OrderdetailFunctions';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { getList } from './ListFunctions';
import { log } from 'util';

class InvoiceForm extends Component {

    constructor(props) {
        super(props); 
       
        this.state = {
            showSearchCustomer: false,
            showSearchProduct: false,
            id:null,
            orderno:1,
            orderdisplay:'0000001',
            orderdate: new Date().toISOString().substring(0, 10),
            cus_id:null,
            cus_code:'',
            fullname:'',
            phone:'',
            email:'',
            pro_id:null,
            pro_code:'',
            pro_name:'',
            pro_current_price:0,
            pro_qty:0,
            pro_amount:0,
            is_type:0,
            pro_type:0,            
            pro_type_list: [],
            item_list:[],
            item_del_list:[],
            total_OrderAmount:0,
            total_OrderQty:0,
            orderDiscount:0,
            orderTotal:0,
            orderBalance:0
          };    
          this.onSubmit = this.onSubmit.bind(this)
          this.onChange = this.onChange.bind(this);    
          this._handleKeyPress = this._handleKeyPress.bind(this);
          this._getOrderNoAuto();
      }
    
    _getOrderNoAuto=()=>{
        var no = 1;
        getMaxOrderHeaderNo().then(data => {                                        
          if (data) { 
              no = data.maxValue + 1                                
              this.setState({
                  orderno:no,
                  orderdisplay:(no).toLocaleString('en-US', {minimumIntegerDigits: 7, useGrouping:false})
              })                
          }
        });   
    }

    onClickSearchCustomer(){                
          this.setState({showSearchCustomer: true})
    }
   
    onClickSearchProduct(){                
        this.setState({showSearchProduct: true})
    }

    componentDidMount() {
        // console.log(this.refs);
        // console.log(this.refs[9]);
        // console.log(this.refs[10]);
                  
        for (let x in this.refs) {
            this.refs[x].onkeypress = (e) => 
              this._handleKeyPress(e, this.refs[x]);
          }
        this.refs[1].focus();        

        getList().then(data => {
            this.setState(
              {               
                pro_type_list: [...data]
              },
            )
          });                         
      }

      setDataInit = () => {
        this.setState({  
            id: '',            
            orderdate: new Date().toISOString().substring(0, 10),
            cus_id: '',
            cus_code: '',
            fullname: '',
            phone:'',
            email:'',                                  
            pro_id:null,
            pro_code:'',
            pro_name:'',
            pro_current_price:0,
            pro_qty:0,
            pro_amount:0,
            is_type:0,
            pro_type:0,                    
            item_list:[],
            total_OrderAmount:0,
            total_OrderQty:0,
            orderDiscount:0,
            orderTotal:0,
            orderBalance:0

        })    
        this.refs[1].focus();
        
      }
    handleCloseShowSearchCustomer(){
        this.setState({showSearchCustomer: false})
    }

    handleCloseShowSearchProduct(){
        this.setState({showSearchProduct: false})
    }

    _resultReceiveCustomerFunction(record){        
        this.setState(
            {
                showSearchCustomer:false,       
                cus_id: record.id,          
                cus_code:record.cus_code,
                fullname:record.first_name+" " + record.last_name,
                phone:record.phone,
                email:record.email
        })        
    }

    _resultReceiveProductFunction(record){        
        this.setState(
            {                
                showSearchProduct:false,
                pro_id:record.id,
                pro_code:record.pro_code,
                pro_name:record.pro_name,
                pro_current_price:record.pro_current_price,
                is_type:record.is_type
        })        
    }

    onChange_antd = (value) => {        
        this.setState({
            orderDiscount:value
          })  
      }

    onChange=(event)=>{        
        const name = event.target.name;
        const value = event.target.value;    
        this.setState({
            [name]:value
          })          
          
        if(event.target.name=="orderDiscount"){            
            var num = this.state.total_OrderAmount - value                    
            this.setState({
                orderTotal:num
                })             
        }     
        if(event.target.name=="orderno"){     
            this.setDataInit();

            var orderno = value*1
            var s =(orderno).toLocaleString('en-US', {minimumIntegerDigits: 7, useGrouping:false})                       
            this.setState({
                orderdisplay:s,
                id:null
              })     
            
            getOrderHeaderByOrderNo(orderno).then(data => {                                                
                if (data && data.length > 0) {    
                    getCustomerByCODE(data[0].cusCode).then(dataCus => {
                        if (dataCus && dataCus.length > 0) {                              
                          this.setState({                                  
                              phone: dataCus[0].phone,
                              email: dataCus[0].email
                          })
                        }
                      })                                                 
                    this.setState({
                        id:data[0].id,
                        orderdate: data[0].orderdate,
                        cusId: data[0].cusId,
                        cus_code: data[0].cusCode,
                        fullname: data[0].cusName,                                                                
                        total_OrderQty:data[0].orderQty,
                        total_OrderAmount:data[0].orderAmount,
                        orderDiscount:data[0].orderDiscount,
                        orderTotal:data[0].orderTotal,
                        orderBalance:data[0].orderBalance,
                    })                    
                     getOrderDetailByOrderNo(orderno).then(dataDetail => {
                        var list = [];
                        if (dataDetail && dataDetail.length > 0) {                             
                            for(let idx=0; idx < dataDetail.length; idx ++){
                                var obj_itemdetail = []
                                obj_itemdetail.id = dataDetail[idx].id;                                    
                                obj_itemdetail.item_id = idx;
                                obj_itemdetail.orderid = dataDetail[idx].orderId;
                                obj_itemdetail.orderno = dataDetail[idx].orderNo;
                                obj_itemdetail.pro_id = dataDetail[idx].proId;
                                obj_itemdetail.pro_code = dataDetail[idx].proCode;
                                obj_itemdetail.pro_name = dataDetail[idx].proName;
                                obj_itemdetail.pro_qty = dataDetail[idx].proQty;
                                obj_itemdetail.pro_amount = dataDetail[idx].proAmount;                    
                                obj_itemdetail.pro_type = dataDetail[idx].typeId;                                                                                                                                 
                                list.push(obj_itemdetail);
                            }                                                                   
                        }
                        this.setState({
                            item_list:[...list]
                        })        
                        this._getTotalItemList();
                     })
                }                
            })           
        }        

        if(event.target.name=="cus_code"){
            event.preventDefault();
            getCustomerByCODE(event.target.value).then(data => {
              if (data && data.length > 0) {                              
                this.setState({
                    cus_id:data[0].id,
                    fullname: data[0].first_name + " " + data[0].last_name,
                    phone: data[0].phone,
                    email: data[0].email
                })
              }
            })            
        }   
        
        if(event.target.name=="pro_code"){
            event.preventDefault();
            getProductByCODE(event.target.value).then(data => {
              if (data && data.length > 0) {                              
                this.setState({
                    pro_id:data[0].id,
                    pro_name: data[0].pro_name ,
                    pro_current_price: data[0].pro_current_price,                    
                    is_type: data[0].is_type
                })
                if (this.state.is_type ===1 && this.state.pro_type_list.length>0){
                    this.setState({
                        pro_type:this.state.pro_type_list[0].id
                    })
                }
              }
            })            
        }               
    }

    onSave = (event) =>{                            
        event.preventDefault() 
                
        if (this.state.id){        
            this.onUpdate(event)        
          }
          else{           
            this.onSubmit(event)
          }                    
      }    


    onSubmit = (e) => {
        e.preventDefault();   
        var ispaid = 0;
        confirmAlert({
            title: 'Paid or Not',
            message: 'Is This Order Paid?',
            buttons: [
              {label: 'Yes', onClick: () => {
                ispaid = 1;
                this.addOrderWithBalance(ispaid);
              }},
              {label: 'No', onClick: () => {
                  this.addOrderWithBalance(ispaid);
              }}
            ]
          });                                           
    }

    addOrderWithBalance=(ispaid) => {
        var orderid = null;
        var balance = 0;
        if(ispaid===0){
            balance = this.state.orderTotal                        
        }
        this.setState({
            orderBalance : balance
        })
        addToOrderHeaderList(this.state.orderno, this.state.orderdate, this.state.cus_id, this.state.cus_code,
             this.state.fullname, this.state.total_OrderQty, this.state.total_OrderAmount, this.state.orderDiscount, 
             this.state.orderTotal, balance).then((data) => { 
                orderid = data.id                
                for (let index = 0; index < this.state.item_list.length; index++) {
                    var obj_detail = this.state.item_list[index];
                    addToOrderDetailList(orderid, this.state.orderno, obj_detail.pro_id, obj_detail.pro_code
                        , obj_detail.pro_name, obj_detail.pro_qty, obj_detail.pro_amount, obj_detail.pro_type)
                }
                this.setDataInit();      
                this._getOrderNoAuto();         
        })  
    }
   
    onUpdate = (e) => {
        e.preventDefault();                    
        if (this.state.orderBalance > 0){
            var ispaid = 0;
            confirmAlert({
                title: 'Paid or Not',
                message: 'Is This Order Paid?',
                buttons: [
                  {label: 'Yes', onClick: () => {
                    ispaid = 1;
                    this.updateOrderwithBalance(ispaid);
                  }},
                  {label: 'No', onClick: () => {
                      this.updateOrderwithBalance(ispaid);
                  }}
                ]
              });  
        }else{
            this.updateOrderwithBalance(1);
        }
                       
    }    

    updateOrderwithBalance = (ispaid) => {
        var balance = 0;
        if(ispaid===0){
            balance = this.state.orderTotal;            
        }       
        updateOrderHeaderItem(this.state.orderno, this.state.orderdate, this.state.cus_id, this.state.cus_code,
             this.state.fullname, this.state.total_OrderQty, this.state.total_OrderAmount, this.state.orderDiscount,
             this.state.orderTotal, balance, 
             this.state.id).then((data) => {                 
                for (let index = 0; index < this.state.item_list.length; index++) {
                    var obj_detail = this.state.item_list[index];
                    if (obj_detail.id){
                        updateOrderDetailItem(this.state.id, this.state.orderno, obj_detail.pro_id, obj_detail.pro_code
                            , obj_detail.pro_name, obj_detail.pro_qty, obj_detail.pro_amount, obj_detail.pro_type, obj_detail.id)
                    }
                    else{
                        addToOrderDetailList(this.state.id, this.state.orderno, obj_detail.pro_id, obj_detail.pro_code
                            , obj_detail.pro_name, obj_detail.pro_qty, obj_detail.pro_amount, obj_detail.pro_type)
                    }                    
                }               
                for (let index = 0; index < this.state.item_del_list.length; index++) {
                    deleteOrderDetailItem(this.state.item_del_list[index]);
                }
                //this.setDataInit();      
                //this._getOrderNoAuto();  
                this.setState({
                    orderBalance : balance
                })       
                alert("Saving successfully!");
                
        })     
    }

    onDelete = (val, e) => {
        e.preventDefault()
        if(val){
            deleteOrderHeaderItem(val).then((data)=>{
                deleteOrderDetailItemByOrderNo(val).then((data)=>{
                    this.setDataInit();
                    this._getOrderNoAuto();
                    alert("Deleting successfully!")
                })    

            }) 
        }                      
    }

    onDeleteItem = (item_id, id, e) => {
        e.preventDefault();
       
        if(this.state.id){
            var list = [...this.state.item_del_list];
            list.push(id);
            this.setState({
                item_del_list:[...list]
            })
        }
        
        for (let index = 0; index < this.state.item_list.length; index++) {
            if(this.state.item_list[index].item_id===item_id){                
                var array = [...this.state.item_list]; 
                         
                array.splice(index, 1);
                this.setState({
                    item_list: array
                });              
                var total=0;
                var qty=0;
                for (let index = 0; index < array.length; index++) {
                    total+=array[index].pro_amount*1;
                    qty+=array[index].pro_qty*1;
                }
                this.setState({
                    total_OrderAmount:total,
                    total_OrderQty:qty,
                    orderTotal:total-this.state.orderDiscount
                })        
                break;         
            }
        }                  
      }
     
    _handleKeyPress(e, field) {  
        
        if(e.keyCode==43){
            this.refs[4].focus();
            this.setState({
                pro_code:''
            })        
            this.refs[4].value="";
            
        }
                 
        if (e.keyCode === 13) {
            
            
            e.preventDefault(); // Prevent form submission if button present                              
            var namectr=field.name;
            var maxlength =  Object.keys(this.refs).length ;                      
            
            if(namectr===this.refs[maxlength].name){
                this.refs[1].focus();
            }
            else
            {
                for (let x in this.refs) {
                    if(this.refs[x].name===namectr){    
                        var n = x*1+1;
                        if(this.refs[n].disabled){
                            x++;
                            namectr=this.refs[x].name;                            
                        }
                        else{
                            this.refs[n].focus();
                            break;
                        }                                                         
                    }                        
                }  
            }                      
        }
      }

    _getTotalItemList=()=>{
          var total=0;
          var qty=0;
        for (let index = 0; index < this.state.item_list.length; index++) {
            total+=this.state.item_list[index].pro_amount*1;
            qty+=this.state.item_list[index].pro_qty*1;
        }
        this.setState({
            total_OrderAmount:total,
            total_OrderQty:qty,
            orderTotal:total - this.state.orderDiscount
        })        
      }

     _addProductToList=(event)=>{                
        var obj_itemdetail = []
        obj_itemdetail.id = null;        
        
        var maxidx = 1;
        if(this.state.item_list.length > 0){
            maxidx = this.state.item_list[this.state.item_list.length-1].item_id + 1;
        } 

        obj_itemdetail.item_id = maxidx;
        obj_itemdetail.orderno = this.state.orderno;
        obj_itemdetail.pro_id = this.state.pro_id;
        obj_itemdetail.pro_code = this.state.pro_code;
        obj_itemdetail.pro_name = this.state.pro_name;
        obj_itemdetail.pro_qty = this.state.pro_qty*1;
        obj_itemdetail.pro_amount = this.state.pro_qty*this.state.pro_current_price;

        if (this.state.is_type ===1){
            obj_itemdetail.pro_type = this.state.pro_type;
        }
        else{
            obj_itemdetail.pro_type = 0;
        }

        var list = this.state.item_list;
        list.push(obj_itemdetail);

        this.setState({
            item_list:[...list]
        })        
        this._getTotalItemList();
     }

     handleSelect= (choice) => {
        // returns choice.value and choice.index
        if (choice.index>=0) {
          //this.setState({cityText: choice.value + ' is a nice choice'});
        } else {
          //this.setState({cityText: choice.value + ' isn\'t on the list!'});
        }
      }
     
    render() {
        const showBalance = (
            <div class="row">
                <div class="col">

                </div>
                <div class="col">
                    <div className="input-group mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><b>BALANCE: </b></span>
                        </div>
                        <input type="number" className="form-control" name="orderBalance"                                   
                        value={this.state.orderBalance} disabled
                        />                                                                              
                    </div>                                  
                </div>
            </div> 
        )
                     
        return (            
            <div className="col-md-12">
                 <div align="center"> 
                    <h1>
                    Order Form
                    </h1>                
                </div>                                        
                <div className="container">
                    <form>
                    <br/>
                        <div className="row">
                            <div className="col">
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Order No</span>
                                    </div>                                    
                                    <input type="text" className="form-control" name="orderno" ref="1"
                                     value={this.state.orderno} 
                                     onChange={this.onChange.bind(this)}/>
                                      <div className="input-group-append">
                                        <span className="input-group-text" style={{'width':'100px' , 'float':'right'}}>
                                            {this.state.orderdisplay} 
                                        </span>
                                    </div>                                       
                                </div>                               
                            </div>
                            <div className="col">
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Order Date</span>
                                    </div>
                                    <input type="date" className="form-control" name="orderdate" ref="2" 
                                    value={this.state.orderdate} />                                           
                                </div>                            
                            </div>
                        </div>                                                                            
                        <div className="row">
                            <div className="col">                                
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Customer ID</span>
                                    </div>
                                     {/* defaultValue={this.props.lookupText} */}
                                    {/* <DropdownInput
                                        menuClassName='dropdown-input'
                                        onSelect={this.handleSelect}                                       
                                        placeholder='Choose a city...'
                                        options={this.state.pro_type_list}
                                        max={12}
                                    /> */}
                                    <input type="text" className="form-control" name="cus_code" ref="3"   
                                        value={this.state.cus_code} 
                                        onChange={this.onChange.bind(this)} 
                                        />
                                    <input type="button" className="form-control" name="searchCustomer" onClick={this.onClickSearchCustomer.bind(this)} value="Search"/>
                                    <Modal
                                        title="Choose a customer"
                                        visible={this.state.showSearchCustomer} 
                                        footer ={null}       
                                        onCancel={this.handleCloseShowSearchCustomer.bind(this)}                                        
                                        >
                                        <TableCustomer resultReceiveFunction = {this._resultReceiveCustomerFunction.bind(this)}></TableCustomer>
                                    </Modal>                                                                                                                    
                                </div>
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Full Name</span>
                                    </div>
                                    <input type="text" className="form-control" id="fullname" name="fullname" disabled value={this.state.fullname|| ''} />
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Phone</span>
                                            </div>
                                            <input type="text" className="form-control" id="phone" name="phone" disabled value={this.state.phone|| ''}/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Email</span>
                                            </div>
                                            <input type="text"  className="form-control" id="email" name="email" placeholder="john@example.com" disabled value={this.state.email|| ''}/>
                                        </div>
                                    </div>                                        
                                </div>                                   
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col">                                
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Product ID</span>
                                    </div>
                                    <input type="text" className="form-control" id="pro_code" name="pro_code" ref="4" placeholder="PRO ..." 
                                        value={this.state.pro_code|| ''}
                                        onChange={this.onChange.bind(this)} 
                                    />
                                    <input type="button" className="form-control" name="searchProduct" onClick={this.onClickSearchProduct.bind(this)} value="Search"/>
                                    
                                    <Modal
                                        title="Choose a product"
                                        visible={this.state.showSearchProduct} 
                                        footer ={null}       
                                        onCancel={this.handleCloseShowSearchProduct.bind(this)}
                                        >
                                        <TableProduct resultReceiveFunction = {this._resultReceiveProductFunction.bind(this)}></TableProduct>
                                    </Modal>                                                                                                                    
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Name</span>
                                        </div>
                                        <input type="text" className="form-control" id="pro_name" name="pro_name" disabled value={this.state.pro_name|| ''}/>
                                    </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Price</span>
                                            </div>
                                            <input type="text" className="form-control" id="pro_current_price" name="pro_current_price" value={this.state.pro_current_price|| ''} />
                                        </div>
                                    </div>                                        
                                </div>  
                                
                                <div className="row">
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Quality</span>
                                            </div>
                                            <input type="text" className="form-control" id="pro_qty" name="pro_qty" ref="5"   
                                            value={this.state.pro_qty}                                          
                                            onChange={this.onChange.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Amount</span>
                                            </div>
                                            <input type="text"  className="form-control" id="pro_amount" name="pro_amount" disabled 
                                            value={this.state.pro_current_price * this.state.pro_qty}/>
                                        </div>
                                    </div>                                        
                                </div>   

                                <div className="row">
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Type</span>
                                            </div>                                            
                                            <select className="form-control" id="pro_type" name="pro_type" ref="6" 
                                            value={this.state.pro_type}
                                            disabled = {this.state.is_type===0 ? true : false } 
                                            onChange={this.onChange.bind(this)}
                                            
                                            >
                                            {this.state.pro_type_list.map((item, index) => (
                                                <option value={item.id}>{item.task_name}</option>
                                            ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-group mb-2" >
                                            <div className="input-group-prepend">
                                                
                                            </div>
                                            <input type="button" className="form-control" name="addtoList" ref="7" onClick={(event)=>this._addProductToList(event)} value="Add product to List"/>                
                                            {/* <span className="input_Search float-right" onClick={(event)=>this._addProductToList(event)} >Add product to List</span>   */}
                                        </div>
                                                                                
                                    </div>
                                </div>
                            </div>
                        </div>                                                                                                                                                                                 
                        <div className="row">
                            <table className="tabletest4">
                                <tbody>
                                <tr>
                                    <th style={{'width':'20%'}}>QTY</th>
                                    <th >PRODUCT</th>
                                    <th style={{'width':'20%'}}>AMOUNT</th>
                                    <th style={{'width':'10%'}}></th>
                                </tr>
                                {
                                    
                                    this.state.item_list.map((item, index) => (
                                <tr>
                                    <td><span className="price">{item.pro_qty}</span></td>
                                    <td>{item.pro_name}</td>
                                    <td><span className="price">${item.pro_amount}</span></td>
                                    <td>
                                        <div className="btn-group float-right">
                                            {/* <button className="btn btn-outline-info" >Sửa</button> */}
                                            <button className="btn btn-outline-secondary" onClick={this.onDeleteItem.bind(this,item.item_id, item.id)}>Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                                ))}                               
                                <tr style={{'background-color': '#685454'}}>
                                    <td><span className="price" style={{color: 'black'}}>{this.state.total_OrderQty}</span></td>
                                    <td><b>Total List</b></td>
                                    <td><span className="price" style={{color: 'black'}}><b>${this.state.total_OrderAmount}</b></span></td>
                                    <td></td>
                                </tr>                                    
                                </tbody>
                            </table>
                        </div>   
                        <div class="row">
                            <div class="col">

                            </div>
                            <div class="col">
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Discount: $ </span>
                                    </div>                                  
                                    <InputNumber 
                                    value={this.state.orderDiscount} 
                                    min={0}
                                    max={100}
                                    formatter={value => `${value}%`}
                                    parser={value => value.replace('%', '')}
                                    onChange={this.onChange_antd.bind(this)}                                    
                                    />
                                    {/* <input type="number" className="form-control" name="orderDiscount" ref="8"                                     
                                    value={this.state.orderDiscount} 
                                    onChange={this.onChange.bind(this)}/>                                            */}
                                </div>  
                            </div>
                        </div>         
                        <div class="row">
                            <div class="col">

                            </div>
                            <div class="col">
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><b>TOTAL ORDER: </b></span>
                                    </div>
                                    <input type="number" className="form-control" name="orderTotal"                                   
                                    value={this.state.orderTotal} disabled
                                    />                                                                              
                                </div>  
                            </div>
                        </div>  
                       {(this.state.id!==null) ? showBalance:''}
                                                 
                        {/* <div class="row">
                            <div class="col">

                            </div>
                            <div class="col">
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><b>Is Paid ? </b></span>
                                    </div>
                                    <input type="checkbox" className="form-control" name="ordPaid" 
                                    value={this.state.pro_type}
                                    checked = {this.state.is_type===0 ? true : false } 
                                    onChange={this.onChange.bind(this)}
                                    />                                                                              
                                </div>  
                            </div>
                        </div>     */}

                        <div class="row">
                            <div class="col">
                                <input type="button" className="form-control" name="btnLuu" ref="8" onClick={(event)=>this.onSave(event)} value="Save"/>                        
                            </div>
                            <div class="col">
                                <input type="button" className="form-control" name="btnDelete" ref="9" onClick={(event)=>this.onDelete(this.state.id, event)} value="Delete"/>                         
                            </div>
                        </div>                                               
                    </form>
                </div>                                                                              
            </div>
        );
    }
}

export default InvoiceForm;

