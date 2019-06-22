import axios from 'axios'

export const getOrderDetailList = () => {
    return axios
        .get('/orderdetails/list', {
            headers:{'Context-Type': 'application/json'}
        })
        .then(res=>{
            return res.data
        })
}

export const getOrderDetailByOrderNo = (OrderNo) => {
       
        return axios
        .get('/orderdetails', {
            params:
            {
                orderNo : OrderNo 
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

export const addToOrderDetailList = (_orderId, _orderNo, _proId, _proCode, _proName, _proQty, _proPieces, _proAmount, _typeId, _typeName) => {
    return axios
        .post(
            `/orderdetails`,
            {
                orderId:_orderId,
                orderNo:_orderNo,                
                proId: _proId,
                proCode: _proCode,
                proName: _proName,
                proQty: _proQty,
                proPieces: _proPieces,
                proAmount: _proAmount,
                typeId: _typeId,
                typeName: _typeName
            },
            {
                headers:{'Context-Type': 'application/json'}
            }
        )
        .then(function (response){
            //console.log(response)            
        })
}

export const deleteOrderDetailItemByOrderNo = term => {
    return axios
        .delete(`orderdetails/orderno/${term}`, {
            headers:{'Context-Type': 'application/json'}
        })
        .then (function(response) {
            //console.log(response)            
        })
        .catch(function(error){
            //console.log(error)            
        })
}

export const deleteOrderDetailItem = term => {
    return axios
        .delete(`orderdetails/${term}`, {
            headers:{'Context-Type': 'application/json'}
        })
        .then (function(response) {
            //console.log(response)            
        })
        .catch(function(error){
            //console.log(error)            
        })
}

export const updateOrderDetailItem = (_orderId, _orderNo, _proId, _proCode, _proName, _proQty, _proPieces, _proAmount,
     _typeId, _typeName, id) =>{
    return axios
        .put (
            `orderdetails/${id}`,
            {
                orderId:_orderId,
                orderNo:_orderNo,                
                proId: _proId,
                proCode: _proCode,
                proName: _proName,
                proQty: _proQty,
                proPieces: _proPieces,
                proAmount: _proAmount,
                typeId: _typeId, 
                typeName: _typeName
            },
            {
                headers:{'Context-Type': 'application/json'}
            }
        )
        .then(function(response){
            //console.log(response)  
        })
}