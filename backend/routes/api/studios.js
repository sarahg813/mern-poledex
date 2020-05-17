const router = require("express").Router();
require("dotenv").config();
let Studio = require("../../models/studio.model");

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//GET /api/studios
//get all studios
//public access
router.route("/").get((req, res, next) => {
  Studio.find()
    .then((studios) => res.json(studios))
    .catch((err) => res.status(400).json("Error: " + err));
});

//GET /api/studios/search
//get search results
//public access
router.route("/search").get(async (req, res) => {
  console.log("param: " + req.query.q);
  try {
    const searchQuery = new RegExp(escapeRegex(req.query.q), "gi");

    const searchResults = await Studio.find({
      $or: [
        { "address.city": searchQuery },
        { "address.state": searchQuery },
        { "address.postalCode": searchQuery },
        { name: searchQuery },
      ],
    });

    if (!searchResults) throw Error("Error: No results found. ");
    res.status(200).json(searchResults);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

//POST /api/studios/add
//create a studio
//private access
router.route("/add").post(async (req, res) => {
  const name = req.body.name;
  const street = req.body.street;
  const city = req.body.city;
  const state = req.body.state.split(", ");
  const postalCode = req.body.postalCode;
  const country = req.body.country;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const phoneNum = req.body.phoneNum;
  const email = req.body.email;
  const website = req.body.website;
  const facebook = req.body.facebook;
  const instagram = req.body.instagram;
  const twitter = req.body.twitter;
  const youtube = req.body.youtube;
  const categories = req.body.categories.split(", ");

  const newStudio = new Studio({
    name,
    address: {
      street,
      city,
      state,
      postalCode,
      country,
    },
    coordinates: {
      latitude,
      longitude,
    },
    phoneNum,
    email,
    website,
    socialMedia: {
      facebook,
      instagram,
      twitter,
      youtube,
    },
    categories,
  });

  try {
    const savedStudio = await newStudio.save();

    if (!savedStudio) throw Error("Error: can't save studio!");
    res.status(200).json(savedStudio);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

//GET /api/studios/profile/:id
//get studio by id
//public access
router.route("/profile/:id").get(async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) throw Error("No studio found!");
    res.status(200).json(studio);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

//DELETE /api/studios/id
//delete a studio by id
//private access
router.route("/:id").delete(async (req, res) => {
  try {
    await Studio.findByIdAndDelete(req.params.id);
    res.status(200).json("Studio deleted!");
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

//UPDATE /api/studios/update/:id
//update studio info by id
//private access
router.route("/update/:id").patch(async (req, res) => {
  try {
    await Studio.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json("Studio updated!");
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

//-------INSOMNIA---------------
//POST /studios/add
//create a studio
//private access
// router.route("/add").post((req, res) => {
//   const name = req.body.name;
//   const address = req.body.address;
//   const coordinates = req.body.coordinates;
//   const phoneNum = req.body.phoneNum;
//   const email = req.body.email;
//   const website = req.body.website;
//   const socialMedia = req.body.socialMedia;
//   const categories = req.body.categories;

//   const newStudio = new Studio({
//     name,
//     address,
//     coordinates,
//     phoneNum,
//     email,
//     website,
//     socialMedia,
//      categories
//   });

//   newStudio
//     .save()
//     .then(() => res.json("Studio added!"))
//     .catch((err) => res.status(400).json("Error: " + err));
// });
//-------INSOMNIA---------------

module.exports = router;
