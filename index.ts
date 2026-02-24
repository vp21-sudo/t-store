import prompts from "prompts";

async function main() {
  console.clear();
  console.log("👋 Welcome to User Registration\n");

  const { username, name, email } = await prompts([
    {
      type: "text",
      name: "username",
      message: "Enter your username:",
      validate: (value) => (value.length > 0 ? true : "Username is required"),
    },
    {
      type: "text",
      name: "name",
      message: "Enter your full name:",
      validate: (value) => (value.length > 0 ? true : "Name is required"),
    },
    {
      type: "text",
      name: "email",
      message: "Enter your email:",
      validate: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : "Invalid email format",
    },
  ]);

  console.clear();
  console.log("⏳ Saving your information");

  const loadingChars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;

  const loadingInterval = setInterval(() => {
    process.stdout.write(`\r${loadingChars[i++ % loadingChars.length]} Saving...`);
  }, 80);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  clearInterval(loadingInterval);
  process.stdout.write("\r✓ Saving... done!\n");

  console.clear();
  console.log("✅ Your information has been saved!\n");
  console.log("📋 Summary:");
  console.log(`   Username: ${username}`);
  console.log(`   Name:     ${name}`);
  console.log(`   Email:    ${email}`);
  console.log("\n🎉 Thank you for registering!");
}

main().catch(console.error);
