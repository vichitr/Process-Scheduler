var p = [];
var index = 1;
var gantt = [];
var result = [];
var colors = ["#e040fb", "#ff80ab", "#3f51b5", "#1e88e5", "#009688", "#4caf50", "#cddc39", "#ffeb3b", "#607d8b", "#ff9800"];
var atat = 0.0;
var awt = 0.0;
var pixel = 0;
var t = 0;

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
    p.push({
        "at": parseInt(at),
        "bt": parseInt(bt),
        "id": index,
        "wt": 0,
        "tat": 0,
        "ct": 0
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
        pid.setAttribute("style", "float:left;");
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

function showOutput() {
    if (p.length == 0) {
        window.alert("No process to schedule");
        return;
    }
    var awt2 = document.getElementById("awt1");
    var atat2 = document.getElementById("atat1");
    awt2.innerHTML = "";
    atat2.innerHTML = "";
    var gt = document.getElementById("gantt");
    gt.innerHTML = "";
    var table = document.getElementById("ptable");
    table.innerHTML = "";
    var timer1 = document.getElementById("timer");
    timer1.innerHTML = "";
    fcfs();
    var p1 = document.createElement("p");
    p1.textContent = "Average waiting time: " + awt;
    awt2.appendChild(p1);
    var p2 = document.createElement("p");
    p2.textContent = "Average turn around time: " + atat;
    atat2.appendChild(p2);
    drawChart();
    drawTable();
}

function drawChart() {
    var gt = document.getElementById("gantt");
    var timer1 = document.getElementById("timer");
    pixel = parseInt(800 / t);
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
            d.setAttribute("style", "float:left;width: "+divWidth+"px; height: 100px;background-color:"+colors[id1 - 1]+";font-size:40px;text-align:center;");
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
    p = [];
    gantt = [];
}
