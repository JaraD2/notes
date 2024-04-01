import { PrismaClient } from "@prisma/client";

const Role = {
	USER: "USER",
	ADMIN: "ADMIN",
};

const SeedData = [
	{
		users: {
			id: 1,
			firstName: "John",
			lastName: "Doe",
			password: "password",
			salt: "salt",
			role: Role.USER,
			email: "JohnDoe@gmail.com",
			phone: "1234567890",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	},
	{
		notes: {
			title: "Title",
			content: "Content",
			userId: 1,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	},
];



async function main() {
  const prisma = new PrismaClient();

  try {
    for (const data of SeedData) {
      if (data.users) {
        await prisma.users.create({
          data: data.users,
        });
      }
      if (data.notes) {
        await prisma.notes.create({
          data: data.notes,
        });
      }
    }
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Error running seed:", error);
});
