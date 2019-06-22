import React, { Component } from 'react';
import { getProductList } from './ProductFunctions';
import { deleteItem } from './ListFunctions';
import {getCustomerList, getCustomerById} from './CustomerFunctions';
import { getList} from './ListFunctions';
import CustomerForm from './CustomerForm';
import {getMaxOrderHeaderNo, addToOrderHeaderList, getOrderHeaderByOrderNo
      , deleteOrderHeaderItem, updateOrderHeaderItem} from './OrderheaderFunctions';
import {addToOrderDetailList, getOrderDetailByOrderNo, deleteOrderDetailItem
      , deleteOrderDetailItemByOrderNo, updateOrderDetailItem} from './OrderdetailFunctions';
import {exportPDF } from './ExportFunction';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { Modal, InputNumber, Select, DatePicker } from 'antd';
import 'antd/es/modal/style/index.css';
import 'antd/dist/antd.css';

import Popup from "reactjs-popup";
import moment from 'moment';

const BASE_URL = 'http://localhost:5000/';

const Option = Select.Option;
const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }

class OrderForm extends Component {
  
  constructor(props) {
    super(props); 
    
    this.state = {        
        product_list:[] ,
        showCustomerForm: false,
        showEditCustomerForm: false, 
        orderNo:1,
        orderdisplay:'0000001',
        id:null,        
        dtOrder:new Date().toLocaleDateString('en-US', DATE_OPTIONS),
        orderDate: new Date().toISOString().substring(0, 10),        
        pickingDate: moment(new Date().setHours(16,0,0)).add(2, 'd'),
        selectedItems: [],  
        customer_List:[],
        protype_List:[],
        dropdownOpen:false,
        cusSelected:null,
        orderDiscount:0,
        orderPaid:0       
      };        
      this._getOrderNoAuto();                 
  }

  componentDidMount() {
    this.getAll()
  }  

