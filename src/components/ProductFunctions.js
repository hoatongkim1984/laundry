import axios from 'axios'

export const getProductList = () => {
    return axios
        .get('/products/list', {
            headers:{'Context-Type': 'application/json'}
        })
        .then(res=>{            
            if(Object.prototype.toString.call(res.data) === '[object Array]'){            
                return res.data;
            }            
            else
                return null;
        }).catch(err => {
            //console.log("Errr:" + err)
            return null;            
        })  
}

export const getProductByCODE = (pro_code) => {
    
    return axios
        .get('/products', {
            params:
            {
                id : pro_code 
            }
        },
        {
            headers:{'Context-Type': 'application/json'}
        })        
        .then(res=>{                  
            return res.data
        }).catch(err => {
            console.log("Errr:" + err)
        })
}

export const addToProList = (pro_code, pro_name, pro_current_price, is_type, image_url, pieces) => {
    return axios
        .post(
            `/products`,
            {
                pro_code : pro_code ,               
                pro_name : pro_name,
                pro_current_price : pro_current_price,
                is_type: is_type,
                image_url: image_url,
                pieces: pieces
            },
            {
                headers:{'Context-Type': 'application/json'}
            }
        )
        .then(function (response){
            console.log(response)            
        })
}


export const deleteProItem = term => {
    return axios
        .delete(`products/${term}`, {
            headers:{'Context-Type': 'application/json'}
        })
        .then (function(response) {
            console.log(response)            
        })
        .catch(function(error){
            console.log(error)            
        })
}

export const updateProItem = (pro_code, pro_name, pro_current_price, is_type, image_url, pieces, id) =>{
    return axios
        .put (
            `products/${id}`,
            {
                pro_code : pro_code ,               
                pro_name : pro_name,
                pro_current_price : pro_current_price,
                is_type: is_type,
                image_url: image_url,
                pieces: pieces
            },
            {
                headers:{'Context-Type': 'application/json'}
            }
        )
        .then(function(response){
            console.log(response)  
        })
}