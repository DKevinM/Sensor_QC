// =============================
// MAP INITIALIZATION
// =============================

const map = L.map('map').setView([53.5,-114],6);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map);


// =============================
// PM2.5 COLOR SCALE
// =============================

function pmColor(pm){

if(pm < 6) return "#2ecc71";
if(pm < 12) return "#f1c40f";
if(pm < 25) return "#e67e22";
if(pm < 50) return "#e74c3c";

return "#8e44ad";

}


// =============================
// QC CHANNEL CHECK
// =============================

function channelQC(a,b){

if(a == null || b == null) return "offline";

let diff = Math.abs(a-b);

if(diff > 10) return "bad";
if(diff > 5) return "suspect";

return "good";

}


// =============================
// QC BORDER COLOR
// =============================

function qcBorder(flag){

if(flag == "good") return "#2c3e50";
if(flag == "suspect") return "#f39c12";
if(flag == "bad") return "#e74c3c";

return "#7f8c8d";

}


// =============================
// FORMAT TIME
// =============================

function formatTime(t){

return new Date(t).toLocaleString();

}


// =============================
// BUILD COMBINED MARKER
// =============================

function buildMarker(sensor){

let value = Math.round(sensor.pm_corr);

let fill = pmColor(sensor.pm_corr);

let qc = channelQC(
sensor["pm2.5_atm_a"],
sensor["pm2.5_atm_b"]
);

let border = qcBorder(qc);

let html = `
<div style="
width:28px;
height:28px;
border-radius:50%;
background:${fill};
border:3px solid ${border};
display:flex;
align-items:center;
justify-content:center;
font-size:12px;
font-weight:bold;
color:black;
">
${value}
</div>
`;

return L.divIcon({
html:html,
className:"",
iconSize:[28,28]
});

}


// =============================
// LOAD JSON DATA
// =============================

async function loadSensors(){

const response = await fetch("AB_PM25_map.json");

const sensors = await response.json();

drawSensors(sensors);

}


// =============================
// DRAW MARKERS
// =============================

function drawSensors(sensors){

sensors.forEach(s => {

let icon = buildMarker(s);

let marker = L.marker(
[s.latitude,s.longitude],
{icon:icon}
);

marker.bindPopup(`
<b>${s.name}</b><br>
PM2.5: ${s.pm_corr.toFixed(1)} µg/m³<br>
Channel A: ${s["pm2.5_atm_a"]}<br>
Channel B: ${s["pm2.5_atm_b"]}<br>
Humidity: ${s.humidity}%<br>
Last Seen: ${formatTime(s.last_seen)}
`);

marker.addTo(map);

});

}


// =============================
// START
// =============================

loadSensors();
