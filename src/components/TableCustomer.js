import React, { Component } from 'react'
import { getCustomerList } from './CustomerFunctions';
import {
    Table, Input, Button, Icon,
  } from 'antd';

import 'antd/es/input/style/index.css';
import 'antd/es/input/style/search-input.less';
import 'antd/es/table/style/index.css';

  

class  TableCustomer extends Component {
    state = {
        textSearch: '',
        items: []
      };

      componentDidMount() {
        this.getAll()
      }

      _getDataSourceOfTable(data) {
        if (this.state.textSearch == null || this.state.textSearch === '') {
          return data;
        } else {
          var result = [];
          if (data && data.length > 0) {
            for (let index = 0; index < data.length; index++) {
              if (
                this.state.textSearch != null &&
                this.state.textSearch !== '' &&
                data[index].first_name.toLowerCase().includes(
                  this.state.textSearch.toLowerCase(),
                )
              ) {
                result.push(data[index]);
              }
            }
            return result;
          } else {
            return [];
          }
        }
      }

      getAll = () => {
        getCustomerList().then(data => {
          this.setState(
            {              
              items: [...data]
            },
            () => {
              console.log(this.state.items)
            }
          )
        })
        console.log( this.state.items);        
      }

    _onSearch = value => {
        this.setState({
          textSearch: value,
        });
      };

      handleRowClick = (record, rowIndex) => {
       console.log('row click', record);
       this.props.resultReceiveFunction(record);
       this.setState({
        textSearch: '',
      });
      };

     
    
    render(){     
        console.log('enter render table');        
        const dataTable = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
          }, {
            key: '2',
            name: 'Joe Black',
            age: 42,
            address: 'London No. 1 Lake Park',
          }, {
            key: '3',
            name: 'Jim Green',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
          }, {
            key: '4',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
          }];

        var dataSoure = this._getDataSourceOfTable(this.state.items);

        const columns = [{
            
                title: (
                  <div
                    style={{ textAlign: 'center' }}
                    onClick={this._onClickTextSearch}
                  >
                    {/* <div>Eform Name</div>
                    <br /> */}
                    <Input
                      ref={'searchEformName'}                      
                      onChange={e => this._onSearch(e.target.value)}
                      style={{ width: '100%', marginBottom: 8, display: 'block' }}
                      value={this.state.textSearch}
                    />
                  </div>
                ),
                key: 'cus_code',
                dataIndex: 'cus_code',
                render: (text, record, index) => {
                  return (
                    <a onClick={this.handleRowClick.bind(this, record)}>
                      {record.cus_code}
                    </a>
                  );
                }
            }, {

                title: (
                    <div
                      style={{ textAlign: 'center' }}
                      onClick={this._onClickTextSearch}
                    >
                      {/* <div>Eform Name</div>
                      <br /> */}
                      <Input
                        ref={'searchEformName'}                        
                        onChange={e => this._onSearch(e.target.value)}
                        style={{ width: '100%', marginBottom: 8, display: 'block' }}
                      />
                    </div>
                  ),
                  key: 'first_name',
                  dataIndex: 'first_name',
                  render: (text, record, index) => {
                    return (
                      <a onClick={this.handleRowClick.bind(this, record)}>
                        {record.first_name}
                      </a>
                    );
                  }
                }, {

                  title: (
                      <div
                        style={{ textAlign: 'center' }}
                        onClick={this._onClickTextSearch}
                      >
                        {/* <div>Eform Name</div>
                        <br /> */}
                        <Input
                          ref={'searchEformName'}                        
                          onChange={e => this._onSearch(e.target.value)}
                          style={{ width: '100%', marginBottom: 8, display: 'block' }}
                        />
                      </div>
                    ),
                    key: 'last_name',
                    dataIndex: 'last_name',
                    render: (text, record, index) => {
                      return (
                        <a onClick={this.handleRowClick.bind(this, record)}>
                          {record.last_name}
                        </a>
                      );
                    }
                  }, {

                    title: (
                        <div
                          style={{ textAlign: 'center' }}
                          onClick={this._onClickTextSearch}
                        >
                          {/* <div>Eform Name</div>
                          <br /> */}
                          <Input
                            ref={'searchEformName'}                        
                            onChange={e => this._onSearch(e.target.value)}
                            style={{ width: '100%', marginBottom: 8, display: 'block' }}
                          />
                        </div>
                      ),
                      key: 'phone',
                      dataIndex: 'phone',
                      render: (text, record, index) => {
                        return (
                          <a onClick={this.handleRowClick.bind(this, record)}>
                            {record.phone}
                          </a>
                        );
                      }
                    }, {

                      title: (
                          <div
                            style={{ textAlign: 'center' }}
                            onClick={this._onClickTextSearch}
                          >
                            {/* <div>Eform Name</div>
                            <br /> */}
                            <Input
                              ref={'searchEformName'}                        
                              onChange={e => this._onSearch(e.target.value)}
                              style={{ width: '100%', marginBottom: 8, display: 'block' }}
                            />
                          </div>
                        ),
                        key: 'email',
                        dataIndex: 'email',
                        render: (text, record, index) => {
                          return (
                            <a onClick={this.handleRowClick.bind(this, record)}>
                              {record.email}
                            </a>
                          );
                        }                                                                                          
          }, {

            title: (
                <div
                  style={{ textAlign: 'center' }}
                  onClick={this._onClickTextSearch}
                >
                  {/* <div>Eform Name</div>
                  <br /> */}
                  <Input
                    ref={'searchEformName'}
                    placeholder={'Eform Name'}
                    onChange={e => this._onSearch(e.target.value)}
                    style={{ width: '100%', marginBottom: 8, display: 'block' }}
                  />
                </div>
              ),
              key: 'address',
              dataIndex: 'address',
              render: (text, record, index) => {
                return (
                  <a onClick={this.handleRowClick.bind(this, record)}>
                    {record.address}
                  </a>
                );
              }

           
          }];

        return(
            <div>
              <Table
                  dataSource={dataSoure}
                  columns={columns}
                  onFilter={this._onSearch.bind(this)}
                  pagination={false}
                  scroll={{ y: 500 }}
                  bordered={true}
                  />
            </div>
        )
    }
};

export default TableCustomer;