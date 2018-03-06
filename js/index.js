var p = [];
var index = 1;
var gantt = [];
var result = [];
var colors = ["#e040fb", "#ff80ab", "#3f51b5", "#1e88e5", "#009688", "#4caf50", "#cddc39", "#ffeb3b", "#607d8b", "#ff9800"];
var atat = 0.0;
var awt = 0.0;
var pixel = 0;
function addToList() {   
    var at = document.getElementById("newat").value;
    var bt = document.getElementById("newbt").value;
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
    var t = 0;
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
    var awt2 = document.getElementById("awt1");
    awt2.innerHTML = "";
    var atat2 = document.getElementById("atat1");
    atat2.innerHTML = "";
    fcfs();
    var p1 = document.createElement("p");
    p1.textContent = "Average waiting time: " + awt;
    awt2.appendChild(p1);
    //awt2.appendChild("<p> " + awt + "</p>");
    //$("#awt1").append("  " + awt + "  ");
    //$("#atat1").append("  " + atat + "  ");
    var p2 = document.createElement("p");
    p2.textContent = "Average turn around time: " + atat;
    atat2.appendChild(p2);
    drawChart();
    drawTable();
}

function drawChart() {
    var gt = document.getElementById("gantt");
    var l = gantt.length;
    pixel = parseInt(800 / (gantt[l - 1].end));
    for (var i = 0; i < gantt.length; i++) {
        var divWidth = (gantt[i].end - gantt[i].start) * pixel;
        var d = document.createElement("div");
        var id1 = gantt[i].id;
        d.setAttribute("id", "P-" + gantt[i].id);
        d.setAttribute("style", "float:left;width:" + divWidth+"; height:auto;");
        if (gantt[i].id == -1) {
            d.textContent = "";
        }
        else {
            d.setAttribute("style", "background-color:"+colors[id1 - 1]+";");
            d.textContent = "P-" + gantt[i].id;
        }
        gt.appendChild(d); 
    }
}
