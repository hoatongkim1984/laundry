import React, { Component } from 'react'
import { getProductList } from './ProductFunctions';
import {
    Table, Input, Button, Icon,
  } from 'antd';

import 'antd/es/input/style/index.css';
import 'antd/es/input/style/search-input.less';
import 'antd/es/table/style/index.css';

  

class  TableProduct extends Component {
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
                data[index].pro_name.toLowerCase().includes(
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
        getProductList().then(data => {
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
                key: 'pro_code',
                dataIndex: 'pro_code',
                render: (text, record, index) => {
                  return (
                    <a onClick={this.handleRowClick.bind(this, record)}>
                      {record.pro_code}
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
                  key: 'pro_name',
                  dataIndex: 'pro_name',
                  render: (text, record, index) => {
                    return (
                      <a onClick={this.handleRowClick.bind(this, record)}>
                        {record.pro_name}
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
                    key: 'pro_current_price',
                    dataIndex: 'pro_current_price',
                    render: (text, record, index) => {
                      return (
                        <a onClick={this.handleRowClick.bind(this, record)}>
                          {record.pro_current_price}
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
              key: 'is_type',
              dataIndex: 'is_type',
              render: (text, record, index) => {
                return (
                  <a onClick={this.handleRowClick.bind(this, record)}>
                    {record.is_type}
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

export default TableProduct;