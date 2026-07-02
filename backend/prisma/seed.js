const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding PulseX database...\n");

  // ── 1. Clean existing data (order matters for FK constraints) ──
  await prisma.leaveRequest.deleteMany();
  await prisma.workLog.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();

  console.log("🧹 Cleared existing data");

  // ── 2. Teams ──
  const engineeringTeam = await prisma.team.create({
    data: { name: "Engineering" },
  });
  const designTeam = await prisma.team.create({
    data: { name: "Design" },
  });
  const productTeam = await prisma.team.create({
    data: { name: "Product" },
  });

  console.log("✅ Teams created");

  // ── 3. Hash passwords ──
  const defaultPassword = await bcrypt.hash("password123", 10);
  const adminPassword   = await bcrypt.hash("admin@123",   10);

  // ── 4. Users ──
  const admin = await prisma.user.create({
    data: {
      name:         "Arjun Sharma",
      email:        "admin@pulsex.com",
      password:     adminPassword,
      role:         "ADMIN",
      department:   "Management",
      leaveBalance: 30,
      teamId:       engineeringTeam.id,
    },
  });

  const sunidhi = await prisma.user.create({
    data: {
      name:         "Sunidhi Verma",
      email:        "sunidhi@pulsex.com",
      password:     defaultPassword,
      role:         "EMPLOYEE",
      department:   "Engineering",
      leaveBalance: 18,
      teamId:       engineeringTeam.id,
    },
  });

  const rohan = await prisma.user.create({
    data: {
      name:         "Rohan Mehta",
      email:        "rohan@pulsex.com",
      password:     defaultPassword,
      role:         "EMPLOYEE",
      department:   "Design",
      leaveBalance: 20,
      teamId:       designTeam.id,
    },
  });

  const priya = await prisma.user.create({
    data: {
      name:         "Priya Nair",
      email:        "priya@pulsex.com",
      password:     defaultPassword,
      role:         "MANAGER",
      department:   "Product",
      leaveBalance: 25,
      teamId:       productTeam.id,
    },
  });

  const dev = await prisma.user.create({
    data: {
      name:         "Dev Patel",
      email:        "dev@pulsex.com",
      password:     defaultPassword,
      role:         "EMPLOYEE",
      department:   "Engineering",
      leaveBalance: 15,
      teamId:       engineeringTeam.id,
    },
  });

  console.log("✅ Users created");

  // ── 5. Helper: random time offset ──
  const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };

  const setTime = (date, h, m) => {
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  };

  // ── 6. Attendance records (last 14 days for each user) ──
  const users = [sunidhi, rohan, priya, dev, admin];

  const attendanceData = [];

  for (const user of users) {
    for (let i = 13; i >= 0; i--) {
      const date = daysAgo(i);
      const dayOfWeek = date.getDay();

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      // 80% present, 10% late, 10% absent
      const rand = Math.random();
      let status = "PRESENT";
      let isLate = false;
      let checkInHour  = 9;
      let checkInMin   = Math.floor(Math.random() * 30);
      let checkOutHour = 17;
      let checkOutMin  = Math.floor(Math.random() * 60);

      if (rand < 0.1) {
        status = "ABSENT";
      } else if (rand < 0.2) {
        status      = "LATE";
        isLate      = true;
        checkInHour = 10;
        checkInMin  = Math.floor(Math.random() * 30) + 15;
      }

      if (status === "ABSENT") {
        attendanceData.push({
          userId:  user.id,
          date,
          status:  "ABSENT",
          isLate:  false,
        });
      } else {
        const checkIn    = setTime(date, checkInHour, checkInMin);
        const checkOut   = setTime(date, checkOutHour, checkOutMin);
        const hoursWorked = parseFloat(
          ((checkOut - checkIn) / 3600000).toFixed(2)
        );

        attendanceData.push({
          userId: user.id,
          date,
          checkIn,
          checkOut,
          hoursWorked,
          isLate,
          status,
        });
      }
    }
  }

  await prisma.attendance.createMany({ data: attendanceData });
  console.log(`✅ ${attendanceData.length} attendance records created`);

  // ── 7. Work Logs ──
  const projects = [
    "PulseX Dashboard",
    "PulseX Backend",
    "Mobile App",
    "AI Integration",
    "Client Portal",
  ];

  const tasks = {
    "PulseX Dashboard": [
      { title: "Built Login UI",            description: "Designed and implemented the login page with animations" },
      { title: "Dashboard Stats Cards",     description: "Created attendance, hours, tasks and leave stat cards" },
      { title: "Attendance Chart",          description: "Integrated recharts line chart for weekly hours" },
      { title: "Work Log Table",            description: "Built responsive work log table with filters" },
      { title: "Sidebar Navigation",        description: "Collapsible sidebar with active route highlighting" },
      { title: "AI Chat Interface",         description: "Chat UI with neon styling and animated typing indicator" },
    ],
    "PulseX Backend": [
      { title: "Auth API",                  description: "JWT based register and login endpoints" },
      { title: "Attendance Controller",     description: "Check-in and check-out with duplicate prevention" },
      { title: "Work Log CRUD",             description: "Add, edit, delete and fetch work logs" },
      { title: "Leave Management API",      description: "Apply, view and cancel leave requests" },
      { title: "Dashboard Stats API",       description: "Aggregated stats endpoint for dashboard" },
      { title: "Prisma Schema Setup",       description: "Designed and migrated the full database schema" },
    ],
    "Mobile App": [
      { title: "React Native Setup",        description: "Initialized project with navigation and theming" },
      { title: "Push Notifications",        description: "Firebase integration for attendance reminders" },
      { title: "Offline Mode",              description: "Local cache for attendance when offline" },
    ],
    "AI Integration": [
      { title: "Gemini API Setup",          description: "Connected Google Gemini 1.5 Flash to backend" },
      { title: "Prompt Engineering",        description: "Designed system prompts for workforce assistant" },
      { title: "Chat History Feature",      description: "Persist and fetch AI conversation history" },
    ],
    "Client Portal": [
      { title: "Client Dashboard",          description: "Analytics view for client project tracking" },
      { title: "Report Generation",         description: "PDF export of weekly productivity reports" },
    ],
  };

  const statuses = ["COMPLETED", "COMPLETED", "COMPLETED", "IN_PROGRESS", "PENDING"];

  const workLogData = [];

  for (const user of users) {
    const numLogs = Math.floor(Math.random() * 6) + 4; // 4-9 logs per user

    for (let i = 0; i < numLogs; i++) {
      const project    = projects[Math.floor(Math.random() * projects.length)];
      const taskList   = tasks[project];
      const task       = taskList[Math.floor(Math.random() * taskList.length)];
      const status     = statuses[Math.floor(Math.random() * statuses.length)];
      const hoursSpent = parseFloat((Math.random() * 6 + 1).toFixed(1));
      const date       = daysAgo(Math.floor(Math.random() * 14));

      workLogData.push({
        userId:      user.id,
        project,
        title:       task.title,
        description: task.description,
        hoursSpent,
        status,
        date,
      });
    }
  }

  await prisma.workLog.createMany({ data: workLogData });
  console.log(`✅ ${workLogData.length} work logs created`);

  // ── 8. Leave Requests ──
  const leaveScenarios = [
    {
      type:      "CASUAL",
      reason:    "Family function and personal errands",
      daysFromNow: 10,
      duration:  2,
      status:    "APPROVED",
    },
    {
      type:      "SICK",
      reason:    "Fever and flu, doctor advised rest",
      daysFromNow: -5,
      duration:  3,
      status:    "APPROVED",
    },
    {
      type:      "EARNED",
      reason:    "Annual vacation with family",
      daysFromNow: 20,
      duration:  5,
      status:    "PENDING",
    },
    {
      type:      "CASUAL",
      reason:    "Personal work — bank and paperwork",
      daysFromNow: -15,
      duration:  1,
      status:    "REJECTED",
    },
    {
      type:      "SICK",
      reason:    "Migraine and eye strain from extended screen time",
      daysFromNow: 5,
      duration:  2,
      status:    "PENDING",
    },
  ];

  const leaveData = [];

  for (const user of users) {
    // Give each user 2-3 leave requests
    const numLeaves = Math.floor(Math.random() * 2) + 2;
    const picked    = leaveScenarios
      .sort(() => 0.5 - Math.random())
      .slice(0, numLeaves);

    for (const scenario of picked) {
      const startDate = daysAgo(-scenario.daysFromNow);
      const endDate   = new Date(startDate);
      endDate.setDate(endDate.getDate() + scenario.duration - 1);

      leaveData.push({
        userId:    user.id,
        type:      scenario.type,
        startDate,
        endDate,
        reason:    scenario.reason,
        status:    scenario.status,
      });
    }
  }

  await prisma.leaveRequest.createMany({ data: leaveData });
  console.log(`✅ ${leaveData.length} leave requests created`);

  // ── 9. Summary ──
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 PulseX database seeded successfully!\n");
  console.log("📋 SEED SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`   Teams      : 3`);
  console.log(`   Users      : ${users.length}`);
  console.log(`   Attendance : ${attendanceData.length} records`);
  console.log(`   Work Logs  : ${workLogData.length} entries`);
  console.log(`   Leaves     : ${leaveData.length} requests`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("🔑 LOGIN CREDENTIALS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   Admin    → admin@pulsex.com    / admin@123");
  console.log("   Employee → sunidhi@pulsex.com  / password123");
  console.log("   Employee → rohan@pulsex.com    / password123");
  console.log("   Manager  → priya@pulsex.com    / password123");
  console.log("   Employee → dev@pulsex.com      / password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });