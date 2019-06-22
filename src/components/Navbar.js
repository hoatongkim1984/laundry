import React, { Component } from 'react'
import {NavLink, Link, withRouter } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

class Navbar extends Component {
  
    logOut(e) {
        e.preventDefault()
        localStorage.removeItem('usertoken')
        this.props.history.push(`/`)
        this.props.fnRefresh();
    }

    render() {
        //console.log('this.props', this.props.location.pathname);
        const loginRegLink = (
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                        Login
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                        Register
                    </NavLink>
                </li>
            </ul>
        )
        const userLink = (
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <NavLink to="/addorder" className={this.props.location.pathname==="/"?"nav-link active":"nav-link"}>
                        ORDER
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink to="/clean" className="nav-link">
                        CLEAN
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink to="/ready" className="nav-link">
                        READY
                    </NavLink>
                </li>
               
                <li className="nav-item">
                    <NavLink to="/pickup" className="nav-link">
                        PICKUP
                    </NavLink>
                </li>              
            </ul>
        )
        const userDropDownLink = (
            <div>
                    <a  href="#" id="dropdownId" data-toggle="dropdown">
                    <img src="images/menu.png" width="30" height="30"/></a> 
                    <div className="dropdown-menu" aria-labelledby="dropdownId">
                        <ul >
                            <li className="dropdown-item">
                                <Link to="/orderlist"><img src="images/nbs.png" />  Search</Link>
                            </li>
                            <li className="dropdown-item">
                                <Link to="/customer"><img src="images/nbu.png" />  Customers</Link>
                            </li>
                            <li className="dropdown-item">
                                <Link to="/product"><img src="images/nbpr.png" />  Products</Link>
                            </li>
                            <li className="dropdown-item">
                                <Link to="/user"><img src="images/nbu.png" /> Users</Link>
                            </li>
                            <li className="dropdown-item">
                                <Link to="/todolist"><img src="images/nba.png" />  Submenu</Link>
                            </li>
                            <li className="dropdown-item">
                                <Link to="/help"><img src="images/nbh.png" />  Help</Link>                                
                            </li>
                            <li className="dropdown-item">
                                <Link to="/profile"><img src="images//profile.png" width="24" height="24"/> Profile</Link>
                            </li> 
                            <li className="dropdown-item"><a id="showSMS" href="" onClick={this.logOut.bind(this)}><img src="images/logout.png" width="24" height="24"  /> Logout</a></li>                            
                            
                        </ul>
                    </div>
                </div>      
        )
        return (            
            <nav className="navbar navbar-expand-sm bg-primary navbar-dark justify-content-center">
                {localStorage.usertoken ? userDropDownLink : ''}
                <div className="collapse navbar-collapse justify-content-md-center" id="navbar1">
                    {localStorage.usertoken ? userLink : loginRegLink}
                </div>
            </nav>
                /*
            <nav className="navbar navbar-expand-sm bg-primary navbar-dark justify-content-center">
                {localStorage.usertoken ? userDropDownLink : ''}
                <div className="collapse navbar-collapse justify-content-md-center"
                    id="navbar1">
                   
                     <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Active</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" href="#">Disabled</a>
                        </li>
                    </ul> 
                </div>                            
          </nav>
          */
          
          


// style={{'background-color':'#00AEFC', 'a.color':'white'}}
            /* 
                <nav className="navbar navbar-expand-lg rounded" >                                                                                  
                {localStorage.usertoken ? userDropDownLink : ''}
                <div className="collapse navbar-collapse justify-content-md-center"
                    id="navbar1">
                     <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                    </ul> 
                    {localStorage.usertoken ? userLink : loginRegLink}
                </div>
            </nav> 
            </div>           */
        )
    }
}

export default withRouter(Navbar)