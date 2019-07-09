const Trip = require('../models/trip')
const Place = require('../models/place')

function indexTrips(req, res, next) {
  console.log('index trips')
  Trip
    .find()
    .then(trips => res.status(200).json(trips))
    .catch(next)
}

function createTrip(req, res, next) {
  console.log('create trip')
  console.log(req.params)
  const body = {
    title: req.body.title,
    user_id: req.params.id
  }
  Trip
    .create(body)
    .then(trip => res.status(201).json(trip))
    .catch(next)
}

function showTrip(req, res, next) {
  console.log('show place')
  Trip
    .findById(req.params.tripId)
    .then(trip => {
      if (!trip) throw new Error('Not Found')
      res.status(200).json(trip)
    })
    .catch(next)
}

function editTrip(req, res, next) {
  console.log('edit trip')
  Trip
    .findById(req.params.tripId)
    .then(trip => {
      if (!trip) throw new Error('Not Found')
      Object.assign(trip, req.body)
      if (!req.body.title.length) throw new Error('ValidationError')
      trip.save()
      res.status(202).json(trip)
    })
    .catch(next)
}

function deleteTrip(req, res, next) {
  Trip
    .findByIdAndRemove(req.params.tripId)
    .then(trip => {
      console.log(req.params.tripId)
      if (!trip) throw new Error('Not Found')
      res.status(204).end()
    })
    .catch(next)
}

function addPlaceToTrip(req, res, next) {
  console.log('add place')
  console.log(req.params)
  // triposo POI id in req.body
  // if no users have added this place to a trip before, create this place in our api
  Place
    .findOne({ triposoId: req.params.placeId })
    .then(place => {
      if (!place) return Place.create({ triposoId: req.params.placeId })
      return place
    })
    .then((place) => {
      //add place to trip
      Trip
        .findById(req.body.tripId)
        .then(trip => {
          if (!trip) throw new Error('Not Found')
          if (!req.body.placeId.length) throw new Error('ValidationError')
          trip.places.push(place)
          trip.save()
          res.status(201).json(trip)
        })
    })
    .catch(next)
}

function removePlaceFromTrip(req, res, next) {
  console.log('remove place')
  console.log(req.params)
  Trip
    .findById(req.params.tripId)
    .then(trip => {
      if (!trip) throw new Error('Not Found')
      if (!req.body.placeId.length) throw new Error('ValidationError')
      trip.places = trip.places.filter(place => place !== req.body.placeId)
      trip.save()
      res.status(202).json(trip)
    })
    .catch(next)
}

module.exports = {
  index: indexTrips,
  create: createTrip,
  edit: editTrip,
  show: showTrip,
  delete: deleteTrip,
  addPlace: addPlaceToTrip,
  removePlace: removePlaceFromTrip
}
