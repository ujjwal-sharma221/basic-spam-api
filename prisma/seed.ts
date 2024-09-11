import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const users = await Promise.all([
    createUser("John Doe", "+1234567890", "john@example.com"),
    createUser("Jane Smith", "+1987654321", "jane@example.com"),
    createUser("Alice Johnson", "+1122334455", "alice@example.com"),
    createUser("Bob Williams", "+1555666777", "bob@example.com"),
    createUser("Charlie Brown", "+1999000111", "charlie@example.com"),
  ]);

  // Create Contacts
  const contacts = await Promise.all([
    createContact("Contact 1", "+9876543210", users[0].id),
    createContact("Contact 2", "+8765432109", users[0].id),
    createContact("Contact 3", "+7654321098", users[1].id),
    createContact("Contact 4", "+6543210987", users[1].id),
    createContact("Contact 5", "+5432109876", users[2].id),
    createContact("Contact 6", "+4321098765", users[2].id),
    createContact("Contact 7", "+3210987654", users[3].id, true),
    createContact("Contact 8", "+2109876543", users[3].id, true),
    createContact("Contact 9", "+1098765432", users[4].id),
    createContact("Contact 10", "+0987654321", users[4].id, true),
  ]);

  // Create Spam entries
  await Promise.all([
    createSpam("+1111111111", 5, users[0].id),
    createSpam("+2222222222", 3, users[1].id),
    createSpam(contacts[6].phoneNumber, 2, users[2].id, contacts[6].id),
    createSpam(contacts[7].phoneNumber, 4, users[3].id, contacts[7].id),
    createSpam("+5555555555", 1, users[4].id),
    createSpam(contacts[9].phoneNumber, 6, users[0].id, contacts[9].id),
  ]);

  console.log("Seed data created successfully");
}

async function createUser(name: string, phoneNumber: string, email: string) {
  return prisma.user.create({
    data: {
      name,
      phoneNumber,
      email,
      password: await bcrypt.hash("password123", 10),
    },
  });
}

async function createContact(
  name: string,
  phoneNumber: string,
  userId: number,
  isSpam: boolean = false,
) {
  return prisma.contact.create({
    data: {
      name,
      phoneNumber,
      userId,
      isSpam,
    },
  });
}

async function createSpam(
  phoneNumber: string,
  markedCount: number,
  markedByUserId: number,
  contactId?: number,
) {
  return prisma.spam.create({
    data: {
      phoneNumber,
      markedCount,
      markedByUserId,
      contactId,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
