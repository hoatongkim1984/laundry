import React, { Component } from 'react';
import OrderForm from './OrderForm';
import Landing from './Landing';

class Home extends Component {
    render() {        
        return (
            <div>
                {localStorage.usertoken ? <OrderForm/> : <Landing/>}
            </div>
        );
    }
}

export default Home;