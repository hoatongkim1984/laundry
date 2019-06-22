import React, { Component } from 'react';
import { getProductList } from './ProductFunctions';
import { deleteItem } from './ListFunctions';
import {getCustomerList} from './CustomerFunctions';
import { getList} from './ListFunctions';

import { InputNumber, Select } from 'antd';
import 'antd/es/modal/style/index.css';
import 'antd/dist/antd.css';
const Option = Select.Option;

class OrdForm extends Component {
  
  constructor(props) {
    super(props); 
    const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
    this.state = {        
        product_list:[] ,
        dtOrder:new Date().toLocaleDateString('en-US', DATE_OPTIONS),
        orderDiscount:0   ,
        selectedItems: [],     
        customer_List:[],
        protype_List:[],
        dropdownOpen:false
      };                         
  }

  componentDidMount() {
    this.getAll()
  }

  getAll = () => {
    getProductList().then(data => {
      this.setState({              
          product_list: [...data]
        }
      )
    })   
    getCustomerList().then(data => {
      this.setState({
        customer_List:[...data]
      })
    })  
    getList().then(data => {
      this.setState({
        protype_List:[...data]
      })
    })
  }
  
  _addProductToList=(id)=>{
    var tempList = this.state.product_list;    
    for(var idx = 0; idx < tempList.length; idx ++){
      if (tempList[idx].id === id) {
        if (tempList[idx].pro_qty === undefined){
          tempList[idx].pro_qty = 1;          
        }else{
          tempList[idx].pro_qty ++;
        }    
        break;     
      }             
    }     
    this.setState({
      product_list: [...tempList]
    })                  
  }

  _deleteItem =(id) => {
    var tempList = this.state.product_list;
    for(var idx = 0; idx < tempList.length; idx ++){
      if (tempList[idx].id === id) {
        if (tempList[idx].pro_qty !== undefined && tempList[idx].pro_qty !==0){
          tempList[idx].pro_qty --;
        }else{
          tempList[idx].pro_qty = 0;
        }
        tempList[idx].pro_amount  = tempList[idx].pro_qty * tempList[idx].pro_current_price;
        break;     
      }             
    }     
    this.setState({
      product_list: [...tempList]
    })        
  }

  onChangeQty=(id, e)=>{    
    var val = e.target.value;
    var tempList = this.state.product_list;
    for(var idx = 0; idx < tempList.length; idx ++){
      if (tempList[idx].id === id) {
        tempList[idx].pro_qty  = val*1;
        tempList[idx].pro_amount  = val*1 * tempList[idx].pro_current_price;
        break;     
      }             
    }     
    this.setState({
      product_list: [...tempList]
    })       
  }  

  onChange_antd = (value) => {        
    this.setState({
        orderDiscount:value
      })      
  }

  onMouseEnter=() => {
    this.setState({dropdownOpen: true});
  }

  onMouseLeave=()=> {
    this.setState({dropdownOpen: false});
  }

