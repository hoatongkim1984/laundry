import axios from 'axios';

export const getOrderHeaderList = () => {
    return axios
        .get('/orderheaders/list', {
            headers:{'Context-Type': 'application/json'}
        })
        .then(res=>{
            if(Object.prototype.toString.call(res.data) === '[object Array]'){            
                return res.data;
            }            
            else
                return null;
        }).catch(err => {
            return null;
            //console.log("Errr:" + err)
        })  
}

export const getMaxOrderHeaderNo = () => {
       
    return axios
    .get('/orderheaders/autoOrder',
    {
        headers:{'Context-Type': 'application/json'}
    })        
    .then(res=>{                  
        return res.data
    }).catch(err => {
        //console.log("Errr:" + err)
    })        
}

export const getOrderHeaderByOrderNo = (Order_No) => {
       
        return axios
        .get('/orderheaders', {
            params:
            {
                orderNo : Order_No
            }
        },
        {
            headers:{'Context-Type': 'application/json'}
        })        
        .then(res=>{                  
            return res.data
        }).catch(err => {
            //console.log("Errr:" + err)
        })        
}

export const addToOrderHeaderList = (_orderNo, _orderDate, _pickingDate, _cusId, _cusCode, _cusName, _cusPhone, _orderQty, 
                                    _orderPieces, _orderAmount, _orderDiscount, _orderTotal, _orderPaid) => {
    return axios
        .post(
            `/orderheaders`,
            {
                orderNo:_orderNo,
                orderDate: _orderDate ,
                pickingDate: _pickingDate ,
                cusId: _cusId,
                cusCode: _cusCode,
                cusName: _cusName,
                cusPhone: _cusPhone,
                orderQty: _orderQty,
                orderPieces: _orderPieces, 
                orderAmount: _orderAmount,
                orderDiscount: _orderDiscount,
                orderTotal: _orderTotal,
                orderPaid: _orderPaid
            },
            {
                headers:{'Context-Type': 'application/json'}
            }
        )
        .then(res=>{                  
            return res.data
        }).catch(err => {
            //console.log("Errr:" + err)
        }) 
}


export const deleteOrderHeaderItem = term => {
    return axios
        .delete(`orderheaders/${term}`, {
            headers:{'Context-Type': 'application/json'}
        })
        .then (function(response) {
            //console.log(response)            
        })
        .catch(function(error){
            //console.log(error)            
        })
}

export const updateOrderHeaderItem = (_orderNo, _orderDate, _pickingDate, _cusId, _cusCode, _cusName, _cusPhone, _orderQty, 
                  _orderPieces, _orderAmount, _orderDiscount, _orderTotal, _orderPaid, id) =>{
    return axios
        .put (
            `orderheaders/${id}`,
            {
                orderNo:_orderNo,
                orderDate: _orderDate,
                pickingDate: _pickingDate,
                cusId: _cusId,
                cusCode: _cusCode,
                cusName: _cusName,
                cusPhone: _cusPhone,
                orderQty: _orderQty,
                orderPieces: _orderPieces,
                orderAmount: _orderAmount,
                orderDiscount: _orderDiscount,
                orderTotal: _orderTotal,
                orderPaid: _orderPaid
            },
            {
                headers:{'Context-Type': 'application/json'}
            }
        )
        .then(function(response){
            //console.log(response)  
        })
}