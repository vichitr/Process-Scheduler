var p = [];
var index = 1;
var gantt = [];
var result = [];
var colors = ["#e040fb", "#ff80ab", "#3f51b5", "#1e88e5", "#009688", "#4caf50", "#cddc39", "#ffeb3b", "#607d8b", "#ff9800"];
var atat = 0.0;
var awt = 0.0;
var pixel = 0;
var t = 0;
var flg = -1;
var quantum;
function addToList() {   
    var at = document.getElementById("newat").value;
    var bt = document.getElementById("newbt").value;
    if (isNaN(parseInt(at)) && isNaN(parseInt(bt))) {
        window.alert("Please enter valid inputs");
        return;
    }
    if (isNaN(parseInt(at))) {
        window.alert("Please enter numeric value of arrival time");
        return;
    }
    if (isNaN(parseInt(bt))) {
        window.alert("Please enter numeric value of burst time");
        return;
    }
    if (parseInt(at)<0 && parseInt(bt)<=0) {
        window.alert("Invalid inputs");
        return;
    }
    if (parseInt(at)<0) {
        window.alert("Please enter valid value of arrival time");
        return;
    }
    if (parseInt(bt)<=0) {
        window.alert("Please enter positive value of burst time");
        return;
    }
    p.push({
        "at": parseInt(at),
        "bt": parseInt(bt),
        "rt": parseInt(bt),
        "id": index,
        "wt": 0,
        "tat": 0,
        "ct": 0,
        "valid": 0
    });
    //window.alert("You submitted!");
    index = index + 1;
    displayList();
    document.getElementById("newat").value = "";
    document.getElementById("newbt").value = "";
}

function displayList() {
    var inp = document.getElementById("showinput");
    inp.setAttribute("style", "height:" + p.length * 80 + "px");
    inp.innerHTML = "";
    for (var i = 0; i < p.length; i++) {
        var card = document.createElement("div");
        card.setAttribute("class", "card");
        var pid = document.createElement("span");
        pid.textContent = "P" + (i + 1) + "    ";
        pid.setAttribute("style", "float:left;margin-left:20px;");
        //card.setAttribute("style", "float:left;");
        card.setAttribute("style", "height:auto; width:100%;");
        var input1 = document.createElement("input");
        input1.value = p[i].at;
        input1.setAttribute("class", "form-control");
        input1.setAttribute("style", "width:350px;float:center;margin-left:100px;text-align:center; opacity: 1.0;");
        input1.setAttribute("disabled", "disabled");
        input1.setAttribute("id", "at" + i);
        var input2 = document.createElement("input");
        input2.value = p[i].bt;
        input2.setAttribute("class", "form-control");
        input2.setAttribute("disabled", "disabled");
        input2.setAttribute("id", "bt" + i);
        input2.setAttribute("style", "width:350px;float:center;margin-left:100px;text-align:center; opacity: 1.0;");
        var btn = document.createElement("button");
        var text1 = document.createTextNode("EDIT");
        btn.appendChild(text1);
        btn.setAttribute("id", "btn" + i);
        btn.setAttribute("class", "btn btn-warning");
        btn.setAttribute("onclick", "edit(this.id)");
        btn.setAttribute("style", "float:right;margin-right:50px;");
        var br = document.createElement("br");
        card.appendChild(pid);
        //card.appendChild(pid);
        card.appendChild(input1);
        card.appendChild(input2);
        card.appendChild(btn);
        inp.appendChild(card);
        //inp.appendChild(br);
    }
}

function edit(id) {
    var pos = parseInt(id.substr(3));
    var button = document.getElementById(id);
    button.innerHTML = "SAVE";
    button.setAttribute("onclick", "save(" + pos + ")");
    document.getElementById("at" + pos).removeAttribute("disabled");
    document.getElementById("bt" + pos).removeAttribute("disabled");
}

function save(pos) {
    p[pos].at = parseInt(document.getElementById("at" + pos).value);
    p[pos].bt = parseInt(document.getElementById("bt" + pos).value);
    displayList();
}

