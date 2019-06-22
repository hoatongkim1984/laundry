import React, { Component } from 'react';
import {Button} from 'antd';
import { exportExcel, expExcel, downloadFile } from './ExportFunction';
import { saveAs } from 'file-saver';
import { zip } from 'jszip';

var Excel = require('exceljs');

var FileSaver =  require('file-saver');
const BASE_URL = 'http://localhost:5000/';
var XLSX = require("xlsx");


function s2ab(s) {
  
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
    
}

class testexport extends Component {
    
    exportData=()=>{
        downloadFile(57).then((res)=>{
            // const url = window.URL.createObjectURL(res);
            // const a = document.createElement('a');
            // a.setAttribute('hidden','');
            // a.setAttribute('href', url);
            // a.setAttribute('download', '13.png');
            // document.body.appendChild(a);
            // a.click();
            // document.body.removeChild(a);            
        })
    }
    render() {
        return (
            <div>
                <Button onClick={this.exportData}>Export Excel</Button>  
            </div>
        );
    }
}

export default testexport;