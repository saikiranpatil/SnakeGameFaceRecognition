const express = require("express");
const router = express.Router();
const { renderFirstPage, createUser, getAllUsers, getHighScore, updateScore, loginUser } = require("./controller");

router.route("/").get(renderFirstPage);
router.route("/user/new").post(createUser);
router.route("/login").post(loginUser);
router.route("/users").get(getAllUsers);
router.route("/score/high").get(getHighScore);
router.route("/score/update").post(updateScore);

module.exports = router;