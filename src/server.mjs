import exec from'exec';
import fetch from 'node-fetch';

function readSensor(callback) {
	exec('./HTU21D_test', {cwd: '/home/pi/Documents/Projects/rpi-examples/HTU21D/c'}, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return -1;
		}
		callback(stdout);
	});
}

function writeSensorData(temperature, humidity, timestamp) {
	const sensorDataRef = ref(db, 'sensordata');
	const newSensorDataRef = push(sensorDataRef);
	set(newSensorDataRef, {
		temperature: temperature,
		humidity: humidity,
		timestamp: timestamp
	});
}


function transformData(data, callback) {
	const rawData = data.split('\n');
	const temperature = rawData[0];
	const humidity = rawData[1];
	callback({ temperature, humidity });
}

setInterval( () => {
	readSensor( data => {
		transformData(data, data => {
			
			let {temperature, humidity } = data;
			temperature = Number(temperature.split('C')[0]);
			humidity = Number(humidity.split('%')[0]);
			console.log(data)
			fetch('https://notgamp.marplacode.com/api/v1/enviroment/sensors',{ method: 'POST', body: JSON.stringify({humidity: humidity, temperature: temperature}), headers: {Authorization: 'Bearer 235b13c6-0e6e-4347-9961-7d42e97b42b4', 'Content-Type': 'application/json'}});	
		});
		
	});
},3000);// (send the data to the ui) = 1s