function srtf() {
    var operation = document.getElementById("operations");
    operation.innerHTML = "";
    var br = document.createElement("br");
    //$("#operations").append("<p> hi</p>");
    p.sort(function (a, b) {
        return a.at - b.at;
    });
    gantt = [];
    t = 0;
    var done = 0;
    var count = 0;
    var x = 0;
    var k = -1;
    var min;
    var prev = k;
    var y = 0;
    var f = 0;
    while (done != 1) {
        k = -1;
        min = 9999;
        for (var i = 0; i < p.length; i++) {
            if (p[i].at <= t && p[i].valid == 0 && p[i].rt < min) {
                k = i;
                min = p[i].rt;
            }
        }
        t += 1;
        if (k != -1)
            p[k].rt -= 1;
 
        if ( k == -1) {
            y += 1;
        }
        else if (k == prev) {
            x += 1;
        }
        else {
            if (y > 0) {
                var newdiv = document.createElement("div");
                newdiv.setAttribute("style", "margin-left: 500px; width:100%; font-size: 20px;");
                newdiv.textContent = "t = " + (t - y-1) + ": CPU is idle.";
                operation.appendChild(br);
                operation.appendChild(newdiv);
                operation.appendChild(br);
                gantt.push({
                    "id": -1,
                    "start": t - y-1,
                    "end": t-1
                });
                y = 0;
            }
            else {
                if (f == 0) {
                    f = 1;
                }
                else {
                    var newdiv = document.createElement("div");
                    newdiv.setAttribute("style", "margin-left: 500px; width:100%; font-size: 20px;");
                    newdiv.textContent = "t = " + (t - x) + ": Process-" + p[prev].id + " entered CPU and being executed";
                    operation.appendChild(br);
                    operation.appendChild(newdiv);
                    operation.appendChild(br);
                    gantt.push({
                        "id": p[prev].id,
                        "start": t - x,
                        "end": t
                    });
                    x = 0;
                    if (p[prev].rt == 0) {
                        count += 1;
                        p[prev].valid = 1;
                        p[prev].ct = t;
                        p[prev].tat = t - p[prev].at;
                        p[prev].wt = p[prev].tat - p[prev].bt;
                    }
                }
            }   
        }
        if (k!= -1 && count == p.length - 1) {
            var newdiv = document.createElement("div");
            newdiv.setAttribute("style", "margin-left: 500px; width:100%; font-size: 20px;");
            newdiv.textContent = "t = " + (t - 1) + ": Process-" + p[k].id + " entered CPU and being executed";
            operation.appendChild(br);
            operation.appendChild(newdiv);
            operation.appendChild(br);
            gantt.push({
                "id": p[k].id,
                "start": t - 1,
                "end": t + p[k].rt
            });
            t += p[k].rt;
            p[k].valid = 1;
            p[k].ct = t;
            p[k].tat = t - p[k].at;
            p[k].wt = p[k].tat - p[k].bt;
            
            done = 1;
        }
        prev = k;
    }
    for (var i = 0; i < gantt.length; i++) {
        var p1 = document.createElement("p");
        p1.textContent = i + "id: " + gantt[i].id + " start: " + gantt[i].start + " end: " + gantt[i].end;
        operations.appendChild(p1);
    }
    var total_tat = 0.0, total_wt = 0.0;
    for (var i = 0; i < p.length; i++) {
        total_tat += p[i].tat;
        total_wt += p[i].wt;
    }
    atat = (total_tat / p.length).toFixed(2);
    awt = (total_wt / p.length).toFixed(2);
    t = 0;
    return;
}

function sjf() {
    var operation = document.getElementById("operations");
    operation.innerHTML = "";
    var br = document.createElement("br");
    //$("#operations").append("<p> hi</p>");
    p.sort(function (a, b) {
        return a.at - b.at;
    });
    gantt = [];
    t = 0;
    var done = 0;
    var count = 0, x=0;
    var k = -1;
    var min;
    while (done != 1) {
       // k = 0;
        k = -1;
        min = 9999;
        for (var i = 0; i < p.length; i++) {
            if (p[i].at <= t && p[i].valid == 0 && p[i].bt < min) {
                k = i;
                min = p[i].bt;
            }
        }
        if (k == -1) {
            x += 1;
            t += 1;
            //continue;
        }
        else {
            if (x > 0) {
                var newdiv = document.createElement("div");
                newdiv.setAttribute("style", "margin-left: 500px; width:100%; font-size: 20px;");
                newdiv.textContent = "t = " + t - x + ": CPU is idle.";
                operation.appendChild(br);
                operation.appendChild(newdiv);
                operation.appendChild(br);
                gantt.push({
                    "id": -1,
                    "start": t - x,
                    "end": t
                });
                x = 0;
            }
            var newdiv = document.createElement("div");
            newdiv.setAttribute("style", "margin-left: 500px; width:100%; font-size: 20px;");
            newdiv.textContent = "t = " + t + ": Process-" + p[k].id + " entered CPU and being executed";
            operation.appendChild(br);
            operation.appendChild(newdiv);
            operation.appendChild(br);
            gantt.push({
                "id": p[k].id,
                "start": t,
                "end": t + p[k].bt
            });
            t = t + p[k].bt;
            p[k].ct = t;
            p[k].tat = t - p[k].at;
            p[k].wt = p[k].tat - p[k].bt;
            p[k].valid = 1;
            count += 1;
        }
        if (count == p.length) {
            done = 1;
        }
    }
}

