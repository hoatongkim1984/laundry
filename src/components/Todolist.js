import React, { Component } from 'react';
import { getList, addToList, deleteItem, updateItem } from './ListFunctions'

class Todolist extends Component {
    constructor() {
      super()
      this.state = {
        id: '',
        term: '',
        term_content: '',
        term_type: '',
        editDisabled: false,
        items: []
      }
      this._handleKeyPress = this._handleKeyPress.bind(this);
      this.onSubmit = this.onSubmit.bind(this)
      this.onChange = this.onChange.bind(this)
    }
  
    componentDidMount() {
      this.getAll()

      for (let x in this.refs) {
        this.refs[x].onkeypress = (e) => 
          this._handleKeyPress(e, this.refs[x]);
      }
      this.refs.term.focus();
    }

    _handleKeyPress(e, field) {
      // If enter key is pressed, focus next input field.
      if (e.keyCode === 13) {
        e.preventDefault();
        let next = this.refs[field.name].nextSibling;
        // console.log("vemt:" );
        // console.log(this.refs);
        // console.log(next);
        // console.log("ANC");
        if (next && next.tagName === "INPUT") {
          this.refs[field.name].nextSibling.focus();
        }
      }
    }

    onChange=(event)=>{
      const name = event.target.name;
      const value = event.target.value;        
      this.setState({
        [name]:value
      })
  
    }

    getAll = () => {
      getList().then(data => {
        if(data){
          this.setState(
            {
              term: '',
              term_content: '',
              term_type: '',
              items: [...data]
            },
            () => {
              console.log(this.state.items)
            }
          )
        }        
      })
    }
  
    onSubmit = e => {
      e.preventDefault()
      addToList(this.state.term, this.state.term_content, this.state.term_type).then(() => {
        this.getAll()
      })
      this.setState({ editDisabled: false })
    }
  
    onUpdate = e => {
      e.preventDefault()      
      updateItem(this.state.term, this.state.term_content, this.state.term_type, this.state.id).then(() => {
        this.getAll()
      })
      this.setState({ editDisabled: false })
    }
  
    onEdit = (item, item_content, item_type, itemid, e) => {
      e.preventDefault()
      this.setState({
        id: itemid,
        term: item,
        term_content: item_content,
        term_type: item_type
      })
    }
  
    onDelete = (val, e) => {
      e.preventDefault()
      deleteItem(val).then(() => {
        this.getAll()
      })
    }

    onSave=(event)=>{                               
      if (this.state.id){        
        this.onUpdate(event)        
      }
      else{           
        this.onSubmit(event)
      }             
    }
  
    render() {
      return (
        <div className="container">

            <div className="col">
                <div align="center"> 
                    <h1>
                        Task Managment
                    </h1>                
                </div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="taskName">Name </label>
                        <input type="text" value={this.state.term || ''}  onChange={this.onChange.bind(this)} className="form-control" name="term" id="term" ref="term" aria-describedby="helpIdtaskName" placeholder="Task Name" />
                        <small id="helpIdtaskName" className="form-text text-muted">Input Task Name</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="taskContent">Type</label>
                        <input type="text" value={this.state.term_type || ''}  onChange={this.onChange.bind(this)} className="form-control" name="term_type" id="term_type" ref="term_type" aria-describedby="helpIdtaskContent" placeholder="Type" />
                        <small id="helpIdtaskContent" className="form-text text-muted">Input Type</small>
                    </div>                       
                    <div className="form-group">
                        <label htmlFor="taskContent">Content</label>
                        <textarea  value={this.state.term_content || ''}  onChange={this.onChange.bind(this)} className="form-control" rows="3" name="term_content" ref="term_content" id="term_content" aria-describedby="helpIdtaskContent" placeholder="Task Content" />
                        <small id="helpIdtaskContent" className="form-text text-muted">Input Task Content</small>
                    </div>                    
                    
                    <button type="reset" onClick={(event)=>this.onSave(event)} className="btnNormal">Save</button>
                </form>
            </div>          

          <div className="col wrapper">
                <div id="noteList" role="tablist" aria-multiselectable="true">
                    {this.state.items.map((item, index) => (
                    <div className="card">
                        <div className="card-header" role="tab" id="note1">
                            <h5 className="mb-0">
                                <a data-toggle="collapse" data-parent="#noteList" href={"#number"+index} aria-expanded="true" aria-controls="noteContent1">
                                {item.task_name}
                                </a>
                                <div className="btn-group float-right">
                                    <button className="btnNormal" onClick={this.onEdit.bind(this, item.task_name, item.task_content, item.type, item.id)}>Sửa</button>
                                    &nbsp;
                                    <button className="btnNormal" onClick={this.onDelete.bind(this, item.id)}>Xóa</button>
                                </div>
                            </h5>
                        </div>
                        <div id={"number"+index} className="collapse in" role="tabpanel" aria-labelledby="note1">
                            <div className="card-body">
                                Type: {item.type}                 
                            </div>                    
                            <div className="card-body">
                                Content: {item.task_content}                 
                            </div>                                                
                        </div>
                    </div>        
                    ))}
                </div>
            </div>         
        </div>
      )
    }
  }

export default Todolist;