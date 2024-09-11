import express from "express";

import { AuthenticateUser } from "../middleware/auth-middleware";
import {
  Search,
  SearchByName,
  SearchByNumber,
} from "../controllers/search-controllers";

const searchRouter = express.Router();

searchRouter.get("/health", (req, res) => {
  res.json({ mssg: "Search router working" });
});

searchRouter.get("/name", AuthenticateUser, SearchByName);
searchRouter.get("/phone", AuthenticateUser, SearchByNumber);
searchRouter.get("/", AuthenticateUser, Search);

export default searchRouter;
