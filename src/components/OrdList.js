import React, { Component } from 'react';
import { getOrderHeaderList, deleteOrderHeaderItem } from './OrderheaderFunctions';
import { getOrderDetailList, getOrderDetailByOrderNo, deleteOrderDetailItemByOrderNo } from './OrderdetailFunctions';
import { Table, Divider, Popconfirm, Tag ,Input, Button, Icon, Badge, Menu, Dropdown,Switch, Radio, Form} from 'antd';
import Highlighter from 'react-highlight-words';
import { downloadFile, downloadZipFile, exportPDF } from './ExportFunction';
import axios from 'axios';
var FileSaver =  require('file-saver');

const { Column, ColumnGroup } = Table;

class OrdList extends Component {
    constructor() {
            super()
            this.state = {                       
                items: []  ,
                selectedRowKeys: [],                   
                sortedInfo: null,              
                searchText: '',                
            }                                    
        }            

    componentDidMount() {
        this.getAll()
    }

    getAll = () => {
        getOrderHeaderList().then(data => { 
          if (data){           
            for(let idx=0; idx < data.length; idx ++){
                var orderno = data[idx].orderNo;
                data[idx].key = data[idx].id;
                // var dt = new Date(data[idx].orderDate);
                // data[idx].ordDate = dt;
                // data[idx].dateOrder = DateTime.fromJSDate(dt).toFormat("dd'/'MM'/'yyyy")

                getOrderDetailByOrderNo(orderno).then(dataDetail => {
                    for (var i = 0; i<dataDetail.length;i++){
                      dataDetail[i].Name = dataDetail[i].proName + ' ' + dataDetail[i].typeName;
                      dataDetail[i].key = dataDetail[i].id;                      
                    }
                    data[idx].child = {...dataDetail};
                });
            }                               
            this.setState(
              {              
                items: [...data]
              }                        
            ) 
          }         
        })        
      }

    onDelete = (val, e) => {
        e.preventDefault()
        deleteOrderHeaderItem(val).then(() => {
            this.getAll()
        })
    }

    selectRow = (record) => {
        const selectedRowKeys = [...this.state.selectedRowKeys];
        if (selectedRowKeys.indexOf(record.key) >= 0) {
          selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        } else {
          selectedRowKeys.push(record.key);
        }
        this.setState({ selectedRowKeys });                
      }

      onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {                
        this.setState({ selectedRowKeys });
      }

      handleChange = (pagination, filters, sorter) => {        
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({          
          sortedInfo: sorter,       
        });
      };

      getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text => (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text!==undefined?text.toString():''}
          />
        ),
      });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        this.setState({ searchText: '' });
    };

    clearAll = () => {
        this.setState({          
          sortedInfo: null,       
        });
      };
          

    exportData=(record)=>{                
        downloadFile(record.id);  
    }

    exportManyData=()=>{        
        downloadZipFile(this.state.selectedRowKeys);
    }

    render() {        
        const columnsDetail = [         
          {
            title: 'Code',
            dataIndex: 'proCode',
            key: 'proCode',
            width: 140,
          },
          {
            title: 'Name',
            dataIndex: 'Name',
            key: 'Name',
            width: 320,
          },
          {
            title: 'Quatity',
            dataIndex: 'proQty',
            key: 'proQty',
            width:40,
            align: 'right',
          },         
          {
            title: 'Pieces',
            dataIndex: 'proPieces',
            key: 'proPieces',
            width: 10,
            align: 'right',
          },
          {
            title: 'Amount',
            dataIndex: 'proAmount',
            key: 'proAmount',
            width: 30,
            align: 'right',
          },
          {
            width: 290,
          }          
        ];
        
        const expandedRow = row => {                
          return <Table columns={columnsDetail} dataSource={Object.values(row.child)} pagination={false} />;          
        };        

        const { selectedRowKeys } = this.state;  
        const rowSelection = {            
            onChange: this.onSelectedRowKeysChange,            
          };       
        
        this.state.sortedInfo = this.state.sortedInfo || {};
        this.state.filteredInfo = this.state.filteredInfo || {};      

        var columns = [
            { title: 'Order No', dataIndex: 'orderNo', key: 'orderNo'                        
            ,...this.getColumnSearchProps('orderNo')
            ,sorter: (a, b) => a.orderNo - b.orderNo,
            sortOrder: this.state.sortedInfo.columnKey === 'orderNo' && this.state.sortedInfo.order,
            },
            { title: 'Order Date', dataIndex: 'orderDate' , key: 'orderDate'             
            ,...this.getColumnSearchProps('orderDate') 
            ,sorter: (a, b) => a.orderDate.localeCompare(b.orderDate),
            sortOrder: this.state.sortedInfo.columnKey === 'orderDate' && this.state.sortedInfo.order,
            },            
            { title: 'Picking Date', dataIndex: 'pickingDate' , key: 'pickingDate'             
            ,...this.getColumnSearchProps('pickingDate') 
            ,sorter: (a, b) => a.pickingDate.localeCompare(b.pickingDate),
            sortOrder: this.state.sortedInfo.columnKey === 'pickingDate' && this.state.sortedInfo.order,
            },
            { title: 'Customer', dataIndex: 'cusName' , key: 'cusName'            
            ,...this.getColumnSearchProps('cusName')
            ,sorter: (a, b) => a.cusName.length - b.cusName.length,
            sortOrder: this.state.sortedInfo.columnKey === 'cusName' && this.state.sortedInfo.order,
            },
            { title: 'Phone', dataIndex: 'cusPhone' , key: 'cusPhone'
            ,...this.getColumnSearchProps('cusPhone')},
            { title: 'Quatity', dataIndex: 'orderQty' ,  key: 'orderQty',  align: 'right',},
            { title: 'Pieces', dataIndex: 'orderPieces' , key: 'orderPieces',  align: 'right',},
            { title: 'Amount', dataIndex: 'orderAmount' , key: 'orderAmount',  align: 'right'            
            },
            { title: 'Discount', dataIndex: 'orderDiscount' , key: 'orderDiscount',  align: 'right',},
            { title: 'Total', dataIndex: 'orderTotal' , key: 'orderTotal',  align: 'right'            
            },
            { title: 'Paid', dataIndex: 'orderPaid' , key: 'orderPaid',  align: 'right',},                 
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => 
                this.state.items.length >= 1 ? ( 
                  <span>
                    <a href="javascript:;" onClick={()=>downloadFile(record.id)}>Export Excel</a> 
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={()=>exportPDF(record, 0)}>Export PDF</a> 
                    </span>
                ): null,
            }           
        ];      
        
        return (
            <div>
                <div className="table-operations">
                    {/* <Button onClick={this.setAgeSort}>Print Pdf</Button> */}
                    <Button onClick={this.exportManyData}>Export List Excel</Button>                    
                </div>
                <Table 
                     expandedRowRender={expandedRow}
                    rowSelection={rowSelection}
                    columns={columns} 
                    dataSource={this.state.items} 
                    onChange={this.handleChange}
                    onRow={(record) => ({
                        onClick: () => {
                          this.selectRow(record);
                        },
                      })}
                />
                <iframe 
                    src="E:/a.xlsx" id="myFrame" 
                    frameborder="0" style={{border:0, width:300, height:300}}>
                </iframe>
            </div>
        );
    }
}

export default OrdList;