  render() {    
    var tQty = 0;
    var tAmount = 0;    
    return (
      <div>
        <div >        
        <div id="listProduct">
            <div className="row">               
                  {this.state.product_list.map((item, index) => (      
                     <div className="col-2" style={{'padding-top':'10px'}}>                
                     <div className="card-deck">          
                        <div className="card">
                          <a id={"dropId" + item.id} onMouseOver={()=>this.onMouseEnter()} onMouseLeave={()=>this.onMouseLeave()} data-toggle="dropdown" onClick={()=>this._addProductToList(item.id)} >
                            <p>{item.pro_name}</p>
                            <img width="100px" height="70px" src={item.image_url===''?'images/placeholder.png':item.image_url} title={item.pro_name} />
                          </a>
                          <div className="dropdown-menu" aria-labelledby={"dropId" + item.id} >
                            <ul >
                                <li className="dropdown-item"><a id="slide3">  Search</a></li>
                                <li className="dropdown-item"><a id="slide6"><img src="images/nbm.png" />  Metrics</a></li>
                                <li className="dropdown-item"><a id="slide4"><img src="images/nbpr.png" />  Products</a></li>
                                <li className="dropdown-item"><a id="showPrint"><img src="images/nbp.png" />  Printers</a></li>
                                <li className="dropdown-item"><a id="showUsers" onclick="load_users_page()"><img src="images/nbu.png" />  Users</a></li>
                                <li className="dropdown-item"><a id="showSMS"><img src="images/nbsms.png" />  SMS</a></li>
                                <li className="dropdown-item"><a id="slideHelp" href="images/help" target="_blank"><img src="images/nbh.png" />  Help</a></li>
                                <li className="dropdown-item"><a id="editAccount"><img src="images//nba.png" />  Admin</a></li>
                            </ul>
                        </div>
                          <div className="card-body" style={{'visibility': '', 'height':'50px', 'padding':'10px', 'align-item':'center', 'display':'flex'}}>
                            <input id="score_input" type="text" value={item.pro_qty!==0?item.pro_qty:''} 
                              onChange={(event)=>this.onChangeQty(item.id,event)}/>   
                            <a onClick={()=> this._deleteItem(item.id)}>
                               <img  style={{'padding-left':'10px'}} width="30px" height="20px" src='images/remove.jpg'/>
                            </a>
                          </div>
                        </div>                                                                         
                      </div>    
                    </div>
                  ))}                
            </div>
        </div>
        <div id="listOrder" style={{'padding-top':'10px'}} >                     
            <div className="input-group mb-3">           
              <Select id="cusSearch" 
                showSearch  
                showArrow={false}                             
                optionFilterProp="children"    
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder="Customer"
              >
                {                               
                  this.state.customer_List.map((item, index) => (
                    <Option value={item.cus_code}>{item.first_name + ' ' + item.last_name + ' Phone: ' + item.phone}</Option>                  
                  ))}                
              </Select>              
              <div className="input-group-append" style={{'padding-left':'5px'}}>
                <input type="button" id="customer_button" value="+"/>              
              </div>
            </div> 
            <div>
                <table className="tabletest4">
                  <tbody>
                  {                               
                        this.state.product_list.map((item, index) => {
                          if(item.pro_qty>0){
                            tQty += item.pro_qty*1;
                            tAmount += item.pro_qty*1*item.pro_current_price;
                            return(
                            <tr>
                                <td><span className="price">{item.pro_qty}</span></td>
                                <td>{item.pro_name}</td>
                                <td><span className="price">${item.pro_qty*1*item.pro_current_price}</span></td>
                                <td>
                                    <div className="btn-group float-right">
                                        
                                    </div>
                                </td>
                              </tr>
                            )
                          }
                        }
                    )}
                    {                                                                
                      (tQty>0) ?
                        (                        
                          <tr style={{'background-color': '#685454'}}>
                              <td><span className="price" style={{color: 'black'}}><b>{tQty}</b></span></td>
                              <td><b>Total List</b></td>
                              <td><span className="price" style={{color: 'black'}}><b>${tAmount}</b></span></td>
                              <td></td>
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
                  <span ><b>Discount: $ </b></span>                            
                  <InputNumber style={{'height':'38px'}}
                  value={this.state.orderDiscount} 
                  min={0}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')} 
                  onChange={this.onChange_antd.bind(this)}                                                         
                  />              
                </div>    
                <div>
                  <button type="Submit" id="btnOrder" >   
                    <div id="sbText" style={{'float':'left'}}>Submit</div>
                  <div id="sbText3" style={{'float':'left','margin-left':'8px','color':'#e0eee0'}}>{this.state.dtOrder} </div>
                    <div id="sbText2" style={{'float':'right'}}>
                      $<span id="sbTextN">{(100-this.state.orderDiscount)*tAmount*0.01 }</span>
                      <span id="sbTextE" style={{'display':'none'}}>0</span>
                    </div>
                  </button>
                </div>                                        
              </div>   
        </div>                 
    </div>             

    );
  }
}

export default OrdForm;