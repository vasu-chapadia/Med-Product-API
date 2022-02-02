const { Types } = require("../models/types");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const typeyList = await Types.find();

  if (!typeyList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(typeyList);
});

router.get("/:id", async (req, res) => {
  const types = await Types.findById(req.params.id);
  if (!types) {
    res.status(500).json({
      message: "The Types With the Given ID was not found",
    });
  }
  res.status(200).send(types);
});

router.post("/", async (req, res) => {
  let type = new Types({
    name: req.body.name,
  });
  type = await type.save();
//   console.log(type);
  if (!type) {
    return res.status(404).send("the type cannot be Created!");
  }
  res.send(type);
});

module.exports = router;
