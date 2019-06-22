import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Nonepermision from './components/Nonepermision';
import Todolist from './components/Todolist';
import InvoiceForm from './components/InvoiceForm';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import OrderForm from './components/OrderForm';
import Ordlist from './components/OrdList';
import Antdfile from './components/antdfile';
import testexport from './components/testexport';
//import MaterialTable from './components/MaterialTable';
import Home from './components/Home';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      term: '',
      items: []
    }
  }

  fnRefresh = () =>{    
    this.forceUpdate();
  }

  render () {
    
    //console.log('localStorage.usertoken??', localStorage.usertoken);
    
    
    const roll_user = (
      <Router>
      <div className="App">
        <Navbar fnRefresh = {this.fnRefresh}/>        
        <Route exact path="/" component={OrderForm} />
        <Route exact path="/login" render={(props) => <Login fnRefresh={this.fnRefresh} {...props} />}/>
        <Route exact path="/register" component={Register} />              
        <Route exact path="/profile" component={Profile} />    
        <Route exact path="/todolist" component={Todolist} />
        <Route exact path="/customer" component={CustomerList} />
        <Route exact path="/customerform" component={CustomerForm} />
        <Route exact path="/product" component={ProductList} />
        <Route exact path="/productform" component={ProductForm} />
        <Route exact path="/addinvoice" component={testexport} />        
        <Route exact path="/addorder" component={OrderForm} />    
        <Route exact path="/orderlist" component={Ordlist} /> 
      </div>
    </Router>        
    )
    const none_user = (
      <Router>
        <div className="App">
          <Navbar />
          
          <Route exact path="/" component={Landing} />
          <div className="container">         
            <Route exact path="/login" render={(props) => <Login fnRefresh={this.fnRefresh} {...props} />}/>
            <Route exact path="/register" component={Register} />                                 
          </div>
        </div>
      </Router>      
    )
    return (
      <div>
         {localStorage.usertoken ? roll_user:none_user}         
      </div>     
    );
  }
}

export default App;