function rr() {
    var operation = document.getElementById("operations");
    operation.innerHTML = "";
    var br = document.createElement("br");
    //$("#operations").append("<p> hi</p>");
    p.sort(function (a, b) {
        return a.at - b.at;
    });
    gantt = [];
    t = 0;

}

function fcfs() {
    var operation = document.getElementById("operations");
    operation.innerHTML = "";
    var br = document.createElement("br");
    //$("#operations").append("<p> hi</p>");
    p.sort(function (a, b) {
        return a.at - b.at;
    });
    gantt = [];
    t = 0;
    for (var i = 0; i < p.length; i++) {
        if (p[i].at <= t) {
            var newdiv = document.createElement("div");
            newdiv.setAttribute("style", "margin-left: 500px; width:100%; font-size: 20px;");
            newdiv.textContent = "t = " + t + ": Process-" + p[i].id + " entered CPU and being executed";
            operation.appendChild(br);
            operation.appendChild(newdiv);
            operation.appendChild(br);
            gantt.push({
                "id": p[i].id,
                "start": t,
                "end": t + p[i].bt
            });
            t = t + p[i].bt;
            p[i].ct = t;
            p[i].tat = t - p[i].at;
            p[i].wt = p[i].tat - p[i].bt;
            
        }
        else {
            var newdiv = document.createElement("div");
            newdiv.setAttribute("style", "margin-left: 500px; width:100%; font-size: 20px;");
            newdiv.textContent = "t = " + t + ": CPU is idle.";
            operation.appendChild(br);
            operation.appendChild(newdiv);
            operation.appendChild(br);
            gantt.push({
                "id": -1,
                "start": t,
                "end": p[i].at
            });
            t = p[i].at;
            var newdiv = document.createElement("div");
            newdiv.setAttribute("style", "margin-left: 500px; width:100%; font-size: 20px;");
            newdiv.textContent = "t = " + t + ": Process-" + p[i].id + " entered CPU and being executed"; 
            operation.appendChild(br);
            operation.appendChild(newdiv);
            operation.appendChild(br);
            gantt.push({
                "id": p[i].id,
                "start": t,
                "end": t + p[i].bt
            });
            t = t + p[i].bt;
            p[i].ct = t;
            p[i].tat = t - p[i].at;
            p[i].wt = p[i].tat - p[i].bt;
            
        }
    }
    var total_tat = 0.0, total_wt = 0.0;
    for (var i = 0; i < p.length; i++) {
        total_tat += p[i].tat;
        total_wt += p[i].wt;
    }
    atat = (total_tat / p.length).toFixed(2);
    awt = (total_wt / p.length).toFixed(2);
    return;
}

function showOutput(flag) {
    flg = flag;
    if (p.length == 0) {
        alert("No process to schedule");
        return;
    }
    if (flag == 0) {
        fcfs();
    }
    else if (flag == 1) {
        sjf();
    }
    else if (flag == 2) {
        srtf();
    }
    else if (flag == 3) {
        var tq = document.getElementById("tq").value;
        quantum = parseInt(tq);
        if (isNaN(quantum)) {
            alert("Please enter numeric value of time quantum");
            return;
        }
        else if (quantum <= 0) {
            alert("Enter positive value of time quantum");
            return;
        }
        else {
            rr();
        }
    }
    var awt2 = document.getElementById("awt1");
    var atat2 = document.getElementById("atat1");
    awt2.innerHTML = "";
    atat2.innerHTML = "";
    var gt = document.getElementById("gantt");
    gt.innerHTML = "";
    gt.setAttribute("style", "width: 801px; height: 100px; position: relative; margin: auto; border: .5px solid black;");
    var table = document.getElementById("ptable");
    table.innerHTML = "";
    var timer1 = document.getElementById("timer");
    timer1.innerHTML = "";
    var chart_header = document.getElementById("chart-header");
    chart_header.innerHTML = "Gantt Chart";
    var op_header = document.getElementById("operations-heading");
    op_header.innerHTML = "Operation taken place in CPU";
    var table_header = document.getElementById("table-heading");
    table_header.innerHTML = "Output Table";
    var thead = document.getElementById("thead");
    thead.innerHTML = "";
    var tr = document.createElement("tr");
    var th1 = document.createElement("th");
    th1.textContent = "Process ID";
    tr.appendChild(th1);
    var th2 = document.createElement("th");
    th2.textContent = "Arrival Time";
    tr.appendChild(th2);
    var th3 = document.createElement("th");
    th3.textContent = "Burst Time";
    tr.appendChild(th3);
    var th4 = document.createElement("th");
    th4.textContent = "Completion Time";
    tr.appendChild(th4);
    var th5 = document.createElement("th");
    th5.textContent = "Waiting Time";
    tr.appendChild(th5);
    var th6 = document.createElement("th");
    th6.textContent = "Turnaround Time";
    tr.appendChild(th6);
    thead.appendChild(tr);
   
    var p1 = document.createElement("p");
    p1.textContent = "Average waiting time: " + awt + " units";
    awt2.appendChild(p1);
    var p2 = document.createElement("p");
    p2.textContent = "Average turn around time: " + atat + " units"; 
    atat2.appendChild(p2);
    drawChart();
    drawTable();
}

