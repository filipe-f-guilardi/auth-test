const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mail = require("../controllers/mail.controller");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (await prisma.user.findUnique({ where: { email } }))
    return res.status(400).json({ error: "User already exists" });

  const passwordCrypted = await bcrypt.hash(password, 10);

  const user = await prisma.user
    .create({
      data: { name, email, password: passwordCrypted },
    })
    .catch((err) => res.status(400).json({ error: "User is invalid" }));

  user.password = undefined;

  return res.json({
    user,
    token: generateToken({ id: user.id }),
  });
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(400).json({ error: "User not found" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ error: "Password invalid" });

  user.password = undefined;

  return res.json({
    user,
    token: generateToken({ id: user.id }),
  });
});

const generateToken = (params = {}) => {
  return jwt.sign(params, process.env.JWT_HASH, {
    expiresIn: "1d",
  });
};

module.exports = (app) => app.use("/auth", router);
