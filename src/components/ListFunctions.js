import axios from 'axios'

export const getList = () => {
    return axios
        .get('/tasks/list', {
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

export const addToList = (term, term_content, term_type) => {
    return axios
        .post(
            `/tasks`,
            {
                task_name : term ,               
                task_content : term_content,
                type : term_type 
            },
            {
                headers:{'Context-Type': 'application/json'}
            }
        )
        .then(function (response){
            console.log(response)            
        })
}

export const deleteItem = term => {
    return axios
        .delete(`tasks/${term}`, {
            headers:{'Context-Type': 'application/json'}
        })
        .then (function(response) {
            console.log(response)            
        })
        .catch(function(error){
            console.log(error)            
        })
}

export const updateItem = (term, term_content, term_type, id) =>{
    return axios
        .put (
            `tasks/${id}`,
            {
                task_name:term,
                task_content:term_content,
                type: term_type
            },
            {
                headers:{'Context-Type': 'application/json'}
            }
        )
        .then(function(response){
            console.log(response)  
        })
}