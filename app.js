import express from 'express';
import cors from 'cors';
import { getCars, getCarByID, getCarByNumBastidor, insertCar, deleteCar, modifyCar } from './cars.service.js';
import bodyParser from 'body-parser';

const app = express();
const port = 42069;

app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/cars', async (req, res) => {
  res.status(200).json(await getCars());
});

app.get('/cars/:id', async (req, res) => {
  const id = req.params.id;

  const car = await getCarByID(id);

  if (car) {
    res.status(200).json(car);
    return;
  }

  res.status(404).send('Car not found');
});

app.post('/cars', async (req, res) => {
  const car = req.body;

  const carsDatabase = await getCarByNumBastidor(car.numBastidor);

  if (carsDatabase) {
    res.status(400).send("The car already exists");
    return;
  }

  const newCar = await insertCar(car);
  if (newCar) {
    res.json(car);
    return;
  }
  res.status(400).send('Failure while creating the car');
});

app.delete('/cars/:id', async (req, res) => {
  const id = req.params.id;

  if (await deleteCar(id)) {
    res.send('Car has been deleted');
    return;
  }

  res.status(404).send('Car not found');
});

app.put('/cars/:id', async (req, res) => {
  const id = req.params.id;
  const newCar = req.body;

  if (newCar.id !== id) {
    res.status(400).send('El id del objeto en el body y la URL no es la misma');
    return;
  }

  const car = await getCarByID(id);

  if (car === null || car === undefined) {
    res.status(400).json("The car does not exists");
    return;
  }

  if (await modifyCar(newCar)) {
    res.json(newCar);
    return;
  }

  res.status(404).send('Car not found');
});

app.listen(port, () => console.log(`API Rest starts at ${port}!`));