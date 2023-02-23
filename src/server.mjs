import express from'express'
import bodyParser from 'body-parser';
import cors from'cors';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://work-around-f1f10-default-rtdb.firebaseio.com",
};

const app = express();
// Initialize Firebase
const fb = initializeApp(firebaseConfig);
const port = 3000;
// Initialize Realtime Database and get a reference to the service
const db = getDatabase(fb);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/sensordata', (req, res) => {
  const sensordata = req.body;
  const { temperature, humidity, timestamp} = sensordata;
  function writeSensorData(temperature, humidity, timestamp) {
    set(ref(db, 'sensordata/' + timestamp), {
      temperature: temperature,
      humidity: humidity,
      timestamp : timestamp
    });
  }
  writeSensorData(temperature, humidity, timestamp)
  res.send(`data sent at: ${sensordata.timestamp}`);
});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
