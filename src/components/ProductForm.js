import React, { Component } from 'react';
import { addToProList, updateProItem } from './ProductFunctions';
import axios from 'axios';
//const BASE_URL = 'http://localhost:5000/';

class ProductForm extends Component {

    constructor() {
        super()
        this.state = {
            id: '',
            pro_code: '',
            pro_name: '',
            pro_current_price: '',
            is_type: false,            
            pieces:1,
            selectedFile: null   ,
            pictures:[],
            images: [],
            imageUrls: '',
            message: ''     
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onDrop = this.onDrop.bind(this);
    }

    onChange=(event)=>{
        const name = event.target.name;
        var value = event.target.value;     
        
        if (name === 'is_type') {
            value=event.currentTarget.checked;
        }       
           
        this.setState({
          [name]:value
        })    
    }

    onDrop(picture) {
        this.setState({
            pictures: this.state.pictures.concat(picture),
        });
    }

    fileSelectedHandler = event  => {
        this.setState({
            selectedFile:event.target.files[0]
        })
    }

    onSubmit = e => {
        e.preventDefault()     
        console.log("Submit");
           
        var isType = this.state.is_type ? 1:0;
        addToProList(this.state.pro_code, this.state.pro_name, this.state.pro_current_price
            , isType, this.state.imageUrls, this.state.pieces).then(() => {
            
        })
        this.setState({  
            id: '',
            pro_code: '',
            pro_name: '',
            pro_current_price: '',            
            is_type: false  ,
            imageUrls:'',
            pieces:1
        })  
    }

    onUpdate = e => {
        e.preventDefault()      
        var isType = this.state.is_type ? 1:0;
        //console.log(this.state.imageUrls);
         
        updateProItem(this.state.pro_code, this.state.pro_name, this.state.pro_current_price
            , isType, this.state.imageUrls, this.state.pieces,  this.state.id).then(() => {
            
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

    selectImages = (event) => {
        let images = []
        for (var i = 0; i < event.target.files.length; i++) {
        images[i] = event.target.files.item(i);
        }
        images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
        let message = `${images.length} valid image(s) selected`
        this.setState({ images, message })
    }

    uploadImages = () => {
        const uploaders = this.state.images
        .map(image => {
            const data = new FormData();
            data.append("image", image, image.name);              
            return axios
            .post('/fileupload', data)
            .then(res => {                                                  
                this.setState({
                    imageUrls: res.data.imageUrl
                });
            })
        });
    
        axios.all(uploaders).then(() => {            
            console.log('done');
        }).catch(
            err => alert(err.message)
        );        
    }
        
    componentWillMount(){         
        if (this.props.itemEdit) {
            this.setState({id: this.props.itemEdit.itemId,
            pro_code: this.props.itemEdit.itemCode,
            pro_name: this.props.itemEdit.itemName,
            pro_current_price: this.props.itemEdit.itemPrice,            
            is_type: this.props.itemEdit.itemType,  
            imageUrls: this.props.itemEdit.itemImageUrl,   
            pieces: this.props.itemEdit.itemPieces
        })
        }
    }  

    componentWillReceiveProps(nextProps){       
        if (nextProps.itemEdit) {            
            this.setState({id: nextProps.itemEdit.itemId,
            pro_code: nextProps.itemEdit.itemCode,
            pro_name: nextProps.itemEdit.itemName,
            pro_current_price: nextProps.itemEdit.itemPrice,
            is_type: nextProps.itemEdit.itemType,
            imageUrls: nextProps.itemEdit.itemImageUrl,
            pieces: nextProps.itemEdit.itemPieces
        })
        }
    }

    render() {
        
        return (
            <div>
                <div className="col-md-12">
                 <div align="center"> 
                    <h1>
                        Product Form
                    </h1>                                    
                </div>         
                         
                <div className="container">
                    <form>                        
                        <div className="row">
                            <div className="col">                                                                   
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Product ID</span>
                                    </div>
                                    <input type="text" className="form-control" id="pro_code" name="pro_code"   
                                        onChange={this.onChange.bind(this)}  value={this.state.pro_code || ''} />                                    
                                </div>
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Product Name</span>
                                    </div>
                                    <input type="text" className="form-control" id="pro_name" name="pro_name" 
                                            onChange={this.onChange.bind(this)} value={this.state.pro_name || ''} />
                                </div>
                             
                                <div className="row">
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Current Price</span>
                                            </div>
                                            <input type="text" className="form-control" id="pro_current_price" name="pro_current_price"  
                                             onChange={this.onChange.bind(this)} value={this.state.pro_current_price || 0}/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Pieces</span>
                                            </div>
                                            <input type="text" className="form-control" id="pieces" name="pieces"  
                                             onChange={this.onChange.bind(this)} value={this.state.pieces || 0}/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-group mb-2">                                           
                                            <label style={{'float':'left'}}>
                                                <input type="checkbox"  name="is_type" onChange={this.onChange.bind(this)} checked={this.state.is_type } /> Is Type
                                            </label>
                                        </div>
                                    </div>                                        
                                </div>  
                                <div className="row">
                                    <div className="col">
                                    <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">Upload Image</span>
                                            </div>                                           
                                            <input                                                     
                                                    type="file" 
                                                    id="inputfile"
                                                    onChange={this.selectImages} />   
                                            <input type="button" onClick={()=>this.uploadImages()} className="form-control" value="Upload Image" />                                                                                     
                                             <span className="input-group-text" style={{width:'60%'}}>{this.state.imageUrls}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type="reset" onClick={(event)=>this.onSave(event)} className="btnNormal" value="Save" /> 
                        {/* cái này ko bị nè  cai hoi nay duoc chua? chua, anh ko thay hen copy type re set qua thi no co bi ko? bi luon*/}
                    </form>
                </div>                                                                              
            </div>
            </div>
        );
    }
}

export default ProductForm;