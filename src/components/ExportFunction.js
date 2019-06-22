import axios from 'axios';
import { saveAs } from 'file-saver';
import * as jsPDF from 'jspdf';
var JSZip = require("jszip");
var FileSaver = require('file-saver');


export const exportExcel=(orderid)=>{
    return axios    
    .post('/export/up',{
        id : orderid
    },
    {                     
        responseType : 'blob',            
        headers:{'Context-Type': 'application/json'}            
    })          
    .then(res=>{              
        return new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });                        
    })
}

export const downloadFile=(orderid)=>{    
    var zip = new JSZip();  
    exportExcel(orderid).then((res) => {
        FileSaver.saveAs(res, 'order_' + orderid + '.xlsx');
    })
}

export const exportPDF=(ordItem, isPrint)=>{    
    var img = new Image();
    img.addEventListener('load', function() {
        var doc = new jsPDF('p', 'pt', [209.76, 297.64]);
        doc.addImage(img, 'png', 5, 5, 30, 20);
        var x = 10;
        var x2 = 65;
        var x3 = 50;
        var y = 14;
        doc.setFontSize(7);
        doc.setFontType("bold");
        doc.text("SYLVANIA HEIGHTS DRY CLEANERS", 42, y);   // y = 14 
        y+=9;   
        doc.text("ABN 49 458 662 108", 42, y);// y = 23 
        y+=9;

        doc.setFontSize(5);
        doc.setFontType("normal");
        doc.text("248 Princes Highway, Sylvania Heights NSW 2224", x, y);//y = 32
        y+=8;
        doc.text("T:(02) 9522 8181 - E: sylvaniadrycleaners@gmail.com", x, y);//y = 40
        y+=4;
        doc.setLineWidth(1);
        doc.line(0, y, 210, y); //y = 44   
        y+=11;

        doc.setFontSize(8);
        doc.setFontType("bold");
        doc.text("Docket No:", x, y);// y = 55        
        doc.setFontSize(11);
        doc.text(ordItem.orderNo + " ", x2, y);
        y+=5;

        doc.setLineWidth(0.1);
        doc.line(0, 60, 210, 60);//y = 60
        y+=7;

        doc.setFontSize(6);
        doc.setFontType("normal");
        doc.text("Tax Invoice Date:", x, y);
        var dt = ordItem.orderDate;                
        var parts = dt.split('-');                
        var Invoicedate = parts[2] +'/' + parts[1] + '/' + parts[0];
        doc.text(Invoicedate, x2, y);// y = 66
        y+=9;

        doc.setFontSize(7);
        doc.setFontType("bold");            
        doc.text(ordItem.cusName, x, y); //y = 75
        y+=9;

        doc.setFontSize(6);
        doc.setFontType("normal");
        doc.text("Phone:", x, y); //y = 84
        doc.text(ordItem.cusPhone, x2, y);
        
        y+=3;
        var y1=y;

        doc.line(0, y, 210, y); //y = 86  
        
        y+=7;
        doc.text("Qty:", x, y); //y = 93
        doc.text("Total(incl.GST):", x2, y);
        y+=2;

        doc.line(0, y, 210, y);
        doc.line(x3 - 5, y1, x3 - 5, y);
        y+=7;
        var arrDetail = Object.values(ordItem.child);        
        
        for(var i=0;i<arrDetail.length;i++){
            doc.text(arrDetail[i].proQty + '', x3-10, y, 'right');//y = 102
            doc.text(arrDetail[i].proName + ' ' + arrDetail[i].typeName, x3, y);
            doc.text(arrDetail[i].proAmount, 198, y, 'right');
            y += 7;                           
        }                
                 
        y -= 4;

        doc.line(160, y, 205, y);
        y += 7;

        doc.text("Total:", x3, y);
        doc.text("$"+ordItem.orderAmount + " ", 200, y, 'right');
        y += 8;
        if(ordItem.orderDiscount >0){
            //doc.setFontSize(4);
            //doc.setFontStyle('italic');
            //doc.text("Discount: " + ordItem.orderDiscount + "%", x3, y);
            doc.text("Discount: ", x3, y);
            doc.text("$" + ordItem.orderDiscount*ordItem.orderAmount*0.01 , 198, y, 'right');
            y += 8;
        }
        doc.text("Total(incl.GST): " , x3, y);
        
        // doc.setFontSize(6);
        // doc.setFontStyle('normal');
        doc.text(" $"+ordItem.orderTotal + " ", 200, y, 'right');
        y += 8;

        doc.text("Balance:", x3, y);
        doc.text("$"+(ordItem.orderTotal - ordItem.orderPaid) + " ", 200, y, 'right');
        y += 12;

        doc.setFontSize(7);
        doc.setFontType("bold");
        doc.text(ordItem.orderPieces + "pcs", x, y);            
        y += 8;
        
        doc.setFontSize(6);
        doc.setFontType("normal");
        doc.text("Ready:", x, y);             
        doc.setFontSize(10);
        doc.setFontType("bold");
        dt = new Date(ordItem.pickingDate);
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var PickingDate  = days[dt.getDay()];
       
        //console.log(dt, PickingDate);
        doc.text(PickingDate + " " + dt.toLocaleString('en-US', { hour: 'numeric', hour12: true }), 40, y); 
        y += 8;

        doc.setFontSize(6);
        doc.text("****Please advice if earlier needed.", x, y); 
        y += 14;
        
        doc.text("Note:", x, y); 
        y += 14;

        doc.text("*******End********", x, y); 

        if(isPrint==1){
            doc.autoPrint();        
            doc.output('dataurlnewwindow');  
        }
        else{
            //doc.save('order_' + ordItem + ".pdf");
            doc.save('order_' + ordItem.orderNo + ".pdf");
        }
        
    });
    img.src = 'images/logo.png';                   
}


var exportFunction = function(arr_i, _zip){    
    return new Promise(function(resolve, reject) {         
        exportExcel(arr_i).then((res)=>{                                   
            _zip.file('order_'+ arr_i + '.xlsx', res); 
            resolve(true)           
        })        
    });
}

export const downloadZipFile=(arr)=>{   
    var arr_file = [];
    var zip = new JSZip();     
    for (var i = 0; i < arr.length; i++ ){
        var orderid = arr[i];        
        arr_file.push(exportFunction(orderid, zip))        
    }  
    
    Promise.all(arr_file).then(values => {         
        zip.generateAsync({type:"blob"})
        .then(function(content) {            
            saveAs(content, "example.zip");
        });
    });   
}