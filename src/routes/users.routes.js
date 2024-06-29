const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();
const prisma = new PrismaClient();

router.use(auth);

router.get("/", async (req, res) => {
  const id = req.userId;

  const user = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return res.json(user);
});

module.exports = (app) => app.use("/users", router);
