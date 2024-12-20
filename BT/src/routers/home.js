import express from "express";
import { renderHomePage, renderHome2, renderUpdateInfo } from "../controllers/home.js"; 

const router = express.Router();

//  home1
router.get("/", renderHomePage);

//  home2
router.get("/home", renderHome2);

//thay đổi thông tin
router.get("/update-info", renderUpdateInfo);


export default router;
