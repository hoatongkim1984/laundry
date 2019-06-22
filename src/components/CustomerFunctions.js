import axios from 'axios'

export const getCustomerList = () => {
    return axios
        .get('/customers/list', {
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

export const getCustomerById = (cus_id) => {      
        return axios
        .get('/customers/id', {
            params:
            {
                id : cus_id 
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
export const getCustomerByCODE = (cus_code) => {
    
    // return axios
    //     .get('/customers/:id='+cus_code, 
    //     {
    //         headers:{'Context-Type': 'application/json'}
    //     })        
    //     .then(res=>{                  
    //         return res.data
    //     }).catch(err => {
    //         console.log("Errr:" + err)
    //     })

        return axios
        .get('/customers', {
            params:
            {
                id : cus_code 
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

export const addToCusList = (cus_code, first_name, last_name, phone, email, address) => {
    return axios
        .post(
            `/customers`,
            {
                cus_code : cus_code ,               
                first_name : first_name,
                last_name : last_name,
                phone: phone,
                email: email,
                address: address 
            },
            {
                headers:{'Context-Type': 'application/json'}
            }
        )
        .then(function (response){
            console.log(response)            
        })
}


export const deleteCusItem = term => {
    return axios
        .delete(`customers/${term}`, {
            headers:{'Context-Type': 'application/json'}
        })
        .then (function(response) {
            console.log(response)            
        })
        .catch(function(error){
            console.log(error)            
        })
}

export const updateCusItem = (cus_code, first_name, last_name, phone, email, address, id) =>{
    return axios
        .put (
            `customers/${id}`,
            {
                cus_code : cus_code ,               
                first_name : first_name,
                last_name : last_name,
                phone: phone,
                email: email,
                address: address 
            },
            {
                headers:{'Context-Type': 'application/json'}
            }
        )
        .then(function(response){
            console.log(response)  
        })
}