  clearData = () => {
    this.setState({                       
      dtOrder:new Date().toLocaleDateString('en-US', DATE_OPTIONS),
      orderDate: new Date().toISOString().substring(0, 10),
      pickingDate: moment(new Date().setHours(16,0,0)).add(2, 'd'),
      cusSelected:null,
      orderDiscount:0 ,
      selectedItems: [],                                  
      orderBalance:0      
  })
  }
  _getOrderNoAuto=()=>{
    var no = 1;
    getMaxOrderHeaderNo().then(data => {                                        
      if (data) { 
          no = data.maxValue + 1                                
          this.setState({
              id: null,
              orderNo:no,
              orderdisplay:(no).toLocaleString('en-US', {minimumIntegerDigits: 7, useGrouping:false})
          })                
      }
    });   
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

  getAll = () => {
    getProductList().then(data => {
      if (data){
        this.setState({              
          product_list: [...data]
        }
      )
      }      
    })   
    getCustomerList().then(data => {
      if (data){
        this.setState({
          customer_List:[...data]
        })
      }
    })  
    getList().then(data => {
      if(data){
        this.setState({
          protype_List:[...data]
        })
      }      
    })
  }
  
  _addProductToList=(item, type_id, type_name)=>{
    var tempList = [...this.state.selectedItems]; 
    //console.log(tempList);
    
    if(tempList === undefined || tempList.length===0 ){      
      var obj = {};
      obj.proId = item.id;
      obj.proCode = item.pro_code;
      obj.proName = item.pro_name;      
      obj.proQty = 1;
      obj.proPieces = item.pieces;
      obj.proAmount = item.pro_current_price;
      obj.typeId = type_id;
      obj.typeName = type_name;      
      tempList.push(obj);                        
      this.setState({
        selectedItems: [...tempList]
      }) 
    }
    else{
      var idx = 0;        
      var flag = 0;
      for(; idx < tempList.length; idx ++){
        if (tempList[idx].proId === item.id && tempList[idx].typeId === type_id){          
            var price =  tempList[idx].proAmount/(tempList[idx].proQty===0?1:tempList[idx].proQty);
            tempList[idx].proQty ++;  
            tempList[idx].proAmount  = tempList[idx].proQty * price;
            flag=1;
            break;
        }
      }                  
      if(flag===0){
        var obj = {};
        obj.proId = item.id;
        obj.proCode = item.pro_code;
        obj.proName = item.pro_name;      
        obj.proQty = 1;
        obj.proPieces = item.pieces;
        obj.proAmount = item.pro_current_price;
        obj.typeId = type_id;
        obj.typeName = type_name;                
        tempList.push(obj);
      }
      this.setState({
        selectedItems: [...tempList]
      })  
    }                            
  }

  _deleteItem =(proId, type_id) => {
    var tempList = [...this.state.selectedItems];
    for(var idx = 0; idx < tempList.length; idx ++){
      if (tempList[idx].proId === proId && tempList[idx].typeId === type_id) {
        var price =  tempList[idx].proAmount/(tempList[idx].proQty===0?1:tempList[idx].proQty);
        tempList[idx].proQty = 0;
        tempList[idx].proAmount = 0;
        // if (tempList[idx].proQty !== undefined && tempList[idx].proQty !==0){
        //   tempList[idx].proQty --;
        // }else{
        //   tempList[idx].proQty = 0;
        // }
        // tempList[idx].proAmount  = tempList[idx].proQty * price;
        break;     
      }             
    }     
    this.setState({
      selectedItems: [...tempList]
    })        
  }

  onChangeQty=(proId, type_id, e)=>{    
    var val = e.target.value;
    var tempList = [...this.state.selectedItems];
    for(var idx = 0; idx < tempList.length; idx ++){
      if (tempList[idx].proId === proId && tempList[idx].typeId === type_id) {
        var price =  tempList[idx].proAmount/(tempList[idx].proQty===0?1:tempList[idx].proQty);
        tempList[idx].proQty  = val*1;
        tempList[idx].proAmount  = val*1 * price;
        break;     
      }             
    }     
    this.setState({
      selectedItems: [...tempList]
    })       
  }  

  onChange_antd = (value) => {      
    this.setState({
        orderDiscount:value
      })      
  }

  onChange_antd_select = (value) => {           
    for (var idx = 0;idx < this.state.customer_List.length; idx ++){
      if(this.state.customer_List[idx].id === value){                         
        this.setState({                                  
          cusSelected:{...this.state.customer_List[idx]}
        })
        break;
      }
    }        
  }

  onEdit_Customer = () => {    
    this.setState({
        showEditCustomerForm: true,        
    })        
  }

  onSave = (e) => {
    e.preventDefault();   
    if (this.state.id){        
      this.onUpdate(e)        
    }
    else{           
      this.onSubmit(e)
    }   
  }

  onSubmit = (e) => {
      //console.log(this.state.selectedItems);
      if(this.state.cusSelected ===null){
        confirmAlert({title: 'Error', message: 'Please choosing Customer. Thanks!', buttons: [{label: 'OK'}]})
      }
      else if(this.state.selectedItems.length ===0){
        confirmAlert({title: 'Warning', 
        message: 'You have not choosen anything. Do you want to save as A Temp Order!', 
        buttons: [
          {label: 'Yes', onClick: () => {            
            this.addOrderWithPaid(0);
        }},
        {label: 'No', onClick: () => {
            
        }}]})
      }
      else{
        var ispaid = 0;
        confirmAlert({
            title: 'Paid or Not',
            message: 'Is This Order Paid?',
            buttons: [
              {label: 'Yes', onClick: () => {
                ispaid = 1;
                this.addOrderWithPaid(ispaid);
              }},
              {label: 'No', onClick: () => {
                  this.addOrderWithPaid(ispaid);
              }}
            ]
          });   
      }
                                             
  }

  onUpdate = (e) => {
    e.preventDefault();      
    var tAmount = 0;
    for (var idx = 0 ; idx < this.state.selectedItems.length; idx ++){      
      tAmount += this.state.selectedItems[idx].proAmount*1;
    }               
    var orderTotal =  (100-this.state.orderDiscount)*tAmount*0.01 
    if (orderTotal - this.state.orderPaid > 0){
        var ispaid = 0;
        confirmAlert({
            title: 'Paid or Not',
            message: 'Is This Order Paid?',
            buttons: [
              {label: 'Yes', onClick: () => {
                ispaid = 1;
                this.updateOrderwithPaid(ispaid);
              }},
              {label: 'No', onClick: () => {
                  this.updateOrderwithPaid(ispaid);
              }}
            ]
          });  
    }else{
        this.updateOrderwithPaid(1);
    }                   
  }    

  updateOrderwithPaid = (ispaid) => {      
    var tQty = 0;
    var tAmount = 0;
    var tPieces = 0;
    for (var idx = 0 ; idx < this.state.selectedItems.length; idx ++){
      tQty += this.state.selectedItems[idx].proQty*1;
      tPieces += this.state.selectedItems[idx].proQty*1 * this.state.selectedItems[idx].proPieces;
      tAmount += this.state.selectedItems[idx].proAmount*1;
    }    
    var orderTotal =  (100-this.state.orderDiscount)*tAmount*0.01 
    var orderPaid = 0;
    if(ispaid===1){
        orderPaid = orderTotal
    }
    else{
        orderPaid = this.state.orderPaid
    }    
    // console.log("ispaid", ispaid, orderPaid);
    
    // console.log("updateOrderwithPaid",this.state.orderno, this.state.orderDate, this.state.cusSelected.id, this.state.cusSelected.cus_code,
    //   this.state.cusSelected.first_name + ' ' + this.state.cusSelected.last_name,  this.state.cusSelected.phone,
    //   tQty, tAmount, this.state.orderDiscount, orderTotal, orderPaid
    //   , this.state.id)
    updateOrderHeaderItem(this.state.orderNo, this.state.orderDate, this.state.pickingDate.format("YYYY-MM-DD HH:mm:ss"),
      this.state.cusSelected.id, this.state.cusSelected.cus_code,
      this.state.cusSelected.first_name + ' ' + this.state.cusSelected.last_name,  
      this.state.cusSelected.phone, tQty, tPieces, tAmount, this.state.orderDiscount, orderTotal, orderPaid
      , this.state.id).then((data) => {                 
            for (let index = 0; index < this.state.selectedItems.length; index++) {
                var obj_detail = this.state.selectedItems[index];                               
                if (obj_detail.id){      
                    if(obj_detail.proQty*1>0){
                      updateOrderDetailItem(this.state.id, this.state.orderNo
                        , obj_detail.proId, obj_detail.proCode, obj_detail.proName
                        , obj_detail.proQty, obj_detail.proPieces, obj_detail.proAmount
                        , obj_detail.typeId, obj_detail.typeName
                        , obj_detail.id)
                    }
                    else{
                        deleteOrderDetailItem(obj_detail.id);
                    }                      
                }
                else{                  
                  addToOrderDetailList(this.state.id, this.state.orderNo, obj_detail.proId, obj_detail.proCode
                    , obj_detail.proName, obj_detail.proQty, obj_detail.proPieces, obj_detail.proAmount
                    , obj_detail.typeId, obj_detail.typeName) 
                }                    
            }                           
            this.setState({
                orderBalance : orderPaid
            })       
            confirmAlert({title: 'Info', message: 'Saving Successfully', buttons: [{label: 'OK'}]})            
    })     
}

  addOrderWithPaid=(ispaid) => {       
      var tQty = 0;
      var tPieces = 0;
      var tAmount = 0;
      for (var idx = 0 ; idx < this.state.selectedItems.length; idx ++){
        tQty += this.state.selectedItems[idx].proQty*1;
        tPieces += this.state.selectedItems[idx].proQty*1 * this.state.selectedItems[idx].proPieces;
        tAmount += this.state.selectedItems[idx].proAmount*1;
      }    
      var orderTotal =  (100-this.state.orderDiscount)*tAmount*0.01 
      var orderPaid = 0;
      if(ispaid===1){
          orderPaid = orderTotal                        
      }            

      addToOrderHeaderList(this.state.orderNo, this.state.orderDate, this.state.pickingDate.format("YYYY-MM-DD HH:mm:ss"),
           this.state.cusSelected.id, this.state.cusSelected.cus_code,
           this.state.cusSelected.first_name + ' ' + this.state.cusSelected.last_name,
           this.state.cusSelected.phone,tQty, tPieces, tAmount, this.state.orderDiscount, orderTotal, orderPaid)
           .then((data) => { 
            var orderid = data.id
            this.setState({
              id:orderid
            })
              for (var index = 0; index < this.state.selectedItems.length; index++) {
                  var obj_detail = {...this.state.selectedItems[index]};             
                  if(obj_detail.proQty*1>0){      
                    addToOrderDetailList(orderid, this.state.orderNo, obj_detail.proId, obj_detail.proCode
                        , obj_detail.proName, obj_detail.proQty, obj_detail.proPieces, obj_detail.proAmount
                        , obj_detail.typeId, obj_detail.typeName)                  
                  }
              }                  
              confirmAlert({title: 'Info', message: 'Saving Successfully', buttons: [{label: 'OK'}]})
              // this.clearData();
              // this._getOrderNoAuto();
      })     
  }

  onChange_OrderNo=(event)=>{        
    const name = event.target.name;
    const value = event.target.value;    
    this.setState({
        [name]:value
      })          
                
      var orderno = value*1
      var s =(orderno).toLocaleString('en-US', {minimumIntegerDigits: 7, useGrouping:false})                       
      this.setState({
          orderdisplay:s,
          id:null
        })     
      this.clearData();
      getOrderHeaderByOrderNo(orderno).then(data => {                                                
          if (data && data.length > 0) {     
            var objCus = null;
            getCustomerById(data[0].cusId).then(dataCus => {
              if (dataCus && dataCus.length > 0) {                              
                objCus={...dataCus[0]};
              }              
              this.setState({
                //isEdit: true,
                id:data[0].id,
                orderNo: data[0].orderNo,
                orderDate: data[0].orderDate,
                pickingDate: moment(new Date (data[0].pickingDate)),                
                cusSelected: {...objCus},                  
                orderDiscount:data[0].orderDiscount,                  
                orderBalance:data[0].orderBalance,
                orderPaid:data[0].orderPaid,
                orderAmount:data[0].orderAmount,
                orderPieces:data[0].orderPieces,
                orderTotal:data[0].orderTotal,
              })                                                
               getOrderDetailByOrderNo(orderno).then(dataDetail => {
                  var list = [];
                  if (dataDetail && dataDetail.length > 0) {                             
                      for(let idx=0; idx < dataDetail.length; idx ++){
                          var obj_itemdetail = []
                          obj_itemdetail.id = dataDetail[idx].id;                          
                          obj_itemdetail.orderId = dataDetail[idx].orderId;
                          obj_itemdetail.orderNo = dataDetail[idx].orderNo;
                          obj_itemdetail.proId = dataDetail[idx].proId;
                          obj_itemdetail.proCode = dataDetail[idx].proCode;
                          obj_itemdetail.proName = dataDetail[idx].proName;
                          obj_itemdetail.proQty = dataDetail[idx].proQty;
                          obj_itemdetail.proPieces = dataDetail[idx].proPieces;
                          obj_itemdetail.proAmount = dataDetail[idx].proAmount;                    
                          obj_itemdetail.typeId = dataDetail[idx].typeId;
                          obj_itemdetail.typeName = dataDetail[idx].typeName;
                          list.push(obj_itemdetail);
                      }                                                                   
                  }
                  this.setState({
                    selectedItems:[...list]
                  })                                                              
               })
            })                                                                               
            
          }                
      })             
  }
  
  onNew = () =>{
    this.clearData();
    this._getOrderNoAuto();
  }

  onDelete = (val) => { 
    if (this.state.id){  
      var ispaid = 0;
      confirmAlert({
          title: 'Confirm',
          message: 'Do you want to delete this?',
          buttons: [
            {label: 'Yes', onClick: () => {
              deleteOrderHeaderItem(val).then((data)=>{
                deleteOrderDetailItemByOrderNo(val).then((data)=>{
                    this.clearData();
                    this._getOrderNoAuto();
                    confirmAlert({title: 'Info', message: 'Deleting Successfully', buttons: [{label: 'OK'}]})
                })    
              }) 
            }},
            {label: 'No', onClick: () => {
                
            }}
          ]
        });   
    }
    else{
      confirmAlert({title: 'Error', message: 'The order have not saved. You could not delete it!', buttons: [{label: 'OK'}]})
    }
                    
  }
  
  printexportPDF=()=>{
    //console.log(this.state.id);
    
    if (this.state.id){  
      var record={};
      record.orderNo = this.state.orderNo;
      record.orderDate = this.state.orderDate;
      record.cusName = this.state.cusSelected.first_name + ' ' + this.state.cusSelected.last_name;
      record.cusPhone = this.state.cusSelected.phone;
      record.orderAmount = this.state.orderAmount;
      record.orderTotal = this.state.orderTotal;
      record.orderPaid = this.state.orderPaid;
      record.orderPieces = this.state.orderPieces;
      record.pickingDate = this.state.pickingDate;
      record.orderDiscount = this.state.orderDiscount;
      record.child = [...this.state.selectedItems];
      //console.log(record);
      
      exportPDF(record, 1);
    }else{
      confirmAlert({title: 'Error', message: 'The order have not saved. You could not print it!', buttons: [{label: 'OK'}]})
    }
  }

  render() {    
    var tQty = 0;
    var tAmount = 0;        
    var tPieces = 0;        
    return (
      <div>
        <div >                  
        <div id="listProduct">
            <div className="row">               
                  {this.state.product_list.map((item, index) => {
                      if(item.is_type===0){
                        return (
                          <div className="col-2" style={{'padding-top':'10px'}}>                
                          <div className="card_image">   
                            <a id={"dropId" + item.id} onClick={()=>this._addProductToList(item, 0,'')} >
                                <p>{item.pro_name}</p>
                                <img width="100px" height="70px" src={item.image_url===''?BASE_URL+'images/icon/placeholder.png':BASE_URL+item.image_url} title={item.pro_name} />
                              </a>  
                            </div>
                          </div>
                        )
                      }
                      else{
                        return (
                        <div className="col-2" style={{'padding-top':'10px'}}>                
                          <div className="card_image">                              
                                <Popup
                                  trigger={
                                    <a id={"dropId" + item.id} onClick={()=>this._addProductToList(item, 0,'')} >
                                      <p>{item.pro_name}</p>
                                      <img width="100px" height="70px" src={item.image_url===''?BASE_URL+'images/icon/placeholder.png':BASE_URL+item.image_url} title={item.pro_name} />
                                    </a>
                                  }
                                  position="right top"
                                  on="hover"
                                  closeOnDocumentClick
                                  mouseLeaveDelay={300}
                                  mouseEnterDelay={0}
                                  contentStyle={{ padding: '0px', border: 'none', width:'100px' }}
                                  arrow={false}
                                >
                                  <div className="menu">
                                   { this.state.protype_List.map((item_type, index) => (             
                                      <div className="menu-item" onClick={()=>this._addProductToList(item, item_type.id, item_type.task_name)}>{item_type.task_name} </div>                      
                                    ))}
                                  </div>
                                </Popup>                                                                                     
                                </div>   
                         </div>
                        )
                      }
                    }                     
                  )}                
            </div>
        </div>
        <div id="listOrder" style={{'padding-top':'10px'}} >                 
               <div style={{display:'inline-flex'}}>
                  <span className="lblOrderNo" >Order No</span>                                               
                  <input type="text" id="txtOrderNo" name="orderNo" ref="1"
                      value={this.state.orderNo} 
                      onChange={(event)=>this.onChange_OrderNo(event)}/>  
                  <span className="lblOrderNo">
                    {this.state.orderdisplay} 
                  </span>
                  <input type="button" id="btnNew" className="btnNewOrder"
                        onClick={()=>this.onNew()} value="New"/>   
                  <input type="button" id="btnDelete1" className="btnNewOrder"                          
                      onClick={()=>this.onDelete(this.state.id)} value="Delete"/>                                          
              </div>  
              <div style={{display:'inline-flex', 'padding-bottom':'10px'}}>
                  <span className="lblPicking" >Picking Date</span>       
                  <DatePicker showTime placeholder="Select Time" 
                  value={this.state.pickingDate} id="dtPicking"/>
                   <input type="button" id="btnPrint"
                        onClick={()=>this.printexportPDF(this.state.id)} value="Print Order"/>   
              </div>         
              <div className="input-group mb-3">              
                <Select id="cusSearch" 
                  value = {(this.state.cusSelected!==null && this.state.cusSelected !== undefined)?this.state.cusSelected.id:''}
                  showSearch  
                  showArrow={false}                             
                  optionFilterProp="children"    
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="Customer"
                  onChange={this.onChange_antd_select.bind(this)} 
                >
                  {                               
                    this.state.customer_List.map((item, index) => (
                      <Option value={item.id}>{item.first_name + ' ' + item.last_name + ' - Phone: ' + item.phone}</Option>                  
                    ))}                
                </Select>              
                <div className="input-group-append" style={{'padding-left':'5px'}}>
                  <a id="edit_customer_now" className="dpBBold"
                   onClick={()=>this.onEdit_Customer()}>
                    <img src="images/edit-white.png" title="Edit Customer Details"/>                    
                  </a>
                  <input type="button" id="customer_button" value="+" onClick={this.onClickCustomerForm.bind(this)}/>   
                  <Modal
                        title="Edit Customer" 
                        visible={this.state.showEditCustomerForm}                        
                        footer ={null}       
                        onCancel={this.handleCloseShowCustomerForm.bind(this)}
                        >
                        <CustomerForm itemEdit={this.state.cusSelected}></CustomerForm>
                    </Modal>
                  <Modal
                        title="Add New Customer" 
                        visible={this.state.showCustomerForm}                        
                        footer ={null}       
                        onCancel={this.handleCloseShowCustomerForm.bind(this)}
                        >
                        <CustomerForm></CustomerForm>
                    </Modal>           
                </div>
              </div> 
              <div>
              
                <table className="tabletest4">
                  <tbody>                   
                  {                               
                    this.state.selectedItems.map((item, index) => {                          
                        tQty += item.proQty*1;
                        tAmount += item.proAmount*1;
                        tPieces += item.proQty*1* item.proPieces ;
                        if(item.proQty > 0){
                          return(
                            <tr >
                              <td className="td_delete">                                                                    
                                <a onClick={()=> this._deleteItem(item.proId, item.typeId)}>
                                <img  style={{'padding-left':'10px'}} width="30px" height="20px" src='images/remove.jpg'/>
                                </a>
                                </td>                            
                              <td className="tdInput">
                                <input id="score_input_selected" type="text" value={item.proQty!==0?item.proQty:''} 
                                      onChange={(event)=>this.onChangeQty(item.proId, item.typeId, event)}/>                                  
                                </td>
                              <td className="td_normal" >{item.proName + ' ' + (item.typeName!==undefined?item.typeName:'')}</td>
                              <td className="td_normal"><span className="price">${item.proAmount}</span></td>
                              </tr>
                            )
                          }     
                        }                                               
                      )
                    }
                        {                                                                
                          (tQty>0) ?
                            (                        
                              <tr style={{'background-color': '#dabbbb', height:30}}>
                                <td ></td>
                                  <td  style={{textAlign:'center'}}><b>{tQty}</b></td>
                                  <td ><b>Total List ( {tPieces} pieces )</b></td>
                                  <td ><span className="price" style={{color: 'black'}}><b>${tAmount}</b></span></td>
                                  
                              </tr>                        
                            ):''                                       
                        }
                      </tbody>
                    </table>              
                </div>                                                                         
          </div>
        </div>         
        <div id="footer">            
            <div id="total_Order">   
                <div className="disCount">
                    <span ><b>Discount: </b></span>                            
                    <InputNumber style={{'height':'38px'}}
                    value={this.state.orderDiscount} 
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')} 
                    onChange={this.onChange_antd.bind(this)}                                                         
                    />                                                    
                                        
                </div>    
               
                  
                  <div >
                    <button type="button" id="btnOrder" onClick={(event)=>this.onSave(event)}>   
                        <div id="sbText" style={{'float':'left'}}>Submit</div>
                        <div id="sbText3" style={{'float':'left','margin-left':'8px','color':'#e0eee0'}}>{this.state.dtOrder} </div>
                        <div id="sbText2" style={{'float':'right'}}>
                          $<span id="sbTextN">{(100-this.state.orderDiscount)*tAmount*0.01 }</span>
                          <span id="sbTextE">{this.state.id===null?'':"  - Balance: $" + ((100-this.state.orderDiscount)*tAmount*0.01 - this.state.orderPaid)}</span>
                        </div>
                      </button>     
                      
                                                                                                     
                </div>                                       
            </div>   
        </div>                 
    </div>             

    );
  }
}

export default OrderForm;