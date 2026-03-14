import express from 'express'
import { getAllRoles, getById } from '../../controllers/role.controllers.js'

const router = express.Router()

router.get("/", getAllRoles);
router.get("/:id", getById);

export default router