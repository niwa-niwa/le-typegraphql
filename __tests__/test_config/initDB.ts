import { prismaClient } from "../../backend/lib/prismaClient";
import { users } from "../../prisma/seeds";

export default async function initDB() {
  const deleteUsers = prismaClient.user.deleteMany();
  const deleteVillages = prismaClient.village.deleteMany();
  const deleteMessage = prismaClient.message.deleteMany();
  await prismaClient.$transaction([deleteUsers, deleteVillages, deleteMessage]);

  const user_a = await prismaClient.user.create({ data: users[0] });

  const user_b = await prismaClient.user.create({ data: users[1] });

  const user_c = await prismaClient.user.create({ data: users[2] });

  const user_d = await prismaClient.user.create({ data: users[3] });

  const user_e = await prismaClient.user.create({ data: users[4] });

  const village_a = await prismaClient.village.create({
    data: {
      name: "village_A",
      description: "desc_village_A",
      users: { connect: { id: user_a.id } },
      owner: { connect: { id: user_a.id } },
    },
  });

  const village_b = await prismaClient.village.create({
    data: {
      name: "village_B",
      description: "desc_village_B",
      users: { connect: { id: user_b.id } },
      owner: { connect: { id: user_b.id } },
    },
  });

  const village_c = await prismaClient.village.create({
    data: {
      name: "village_C",
      description: "desc_village_C",
      isPublic: true,
      users: { connect: { id: user_a.id } },
      owner: { connect: { id: user_a.id } },
    },
  });

  const village_d = await prismaClient.village.create({
    data: {
      name: "village_D",
      description: "desc_village_D",
      users: { connect: { id: user_d.id } },
      owner: { connect: { id: user_d.id } },
    },
  });

  const village_e = await prismaClient.village.create({
    data: {
      name: "village_E",
      description: "desc_village_E",
      isPublic: true,
      users: { connect: { id: user_d.id } },
      owner: { connect: { id: user_d.id } },
    },
  });

  await prismaClient.message.create({
    data: {
      content: "message_1 content",
      village: {
        connect: { id: village_a.id },
      },
      user: {
        connect: { id: user_a.id },
      },
    },
  });

  await prismaClient.message.create({
    data: {
      content: "message_2 content",
      village: {
        connect: { id: village_a.id },
      },
      user: {
        connect: { id: user_a.id },
      },
    },
  });

  await prismaClient.message.create({
    data: {
      content: "message_3 content",
      village: {
        connect: { id: village_c.id },
      },
      user: {
        connect: { id: user_c.id },
      },
    },
  });

  await prismaClient.message.create({
    data: {
      content: "message_4 content",
      village: {
        connect: { id: village_b.id },
      },
      user: {
        connect: { id: user_b.id },
      },
    },
  });

  await prismaClient.message.create({
    data: {
      content: "message_5 content",
      village: {
        connect: { id: village_b.id },
      },
      user: {
        connect: { id: user_a.id },
      },
    },
  });

  await prismaClient.$disconnect();
}