function drawChart() {
    var gt = document.getElementById("gantt");
    var timer1 = document.getElementById("timer");
    pixel = 800 / t;
    for (var i = 0; i < gantt.length; i++) {
        var divWidth = (gantt[i].end - gantt[i].start) * pixel;
        var d = document.createElement("div");
        d.setAttribute("class", "block");
        var id1 = gantt[i].id;
        d.setAttribute("id", "P-" + gantt[i].id);
        //window.alert("Width is " + divWidth);
        
        if (gantt[i].id == -1) {
            d.textContent = "";
            d.setAttribute("style", "float:left;width:" + divWidth + "px; height:100px;");
        }
        else {
            d.setAttribute("style", "float:left;width: "+divWidth+"px; height: 100px;background-color:"+colors[id1 - 1]+";font-size:20px;text-align:center;");
            d.textContent = "P-" + gantt[i].id;
        }
        gt.appendChild(d); 
        var d1 = document.createElement("div");
        d1.setAttribute("style", "float:left;width:" + divWidth + "px;");
        d1.textContent = gantt[i].start;
        timer1.appendChild(d1);
    }
    var d1 = document.createElement("div");
    d1.setAttribute("style", "float:left;width:3px;");
    d1.textContent = gantt[i-1].end;
    timer1.appendChild(d1);
}

function drawTable() {
    var table = document.getElementById("ptable");
    p.sort(function (a, b) {
        return a.ct - b.ct;
    });
    for (var i = 0; i < p.length; i++) {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.textContent = p[i].id;
        var td2 = document.createElement("td");
        td2.textContent = p[i].at;
        var td3 = document.createElement("td");
        td3.textContent = p[i].bt;
        var td4 = document.createElement("td");
        td4.textContent = p[i].ct;
        var td5 = document.createElement("td");
        td5.textContent = p[i].wt;
        var td6 = document.createElement("td");
        td6.textContent = p[i].tat;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        table.appendChild(tr);
    }
}

function clearData() {
    var table = document.getElementById("ptable");
    var gt = document.getElementById("gantt");
    gt.setAttribute("style", "width: auto; height: auto; position: relative; margin: auto; border: white;");
    var awt2 = document.getElementById("awt1");
    var atat2 = document.getElementById("atat1");
    var operation = document.getElementById("operations");
    var inp = document.getElementById("showinput");
    inp.innerHTML = "";
    inp.setAttribute("style","height:auto;")
    operation.innerHTML = "";
    awt2.innerHTML = "";
    atat2.innerHTML = "";
    table.innerHTML = "";
    gt.innerHTML = "";
    var timer1 = document.getElementById("timer");
    timer1.innerHTML = "";
    var chart_header = document.getElementById("chart-header");
    chart_header.innerHTML = "";
    var op_header = document.getElementById("operations-heading");
    op_header.innerHTML = "";
    var table_header = document.getElementById("table-heading");
    table_header.innerHTML = "";
    var thead = document.getElementById("thead");
    thead.innerHTML = "";
    p = [];
    gantt = [];
    index = 1;
    atat = 0.0;
    awt = 0.0;
    t = 0;
    if (flg == 3) {
        var tq1 = document.getElementById("tq");
        tq1.value = "";
        flg = -1;
    }
}
