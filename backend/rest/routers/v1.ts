import { Response, Request, Router } from "express";
import { authentication } from "../middlewares/authentication";
import { authorization } from "../middlewares/authorization";
import userController, { userId } from "../controllers/userController";
import villageController, { villageId } from "../controllers/villageController";
import messageController, { messageId } from "../controllers/messageController";
import { CurrentUser, CustomRequest } from "..";
import { PATH } from "../../../consts/url";
import path from "path";

const v1: Router = Router();

v1.use(
  Router()
    .get(PATH.HEALTH, (req: Request, res: Response) => {
      res.status(200).json("It Works!!");
    })
    .get(PATH.ME, authentication, (req: CustomRequest, res: Response) => {
      const user: Partial<CurrentUser> = req.currentUser!;
      delete user.messages;
      delete user.villages;
      res.status(200).json({ user });
    })
);

v1.use(
  PATH.USERS,
  authentication,
  Router()
    .get("/", userController.getUsers)
    .get(`/:${userId}`, userController.getUserDetail)
    .get(
      path.join(`/:${userId}`, PATH.MESSAGES),
      userController.getUserMessages
    )
    .get(
      path.join(`/:${userId}`, PATH.VILLAGES),
      userController.getUserVillages
    )
    .post("/", authorization, userController.createUser)
    .patch(`/:${userId}`, userController.editUser)
    .delete(`/:${userId}`, userController.deleteUser)
);

v1.use(
  PATH.VILLAGES,
  authentication,
  Router()
    .get("/", villageController.getPublicVillages)
    .get(`/:${villageId}`, villageController.getVillageDetail)
    .get(
      path.join(`/:${villageId}`, PATH.USERS),
      villageController.getVillageUsers
    )
    .get(
      path.join(`/:${villageId}`, PATH.MESSAGES),
      villageController.getVillageMessages
    )
    .post("/", villageController.createVillage)
    .patch(`/:${villageId}`, villageController.editVillage)
    .delete(`/:${villageId}`, villageController.deleteVillage)
);

v1.use(
  PATH.MESSAGES,
  authentication,
  Router()
    .get("/", messageController.getMessages)
    .get(`/:${messageId}`, messageController.getMessageDetail)
    .get(
      path.join(`/:${messageId}`, PATH.USERS),
      messageController.getMessageUser
    )
    .get(
      path.join(`/:${messageId}`, PATH.VILLAGES),
      messageController.getMessageVillage
    )
    .post("/", messageController.createMessage)
    .patch(`/:${messageId}`, messageController.editMessage)
    .delete(`/:${messageId}`, messageController.deleteMessage)
);

export { v1 };
