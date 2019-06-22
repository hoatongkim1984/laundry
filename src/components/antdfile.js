import React, { Component } from 'react';
import { Table, Divider, Tag ,Input, Button, Icon, Badge, Menu, Dropdown,Switch, Radio, Form} from 'antd';
import { getOrderHeaderList, deleteOrderHeaderItem } from './OrderheaderFunctions';
import { getOrderDetailList, getOrderDetailByOrderNo, deleteOrderDetailItemByOrderNo } from './OrderdetailFunctions';
const FormItem = Form.Item;

const columns = [
  {
    title: 'Name',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 150,
    render: text => <a href="javascript:;">{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'orderDate',
    key: 'orderDate',
    width: 70,
  },
  {
    title: 'Address',
    dataIndex: 'cusName',
    key: 'cusName',
  },
  {
    title: 'Action',
    key: 'action',
    width: 360,
    render: (text, record) => (
      <span>
        <a href="javascript:;">Action 一 {record.name}</a>
        <Divider type="vertical" />
        <a href="javascript:;">Delete</a>
        <Divider type="vertical" />
        <a href="javascript:;" className="ant-dropdown-link">
          More actions <Icon type="down" />
        </a>
      </span>
    ),
  },
];
var columnsOrder = [
  { title: 'Order No', dataIndex: 'orderNo', key: 'orderNo'                        
    },
  { title: 'Order Date', dataIndex: 'orderDate' , key: 'orderDate'             
    },
  { title: 'Customer', dataIndex: 'cusName' , key: 'cusName'            
  
  },
  // { title: 'Phone', dataIndex: 'cusPhone' , key: 'cusPhone'},
  
  // { title: 'Quatity', dataIndex: 'orderQty' ,  key: 'orderQty',  align: 'right',},
  // { title: 'Pieces', dataIndex: 'orderPieces' , key: 'orderPieces',  align: 'right',},
  // { title: 'Amount', dataIndex: 'orderAmount' , key: 'orderAmount',  align: 'right'            
  // },
  // { title: 'Discount', dataIndex: 'orderDiscount' , key: 'orderDiscount',  align: 'right',},
  // { title: 'Total', dataIndex: 'orderTotal' , key: 'orderTotal',  align: 'right'            
  // },
  // { title: 'Paid', dataIndex: 'orderPaid' , key: 'orderPaid',  align: 'right',},                 
  // {
  //     title: 'Action',
  //     key: 'action',
  //     render: (text, record) => (
  //     <span>          
  //         <a href="javascript:;">Export Excel</a>
  //     </span>
  //     ),
  // },  
];

const data = [];
for (let i = 1; i <= 10; i++) {
  data.push({
    key: i,
    orderNo: `${i}2`,
    orderDate: 'John Brown',
    cusName: `New York No. ${i} Lake Park`,
    cusPhone: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
  });
}

const expandedRowRender = record => <p>{record.cusPhone}</p>;
const title = () => 'Here is title';
const showHeader = true;
const footer = () => 'Here is footer';
const scroll = { y: 240 };
const pagination = { position: 'bottom' };

class Antdfile extends Component {
    state = {
      bordered: false,
      loading: false,
      pagination,
      size: 'default',
      expandedRowRender,
      title: undefined,
      showHeader,
      footer,
      rowSelection: {},
      scroll: undefined,
      hasData: true,
      items:[]
    };

  componentDidMount() {
      this.getAll()
  }

  getAll = () => {
      getOrderHeaderList().then(data => {  
          for(let idx=0; idx < data.length; idx ++){            
              var orderno = data[idx].orderNo;
              data[idx].key = data[idx].id;
              // getOrderDetailByOrderNo(orderno).then(dataDetail => {
              //     for (var i = 0; i<dataDetail.length;i++){
              //       dataDetail[i].Name = dataDetail[i].proName + ' ' + dataDetail[i].typeName;
              //     }
              //     data[idx].child = {...dataDetail};
              // });
          }                               
        this.setState(
          {              
            items: [...data]
          }                        
        )          
      })        
    }

    handleToggle = prop => enable => {
      this.setState({ [prop]: enable });
    };

    handleSizeChange = e => {
      this.setState({ size: e.target.value });
    };

    handleExpandChange = enable => {
      this.setState({ expandedRowRender: enable ? expandedRowRender : undefined });
    };

    handleTitleChange = enable => {
      this.setState({ title: enable ? title : undefined });
    };

    handleHeaderChange = enable => {
      this.setState({ showHeader: enable ? showHeader : false });
    };

    handleFooterChange = enable => {
      this.setState({ footer: enable ? footer : undefined });
    };

    handleRowSelectionChange = enable => {
      this.setState({ rowSelection: enable ? {} : undefined });
    };

    handleScollChange = enable => {
      this.setState({ scroll: enable ? scroll : undefined });
    };

    handleDataChange = hasData => {
      this.setState({ hasData });
    };

    handlePaginationChange = e => {
      const { value } = e.target;
      this.setState({
        pagination: value === 'none' ? false : { position: value },
      });
    };

    render() {   
      const state = this.state;
      console.log("data", data);
      console.log("item", this.state.items);

    return (      
      <div>
        <div className="components-table-demo-control-bar">
          <Form layout="inline">
            <FormItem label="Bordered">
              <Switch checked={state.bordered} onChange={this.handleToggle('bordered')} />
            </FormItem>
            <FormItem label="loading">
              <Switch checked={state.loading} onChange={this.handleToggle('loading')} />
            </FormItem>
            <FormItem label="Title">
              <Switch checked={!!state.title} onChange={this.handleTitleChange} />
            </FormItem>
            <FormItem label="Column Header">
              <Switch checked={!!state.showHeader} onChange={this.handleHeaderChange} />
            </FormItem>
            <FormItem label="Footer">
              <Switch checked={!!state.footer} onChange={this.handleFooterChange} />
            </FormItem>
            <FormItem label="Expandable">
              <Switch checked={!!state.expandedRowRender} onChange={this.handleExpandChange} />
            </FormItem>
            <FormItem label="Checkbox">
              <Switch checked={!!state.rowSelection} onChange={this.handleRowSelectionChange} />
            </FormItem>
            <FormItem label="Fixed Header">
              <Switch checked={!!state.scroll} onChange={this.handleScollChange} />
            </FormItem>
            <FormItem label="Has Data">
              <Switch checked={!!state.hasData} onChange={this.handleDataChange} />
            </FormItem>
            <FormItem label="Size">
              <Radio.Group size="default" value={state.size} onChange={this.handleSizeChange}>
                <Radio.Button value="default">Default</Radio.Button>
                <Radio.Button value="middle">Middle</Radio.Button>
                <Radio.Button value="small">Small</Radio.Button>
              </Radio.Group>
            </FormItem>
            <FormItem label="Pagination">
              <Radio.Group
                value={state.pagination ? state.pagination.position : 'none'}
                onChange={this.handlePaginationChange}
              >
                <Radio.Button value="top">Top</Radio.Button>
                <Radio.Button value="bottom">Bottom</Radio.Button>
                <Radio.Button value="both">Both</Radio.Button>
                <Radio.Button value="none">None</Radio.Button>
              </Radio.Group>
            </FormItem>
          </Form>
        </div>
        <Table {...this.state} columns={columns} dataSource={state.hasData ? this.state.items: null} />
      </div>
    );

    }
}

export default Antdfile;
