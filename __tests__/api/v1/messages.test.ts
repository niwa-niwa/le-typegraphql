import { Message, Village } from "@prisma/client";
import { prismaClient } from "../../../lib/prismaClient";
import { User } from "@prisma/client";
import request from "supertest";
import { api } from "../../../api";
import { testTokens } from "./../../test_config/testData";

const PREFIX_MESSAGES = "/api/v1/messages";

describe(`${PREFIX_MESSAGES} TEST messageController`, () => {
  test(`POST ${PREFIX_MESSAGES}/create createMessage`, async () => {
    const user: User | null = await prismaClient.user.findFirst();

    expect(user).not.toBeNull();

    const village: Village | null = await prismaClient.village.findFirst();

    expect(village).not.toBeNull();

    const the_content = "story content 1";

    const { status, body } = await request(api)
      .post(PREFIX_MESSAGES + "/create")
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ content: the_content, userId: user?.id, villageId: village?.id });

    expect(status).toBe(200);
    expect(body).toHaveProperty("message");

    const the_message: Message | null = await prismaClient.message.findUnique({
      where: {
        id: body.message.id,
      },
      include: { user: true, village: true },
    });

    expect(body.message).not.toBeNull();

    expect(body.message.id).toBe(the_message?.id);
    expect(body.message.content).toBe(the_content);
    expect(body.message.villageId).toBe(village?.id);
    expect(body.message.userId).toBe(user?.id);

    expect(the_message?.content).toBe(the_content);
    expect(the_message?.villageId).toBe(village?.id);
    expect(the_message?.userId).toBe(user?.id);
  });

  test(`POST ${PREFIX_MESSAGES}/create createMessage TEST : handling error`, async () => {
    const { status, body } = await request(api)
      .post(PREFIX_MESSAGES + "/create")
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ content: "" });

    expect(status).toBe(400);
    expect(body.message).toBeNull();
    expect(body.errorObj).toHaveProperty("errorCode");
    expect(body.errorObj).toHaveProperty("errorMessage");
  });

  test(`GET ${PREFIX_MESSAGES} getMessages`, async () => {
    const { status, body } = await request(api)
      .get(PREFIX_MESSAGES)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("messages");
    expect(body.messages[0]).toHaveProperty("id");
    expect(body.messages[0]).toHaveProperty("content");
    expect(body.messages[0]).toHaveProperty("user");
    expect(body.messages[0]).toHaveProperty("village");

    const countMessage: number = await prismaClient.message.count();

    expect(body.messages.length).toBe(countMessage);
  });

  test(`GET ${PREFIX_MESSAGES}/:messageId getMessageDetail`, async () => {
    const dbMessage: Message | null = await prismaClient.message.findFirst();

    expect(dbMessage).not.toBeNull();

    const { status, body } = await request(api)
      .get(PREFIX_MESSAGES + "/" + dbMessage?.id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body.message.id).toBe(dbMessage?.id);
    expect(body.message.content).toBe(dbMessage?.content);
    expect(body.message.villageId).toBe(dbMessage?.villageId);
    expect(body.message.userId).toBe(dbMessage?.userId);
    expect(body.message).toHaveProperty("village");
    expect(body.message).toHaveProperty("user");
  });

  test(`GET ${PREFIX_MESSAGES}/:messageId getMessageDetail : TEST handling error cause wrong message id`, async () => {
    const wrong_id: string = "aaaa";

    const { status, body } = await request(api)
      .get(PREFIX_MESSAGES + "/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(404);
    expect(body.message).toBeNull();
    expect(body).toHaveProperty("errorObj");
    expect(body.errorObj).toHaveProperty("errorCode");
    expect(body.errorObj).toHaveProperty("errorMessage");
  });

  test(`PUT ${PREFIX_MESSAGES}/edit/:messageId editMessage`, async () => {
    const dbMessage: Message | null = await prismaClient.message.findFirst();

    expect(dbMessage).not.toBeNull();

    const the_content = "story 2";
    const { status, body } = await request(api)
      .put(PREFIX_MESSAGES + "/edit/" + dbMessage?.id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ content: the_content });

    expect(status).toBe(200);
    expect(body.message.id).toBe(dbMessage?.id);
    expect(body.message.content).not.toBe(dbMessage?.content);
    expect(body.message.content).toBe(the_content);
    expect(body.message.userId).toBe(dbMessage?.userId);
    expect(body.message.villageId).toBe(dbMessage?.villageId);
  });

  test(`PUT ${PREFIX_MESSAGES}/edit/:messageId editMessage : TEST error handling by wrong id`, async () => {
    const wrong_id = "aaa";
    const { status, body } = await request(api)
      .put(PREFIX_MESSAGES + "/edit/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ content: "the_content" });

    expect(status).toBe(404);
    expect(body.message).toBeNull();
    expect(body.errorObj).toHaveProperty("errorCode");
    expect(body.errorObj).toHaveProperty("errorMessage");

    const dbMessage: Message | null = await prismaClient.message.findUnique({
      where: { id: wrong_id },
    });

    expect(dbMessage).toBeNull();
  });

  test(`Delete ${PREFIX_MESSAGES}/delete/:messageId deleteMessage`, async () => {
    const dbMessage: Message | null = await prismaClient.message.findFirst();
    expect(dbMessage).not.toBeNull();

    const { status, body } = await request(api)
      .delete(PREFIX_MESSAGES + "/delete/" + dbMessage?.id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body.message.id).toBe(dbMessage?.id);
    expect(body.message.content).toBe(dbMessage?.content);

    const deletedMessage: Message | null =
      await prismaClient.message.findUnique({
        where: { id: dbMessage?.id },
      });
    expect(deletedMessage).toBeNull();
  });

  test(`Delete ${PREFIX_MESSAGES}/delete/:messageId deleteMessage : TEST error handling`, async () => {
    const wrong_id = "aaa";

    const { status, body } = await request(api)
      .delete(PREFIX_MESSAGES + "/delete/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(404);
    expect(body.message).toBeNull();
    expect(body.errorObj).toHaveProperty("errorCode");
    expect(body.errorObj).toHaveProperty("errorMessage");

    const dbMessage: Message | null = await prismaClient.message.findUnique({
      where: { id: wrong_id },
    });
    expect(dbMessage).toBeNull();
  });
});
