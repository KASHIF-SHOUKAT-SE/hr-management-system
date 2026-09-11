import mongoose from "mongoose";
import EmployeeModel from "./models/Employee";

const MONGODB_URI = "mongodb://127.0.0.1:27017/hr_management";

const firstNames = [
  "Pristia", "Hanna", "Rayhan", "Alisa", "Dimas", "Kathryn", "Eleanor", "Cody", "Wade", "Jane",
  "Robert", "Guy", "Esther", "Devon", "Courtney", "Cameron", "Leslie", "Jenny", "Savannah", "Darrell",
  "Floyd", "Bessie", "Jerome", "Marvin", "Theresa", "Kristin", "Ralph", "Arlene", "Annette", "Dianne",
  "Albert", "Jacob", "Brooklyn", "Ronald", "Connie", "Theresa", "Colleen", "Gladys", "Bill", "Warren",
  "Morris", "Audrey", "Vicki", "Kurt", "Tamara", "Sonia", "Derrick", "Regina", "Darren", "Penny"
];

const lastNames = [
  "Candra", "Baptista", "Saris", "Sahara", "Pratama", "Murphy", "Pena", "Fisher", "Warren", "Cooper",
  "Fox", "Hawkins", "Howard", "Lane", "Henry", "Williamson", "Alexander", "Wilson", "Nguyen", "Steward",
  "Miles", "Bell", "Watson", "McKinney", "Webb", "Watson", "Edwards", "Black", "Robertson", "Russell",
  "Flores", "Jones", "Simmons", "Richards", "Mitchell", "Gutierrez", "Vasquez", "Mendoza", "Castillo", "Guerrero"
];

const jobTitles = [
  "UI UX Designer",
  "UI Designer",
  "Graphic Designer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Product Manager",
  "DevOps Engineer",
  "HR Lead",
  "HR Specialist",
  "QA Engineer",
  "Mobile Developer",
  "Data Analyst",
  "Scrum Master",
];

const departments = [
  "Team Product",
  "Engineering",
  "Design",
  "Product",
  "Infrastructure",
  "Human Resources",
  "Quality Assurance",
  "Data & Analytics",
];

const offices = ["Unipixel Office", "Jakarta Office", "Remote", "London Branch", "Singapore Hub"];

const lineManagers = [
  "@Pristiacandra",
  "@KathrynM",
  "@CodyF",
  "@JaneC",
  "@EleanorP",
  "@WadeW",
  "@DevonL",
  "@LeslieA",
];

const statuses: Array<"active" | "onboarding" | "probation" | "on-leave" | "terminated"> = [
  "active",
  "active",
  "active",
  "active",
  "active",
  "active",
  "onboarding",
  "onboarding",
  "probation",
  "probation",
  "on-leave",
  "terminated",
];

const accountStatuses: Array<"activated" | "need-invitation"> = [
  "activated",
  "activated",
  "activated",
  "need-invitation",
];

function generateEmployees(count: number) {
  const employees = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${fName} ${lName}`;
    
    // Unique email generation
    let email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i > 40 ? i : ""}@company.com`;
    let counter = 1;
    while (usedEmails.has(email)) {
      email = `${fName.toLowerCase()}.${lName.toLowerCase()}${counter}@company.com`;
      counter++;
    }
    usedEmails.add(email);

    const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const office = offices[Math.floor(Math.random() * offices.length)];
    const lineManager = lineManagers[Math.floor(Math.random() * lineManagers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const accountStatus = accountStatuses[Math.floor(Math.random() * accountStatuses.length)];

    employees.push({
      name,
      email,
      avatarUrl: "",
      jobTitle,
      lineManager,
      department,
      office,
      status,
      accountStatus,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000 * 2)),
    });
  }

  return employees;
}

async function seed() {
  console.log("Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  await EmployeeModel.deleteMany({});
  console.log("Cleared existing employees collection.");

  const totalToSeed = 135; // 100 se 150 ke darmiyan
  const employeesData = generateEmployees(totalToSeed);

  const inserted = await EmployeeModel.insertMany(employeesData);
  console.log(`Successfully seeded ${inserted.length} employees into 'hr_management.employees'!`);

  await mongoose.disconnect();
  console.log("Disconnected successfully.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
