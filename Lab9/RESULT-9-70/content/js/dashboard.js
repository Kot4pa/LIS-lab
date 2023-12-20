/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 42.44897959183673, "KoPercent": 57.55102040816327};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1683673469387755, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.21428571428571427, 500, 1500, "/contacts/-29"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "/delivery/-26"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "/wp-json/bk/v1/clients/reviews-28"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "/reviews/-27"], "isController": false}, {"data": [0.014285714285714285, 500, 1500, "/-31"], "isController": false}, {"data": [0.20714285714285716, 500, 1500, "/product_category/aktsii/-30"], "isController": false}, {"data": [0.1, 500, 1500, "/about/-25"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 490, 282, 57.55102040816327, 544.020408163265, 45, 2068, 144.5, 1401.4, 1576.25, 1803.8099999999997, 53.191489361702125, 1945.9022326517043, 38.34269329407295], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/contacts/-29", 70, 40, 57.142857142857146, 456.0285714285715, 45, 1156, 48.5, 1042.2, 1087.8500000000001, 1156.0, 12.694958287994197, 507.83729484040623, 9.248475471527021], "isController": false}, {"data": ["/delivery/-26", 70, 40, 57.142857142857146, 449.4857142857142, 45, 1149, 52.0, 1031.8, 1083.6, 1149.0, 26.6058532877233, 1073.7028161820601, 19.33081527936146], "isController": false}, {"data": ["/wp-json/bk/v1/clients/reviews-28", 70, 40, 57.142857142857146, 389.1714285714286, 45, 1036, 48.0, 889.9, 928.8000000000002, 1036.0, 15.401540154015402, 32.949584020902094, 10.107260726072607], "isController": false}, {"data": ["/reviews/-27", 70, 40, 57.142857142857146, 494.1285714285713, 45, 1255, 49.0, 1146.0, 1173.0, 1255.0, 19.525801952580196, 785.741915097629, 14.224851813110181], "isController": false}, {"data": ["/-31", 70, 41, 58.57142857142857, 681.3857142857141, 45, 1720, 47.0, 1634.8, 1682.55, 1720.0, 8.433734939759036, 423.6319888930723, 6.20176016566265], "isController": false}, {"data": ["/product_category/aktsii/-30", 70, 41, 58.57142857142857, 535.1285714285714, 45, 1434, 61.0, 1272.5, 1343.7000000000003, 1434.0, 10.404280618311534, 438.3389612440547, 7.742247881985731], "isController": false}, {"data": ["/about/-25", 70, 40, 57.142857142857146, 802.8142857142858, 142, 2068, 568.0, 1748.8999999999999, 1812.9, 2068.0, 30.51438535309503, 1250.476787271142, 22.17060810810811], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Temporarily Unavailable", 282, 100.0, 57.55102040816327], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 490, 282, "503/Service Temporarily Unavailable", 282, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/contacts/-29", 70, 40, "503/Service Temporarily Unavailable", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/delivery/-26", 70, 40, "503/Service Temporarily Unavailable", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/wp-json/bk/v1/clients/reviews-28", 70, 40, "503/Service Temporarily Unavailable", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/reviews/-27", 70, 40, "503/Service Temporarily Unavailable", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/-31", 70, 41, "503/Service Temporarily Unavailable", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/product_category/aktsii/-30", 70, 41, "503/Service Temporarily Unavailable", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/about/-25", 70, 40, "503/Service Temporarily Unavailable", 40, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
