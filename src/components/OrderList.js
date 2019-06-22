import React, { Component } from 'react';
import { getOrderHeaderList, deleteOrderHeaderItem } from './OrderheaderFunctions';
import { getOrderDetailList, deleteOrderDetailItemByOrderNo } from './OrderdetailFunctions';
import { Card, Button, FontIcon, Checkbox } from 'react-md';
import DataTable from 'react-data-table-component';


// import 'react-data-components/css/table-twbs.css';
// var DataTable = require('react-data-components').DataTable;

// var names = [ 'Carlos', 'Juan', 'Jesus', 'Alberto', 'John' ];
// var cities = [ 'Chicago', 'Tampico', 'San Francisco', 'Mexico City', 'Boston', 'New York' ];
// var addresses = [ '333 West Wacker Drive', '1931 Insurgentes Sur', '1 Lombard Street', '55 Av Hidalgo'];

// var data = [];
// for (var i = 0; i < 1000; i++) {
//   data.push({
//     id: i,
//     name: names[~~(Math.random() * names.length)],
//     city: cities[~~(Math.random() * cities.length)],
//     address: addresses[~~(Math.random() * addresses.length)]
//   });
// }


// const columns = [
//   {
//     name: 'Order No',
//     selector: 'orderNo',
//     sortable: true,
//   },
//   {
//     name: 'Order Date',
//     selector: 'orderDate',
//     sortable: true,
//     right: true,
//   },
// ];
class OrderList extends Component {
    // constructor() {
    //     super()
    //     this.state = {                       
    //         items: [],                        
    //         selectedRows: [], 
    //         toggleCleared: false
    //     }               
    // }

    state = { selectedRows: [], toggleCleared: false, items:[] };

    componentDidMount() {
        this.getAll()
    }

    getAll = () => {
        getOrderHeaderList().then(data => {                                 
          this.setState(
            {              
              items: [...data]
            }
          )
        })        
      }

    onDelete = (val, e) => {
        e.preventDefault()
        deleteOrderHeaderItem(val).then(() => {
            this.getAll()
        })
    }

    handleChange = (state) => {
      console.log('state ', state);
      this.setState(
        { 
          selectedRows: state.selectedRows 
        });
    };

    handleRowClicked = row => {
      console.log("row", row);
    };

    deleteAll = () => {
        const { selectedRows } = this.state;
        const rows = selectedRows.map(r => r.name);

        console.log(selectedRows);
        
        // if (window.confirm(`Are you sure you want to delete:\r ${rows}?`)) {
        //   this.setState(state => ({
        //     toggleCleared: !state.toggleCleared,
        //     items: differenceBy(state.items, state.selectedRows, 'name'),
        //   }));
        // }
      };

      deleteOne = (row) => {
        //${row.name}
        console.log("row", row);
        
        if (window.confirm(`Are you sure you want to delete:\r?`)) {
          // const { data } = this.state;
          // const index = items.findIndex(r => r === row);

          // this.setState(state => ({
          //   toggleCleared: !state.toggleCleared,
          //   items: [...state.data.slice(0, index), ...state.data.slice(index + 1)],
          // }));
        }
      };

    render() {
        console.log(this.state.items);
        const actions = [
          <Button key="Add" flat secondary >
            Add New
          </Button>,
        ];

        const contextActions = [
          <Button key="Delete" onClick={()=>this.deleteAll()} style={{ color: 'red' }} icon>
            Delete Checked
          </Button>,
        ];

        var columns = [
          { name: 'Order No', selector: 'orderNo', sortable: true},
          { name: 'Order Date', selector: 'orderDate' , sortable: true},
          { name: 'Customer', selector: 'cusName' , sortable: true},
          { name: 'Phone', selector: 'cusPhone' , sortable: true},
          { name: 'Quatity', selector: 'orderQty' , sortable: true},
          { name: 'Pieces', selector: 'orderPieces' , sortable: true},
          { name: 'Amount', selector: 'orderAmount' , sortable: true},
          { name: 'Discount', selector: 'orderDiscount' , sortable: true},
          { name: 'Total', selector: 'orderTotal' , sortable: true},
          { name: 'Paid', selector: 'orderPaid' , sortable: true},
          {
            cell: () => (
              <Button raised primary onClick={(row)=>this.deleteOne(row)} >
                Delete
              </Button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
          },
        ];
        const { items, toggleCleared } = this.state;
        return (
            <div>
              <Card style={{ height: '100%' }}>
                <DataTable
                  title="Order List"
                  columns={columns}
                  data={items}
                  selectableRows
                  highlightOnHover                
                  actions={actions}
                  contextActions={contextActions}                
                  onTableUpdate={this.handleChange}
                  clearSelectedRows={toggleCleared}
                  onRowClicked={(row)=>this.handleRowClicked(row)}
                  pagination     
                />
              </Card>                
            </div>
        );
    }
}

export default OrderList;
