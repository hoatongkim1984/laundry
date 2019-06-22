import React, { Component } from 'react';
import { getProductList, deleteProItem } from './ProductFunctions';
import ProductForm from './ProductForm';
import { Modal, Button } from 'antd';
import 'antd/es/modal/style/index.css';

class CustomerList extends Component {
    constructor() {
        super()
        this.state = {   
            showProductForm: false,
            showEditProductForm: false,            
            items: [],
            itemEdit: null
        }       
    }

    onClickProductForm(){                
        this.setState({showProductForm: true})
    }

    handleCloseShowProductForm(){
        this.setState({
            showProductForm: false,
            showEditProductForm:false
        })
        this.getAll();
    }

      componentDidMount() {
        this.getAll()
      }

     getAll = () => {
        getProductList().then(data => {
            console.log(data);
            
            if(data){
                this.setState(
                    {              
                      items: [...data]
                    },
                    () => {
                      //console.log(this.state.items)
                    }
                )
            }                     
        })
        //console.log( this.state.items);        
      }

    onEdit = (itm_pro_code, itm_pro_name, itm_pro_current_price, itm_is_type, itm_image_url, itm_pieces, itm_id, e) => {        
        this.setState({
            showEditProductForm: true,           
            itemEdit: {itemCode: itm_pro_code
                , itemName: itm_pro_name
                , itemPrice: itm_pro_current_price
                , itemType: itm_is_type
                , itemImageUrl:itm_image_url
                , itemPieces: itm_pieces
                , itemId: itm_id}
        })
      }

    onDelete = (val, e) => {
        e.preventDefault()
        deleteProItem(val).then(() => {
          this.getAll()
        })
      }
    render() {
        return (
            <div>
                <div align="center"> 
                    <h1>
                        Product Managment
                    </h1>     
                    <div className="float-right">
                         <button className="btnNormal" onClick={this.onClickProductForm.bind(this)}>Add New Product</button>                    
                     </div>                    
                     <Modal
                        title="Add New Product" 
                        visible={this.state.showProductForm}                        
                        footer ={null}       
                        onCancel={this.handleCloseShowProductForm.bind(this)}
                        width={'50%'} >
                        <ProductForm></ProductForm>
                    </Modal>
                </div>                                         
                      
                
                <div className="container">
                <Modal
                                            title="Edit Customer" 
                                            visible={this.state.showEditProductForm}                        
                                            footer ={null}       
                                            onCancel={this.handleCloseShowProductForm.bind(this)}
                                            width={'50%'} >
                                            <ProductForm itemEdit={this.state.itemEdit}></ProductForm>
                                        </Modal>
                    <br/> <br/><br/>
                    <div id="noteList" role="tablist" aria-multiselectable="true">
                        {this.state.items.map((item, index) => (
                        <div className="card">
                            <div className="card-header" role="tab" id="note1">
                                <h5 className="mb-0">
                                    <a data-toggle="collapse" data-parent="#noteList" href={"#number"+index} aria-expanded="true" aria-controls="noteContent1">
                                    {item.pro_code + ": " + item.pro_name}
                                    </a>
                                    <div className="btn-group float-right">
                                        <button className="btnNormal" 
                                            onClick={this.onEdit.bind(this
                                                                        , item.pro_code
                                                                        , item.pro_name
                                                                        , item.pro_current_price
                                                                        , item.is_type 
                                                                        , item.image_url                                                                       
                                                                        , item.pieces 
                                                                        , item.id                                                                        
                                                                        )}>Sửa</button>
                                       &nbsp;
                                        <button className="btnNormal" 
                                            onClick={this.onDelete.bind(this, item.id)}>Xóa</button>
                                    </div>
                                </h5>
                            </div>
                            <div id={"number"+index} className="collapse in" role="tabpanel" aria-labelledby="note1">
                                <div className="card-body">
                                    <b>Product code: </b> {item.pro_code}  <br/>
                                    <b>Product name: </b>{item.pro_name} <br/>
                                    <b>Product Current Price: </b>{item.pro_current_price} <br/>
                                    <b>Is Type: </b>{item.is_type} <br/>                                    
                                    <b>Image: </b>{item.image_url} <br/> 
                                    <b>Pieces: </b>{item.pieces} <br/> 
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