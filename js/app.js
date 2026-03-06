async function loadSensors(network) {

const url = `https://YOURPROJECT.supabase.co/rest/v1/purpleair_sensors
?select=sensor_index,name,lat,lon
&network=eq.${network}`;

const response = await fetch(url, {
headers: {
apikey: SUPABASE_KEY,
Authorization: `Bearer ${SUPABASE_KEY}`
}
});

return await response.json();
}


async function loadLatestReadings(ids) {

const idlist = ids.join(",");

const url = `https://YOURPROJECT.supabase.co/rest/v1/sensor_readings
?select=sensor_index,pm25_a,pm25_b,timestamp
&sensor_index=in.(${idlist})
&order=timestamp.desc`;

const response = await fetch(url, {
headers:{
apikey:SUPABASE_KEY,
Authorization:`Bearer ${SUPABASE_KEY}`
}
});

return await response.json();
}


