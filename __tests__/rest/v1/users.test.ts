import request from "supertest";
import { api } from "../../../backend/rest";
import { prismaClient } from "../../../backend/lib/prismaClient";
import { User } from "@prisma/client";
import { sub_user } from "../../test_config/testData";
import { testTokens } from "../../test_config/testData";
import { PARAMS, PATH, V1 } from "../../../consts/url";
import { userId } from "../../../backend/rest/controllers/userController";
import initDB from "../../test_config/initDB";

beforeEach(async () => await initDB());

const PREFIX_USERS = V1.USERS;

describe("/api/v1/users/ TEST : userController ", () => {
  test("GET /api/v1/users/ getUsers : TEST it should be status 200 and properties  ", async () => {
    const dbUsers: User[] = await prismaClient.user.findMany();

    const { status, body } = await request(api)
      .get(PREFIX_USERS)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body.users.length).toBe(dbUsers.length);
    expect(body.users[0]).toHaveProperty("id");
    expect(body.users[0]).toHaveProperty("firebaseId");
    expect(body.users[0]).toHaveProperty("isActive");
    expect(body.users[0]).toHaveProperty("isAdmin");
    expect(body.users[0]).toHaveProperty("isAnonymous");
    expect(body.users[0]).toHaveProperty("createdAt");
    expect(body.users[0]).toHaveProperty("updatedAt");
    expect(body.users[0]).not.toHaveProperty("password");
  });

  test("GET /api/v1/users/:userId getUserDetail TEST : it should has properties", async () => {
    const dbUser = await prismaClient.user.findFirst();
    if (!dbUser) return;

    const { status, body } = await request(api)
      .get(PREFIX_USERS + "/" + dbUser.id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);
    expect(status).toBe(200);
    expect(body.user).toHaveProperty("id", dbUser.id);
    expect(body.user).toHaveProperty("firebaseId", dbUser.firebaseId);
    expect(body.user).toHaveProperty("isAdmin", dbUser.isAdmin);
    expect(body.user).toHaveProperty("isActive", dbUser.isActive);
    expect(body.user).toHaveProperty("isAnonymous", dbUser.isAnonymous);
    expect(body.user).toHaveProperty("username", dbUser.username);
    expect(body.user).toHaveProperty("createdAt");
    expect(body.user).toHaveProperty("updatedAt");
    expect(body.user).not.toHaveProperty("uid");
    expect(body.user).not.toHaveProperty("password");
  });

  test("GET /api/v1/users/:userId getUserDetail TEST : it should has properties that is belong query", async () => {
    const dbUser = await prismaClient.user.findFirst();
    if (!dbUser) return;

    const { status, body } = await request(api)
      .get(PREFIX_USERS + "/" + dbUser.id)
      .query({
        fields: "id,isAdmin,messages,villages,username",
        sort: "-createdAt",
      })
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body.user).toHaveProperty("id", dbUser.id);
    expect(body.user).not.toHaveProperty("firebaseId", dbUser.firebaseId);
    expect(body.user).toHaveProperty("isAdmin", dbUser.isAdmin);
    expect(body.user).not.toHaveProperty("isActive", dbUser.isActive);
    expect(body.user).not.toHaveProperty("isAnonymous", dbUser.isAnonymous);
    expect(body.user).toHaveProperty("username", dbUser.username);
    expect(body.user).not.toHaveProperty("createdAt");
    expect(body.user).not.toHaveProperty("updatedAt");
    expect(body.user).not.toHaveProperty("uid");
    expect(body.user).not.toHaveProperty("password");
    expect(body.user).toHaveProperty("messages");
    expect(body.user).toHaveProperty("villages");
  });

  test("GET Fail /api/v1/users/:userId getUserDetail TEST : it should has error object cause wrong fields param", async () => {
    const dbUser = await prismaClient.user.findFirst();
    if (!dbUser) return;

    const { status, body } = await request(api)
      .get(PREFIX_USERS + "/" + dbUser.id)
      .query({
        fields: "id,isAdmin_____,messages,username",
        sort: "-createdAt",
      })
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(400);
  });

  test("GET /api/v1/users/:userId getUserDetail TEST : it should receive error by wrong uid", async () => {
    const wrong_uid: string = "aaaaaaa";

    const dbUser: User | null = await prismaClient.user.findUnique({
      where: { id: wrong_uid },
    });

    expect(dbUser).toBeNull();

    const { status, body } = await request(api)
      .get(PREFIX_USERS + "/aaaaaaa")
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(404);
    expect(body.code).toBe(404);
    expect(body).toHaveProperty("message");
  });

  test("GET success /api/v1/users/:userId/messages getUserMessages: it should messages of the user", async () => {
    const dbUser = await prismaClient.user.findFirst({
      include: { messages: true },
    });
    if (!dbUser) return;

    const { status, body, headers } = await request(api)
      .get(PREFIX_USERS + "/" + dbUser.id + "/messages")
      .query({
        fields: "",
        sort: "-createdAt,+updatedAt",
        par_page: 0,
        page: 1,
        offset: 0,
      })
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("messages");
    expect(body.messages.length).toBe(dbUser.messages.length);
    expect(body.messages[2].id).toBe(dbUser.messages[0].id);
    expect(body.messages[2].content).toBe(dbUser.messages[0].content);
    expect(body.messages[2].villageId).toBe(dbUser.messages[0].villageId);
    expect(Number(headers[PARAMS.X_TOTAL_COUNT])).toBe(dbUser.messages.length);
  });

  test(`GET ${V1.USERS}/:${userId}${PATH.VILLAGES} getUserVillages: Success`, async () => {
    const dbUser = await prismaClient.user.findFirst({
      include: { villages: true },
    });
    if (!dbUser) return;

    const { status, body, headers } = await request(api)
      .get(V1.USERS + "/" + dbUser.id + PATH.VILLAGES)
      .query({})
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(200);
  });

  test(`Success POST ${V1.USERS} createUser `, async () => {
    const nullUser = await prismaClient.user.findUnique({
      where: { firebaseId: sub_user.uid },
    });

    expect(nullUser).toBeNull();

    const { status, body, header } = await request(api)
      .post(V1.USERS)
      .set(PARAMS.HEADER_AUTH_KEY, `Bearer ${testTokens.admin_user}`)
      .send({ firebaseToken: testTokens.sub_user });

    const dbUser = await prismaClient.user.findUnique({
      where: { firebaseId: sub_user.uid },
    });
    if (!dbUser) return;

    expect(status).toBe(200);
    expect(dbUser).not.toBeNull();
    expect(dbUser.firebaseId).toBe(sub_user.uid);
    expect(body.user.firebaseId).toBe(sub_user.uid);
    expect(body.user.isAdmin).toBe(dbUser.isAdmin);
    expect(body.user.isActive).toBe(dbUser.isActive);
    expect(body.user.isAnonymous).toBe(dbUser.isAnonymous);
    expect(body.user.username).toBe(dbUser.username);
    expect(body.user.messages).toBeUndefined();
    expect(body.user.villages).toBeUndefined();
  });

  test("POST /api/v1/users/create createUser TEST : it should receive error because of not admin user requested ", async () => {
    const { status, body } = await request(api)
      .post(PREFIX_USERS)
      .send({ firebaseToken: "token_firebase_user" });

    expect(status).toBe(400);
    expect(body.code).toBe(400);
    expect(body).toHaveProperty("message");
  });

  test("POST /api/v1/users/create createUser TEST : should receive error", async () => {
    const { status, body } = await request(api).post(PREFIX_USERS);

    expect(status).toBe(400);
    expect(body.code).toBe(400);
    expect(body).toHaveProperty("message");
  });

  test("Patch /api/v1/users/:userId editUser TEST : edit user by edit_data successfully", async () => {
    const dbUser: User | null = await prismaClient.user.findFirst()!;

    const userId = dbUser!.id;

    const edit_data = {
      username: "hello world",
      isAdmin: true,
      isActive: false,
      isAnonymous: true,
    };

    const { status, body } = await request(api)
      .patch(PREFIX_USERS + "/" + userId)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .query({
        fields: "id,username,isAdmin,isActive,isAnonymous",
      })
      .send({ ...edit_data });

    const editedDbUser: User | null = await prismaClient.user.findUnique({
      where: { id: userId },
    })!;

    expect(editedDbUser).not.toBeNull();
    expect(status).toBe(200);
    expect(body.user.id).toEqual(userId);
    expect(editedDbUser!.id).toEqual(userId);
    expect(body.user.username).toEqual(edit_data.username);
    expect(editedDbUser!.username).toEqual(edit_data.username);
    expect(body.user.isAdmin).toEqual(edit_data.isAdmin);
    expect(editedDbUser!.isAdmin).toEqual(edit_data.isAdmin);
    expect(body.user.isActive).toEqual(edit_data.isActive);
    expect(body.user.isAnonymous).toEqual(edit_data.isAnonymous);
    expect(editedDbUser!.isAnonymous).toEqual(edit_data.isAnonymous);
    expect(body.user).not.toHaveProperty("password");
    expect(body.user).not.toHaveProperty("errorObj");
  });

  test("PUT /api/v1/users/:userId editUser TEST should receive errorObj because the user not found by wrong uid", async () => {
    const wrong_id = "asdf";

    const edit_data = {
      username: "hello world",
      isAdmin: true,
      isActive: false,
      isAnonymous: true,
    };

    const { status, body } = await request(api)
      .patch(PREFIX_USERS + "/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`)
      .send({ ...edit_data });

    const dbUser = await prismaClient.user.findUnique({
      where: { id: wrong_id },
    });
    expect(dbUser).toBeNull();

    expect(status).toBe(403);
    expect(body.user).toBeUndefined();
    expect(body.code).toBe(403);
    expect(body).toHaveProperty("message");
  });

  test("DELETE /api/v1/users/:userId deleteUser TEST it should receive error", async () => {
    const wrong_id = "aaaaaa";

    const dbUser = await prismaClient.user.findUnique({
      where: { id: wrong_id },
    });

    expect(dbUser).toBeNull();

    const { status, body } = await request(api)
      .delete(PREFIX_USERS + "/" + wrong_id)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    expect(status).toBe(400);
    expect(body.user).toBeUndefined();
    expect(body.code).toBe(400);
    expect(body).toHaveProperty("message");
    expect(body.user).not.toBe("id");
  });

  test("DELETE /api/v1/users/:userId deleteUser TEST the user by userId should be deleted", async () => {
    const dbUsers = await prismaClient.user.findMany();
    const userId = dbUsers[0].id;

    const { status, body } = await request(api)
      .delete(PREFIX_USERS + "/" + userId)
      .set("Authorization", `Bearer ${testTokens.admin_user}`);

    const usersCount = await prismaClient.user.count();

    expect(status).toBe(200);
    expect(body.user.id).toBe(userId);
    expect(dbUsers.length).not.toBe(usersCount);
    expect(dbUsers.length).toBe(usersCount + 1);
  });
});
