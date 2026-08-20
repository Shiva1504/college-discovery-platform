import "dotenv/config";
import { PrismaClient, CollegeType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CITIES: { city: string; state: string }[] = [
  { city: "Delhi", state: "Delhi" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Chandigarh", state: "Chandigarh" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Kochi", state: "Kerala" },
  { city: "Patna", state: "Bihar" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Nagpur", state: "Maharashtra" },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Vellore", state: "Tamil Nadu" },
  { city: "Roorkee", state: "Uttarakhand" },
  { city: "Guwahati", state: "Assam" },
];

const NAME_PREFIXES = [
  "National Institute of Technology",
  "Indian Institute of Technology",
  "Indian Institute of Information Technology",
  "College of Engineering",
  "Institute of Technology and Management",
  "School of Engineering and Sciences",
  "University of Technology",
  "Institute of Engineering and Applied Sciences",
  "College of Science and Commerce",
  "Institute of Management and Technology",
];

const SUFFIXES = ["", " Campus", " (Autonomous)", " Institute"];

const DEGREES = [
  { name: "Computer Science and Engineering", degree: "B.Tech", years: 4, feesRange: [80000, 250000] },
  { name: "Electronics and Communication Engineering", degree: "B.Tech", years: 4, feesRange: [70000, 220000] },
  { name: "Mechanical Engineering", degree: "B.Tech", years: 4, feesRange: [60000, 200000] },
  { name: "Civil Engineering", degree: "B.Tech", years: 4, feesRange: [55000, 180000] },
  { name: "Information Technology", degree: "B.Tech", years: 4, feesRange: [75000, 230000] },
  { name: "Master of Business Administration", degree: "MBA", years: 2, feesRange: [150000, 500000] },
  { name: "Master of Computer Applications", degree: "MCA", years: 2, feesRange: [90000, 220000] },
  { name: "Bachelor of Commerce", degree: "B.Com", years: 3, feesRange: [20000, 90000] },
  { name: "Bachelor of Science - Physics", degree: "B.Sc", years: 3, feesRange: [15000, 70000] },
];

const REVIEW_TITLES = [
  "Great placements and faculty",
  "Good infrastructure but average hostel food",
  "Worth the fees, strong alumni network",
  "Solid academics, could improve sports facilities",
  "Decent college for the fee range",
  "Excellent labs and research exposure",
  "Average experience, depends on the branch",
  "Highly recommend for CSE branch",
];

const REVIEW_BODIES = [
  "The faculty is knowledgeable and approachable. Placement cell works actively with recruiters every year.",
  "Campus is well maintained and Wi-Fi coverage is decent across hostels. Labs could use an upgrade though.",
  "Curriculum is industry relevant and internships are encouraged from the second year onwards.",
  "Fee structure is reasonable compared to nearby colleges offering the same programs.",
  "Alumni network is strong and many seniors help juniors during placement season.",
  "Hostel facilities are basic but functional. Mess food quality varies by season.",
  "Sports and extracurricular activities are limited but academics more than make up for it.",
  "Overall a good choice if you're focused on core engineering branches.",
];

function pick<T>(arr: T[], seedIndex: number): T {
  return arr[seedIndex % arr.length];
}

function randInRange(min: number, max: number, seedIndex: number): number {
  const span = max - min;
  const hash = Math.abs(Math.sin(seedIndex) * 10000);
  const offset = Math.floor((hash - Math.floor(hash)) * span);
  return min + offset;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding database...");

  await prisma.savedComparison.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  const types: CollegeType[] = ["GOVERNMENT", "PRIVATE", "DEEMED"];
  const usedSlugs = new Set<string>();
  let collegesCreated = 0;
  const targetCount = 180;

  for (let i = 0; i < targetCount; i++) {
    const location = pick(CITIES, i);
    const prefix = pick(NAME_PREFIXES, i * 3 + 1);
    const suffix = pick(SUFFIXES, i);
    const name = `${prefix} ${location.city}${suffix}`.trim();
    let slug = slugify(`${name}-${location.city}`);
    let dedupe = 1;
    while (usedSlugs.has(slug)) {
      slug = `${slugify(`${name}-${location.city}`)}-${dedupe}`;
      dedupe++;
    }
    usedSlugs.add(slug);

    const type = pick(types, i * 5 + 2);
    const feesMin = randInRange(20000, 150000, i * 7 + 3);
    const feesMax = feesMin + randInRange(30000, 250000, i * 11 + 5);
    const rating = Math.round((randInRange(28, 50, i * 13 + 7) / 10) * 10) / 10;
    const establishedYear = 1950 + (i * 17 + 3) % 70;

    const college = await prisma.college.create({
      data: {
        slug,
        name,
        city: location.city,
        state: location.state,
        type,
        feesMin,
        feesMax,
        rating,
        establishedYear,
        description: `${name} is a ${type.toLowerCase()} institution located in ${location.city}, ${location.state}, established in ${establishedYear}. It offers undergraduate and postgraduate programs across engineering, management, and science disciplines with a focus on placements and industry exposure.`,
      },
    });
    collegesCreated++;

    const courseCount = 3 + (i % 4);
    for (let c = 0; c < courseCount; c++) {
      const course = pick(DEGREES, i * 3 + c);
      const fees = randInRange(course.feesRange[0], course.feesRange[1], i * 19 + c * 31);
      await prisma.course.create({
        data: {
          collegeId: college.id,
          name: course.name,
          degree: course.degree,
          durationYears: course.years,
          fees,
        },
      });
    }

    for (const year of [2022, 2023, 2024]) {
      const avgPackage = randInRange(400000, 1800000, i * 23 + year) / 100000;
      const medianPackage = avgPackage * 0.85;
      const highestPackage = avgPackage * (1.8 + (i % 5) * 0.2);
      const placementRate = 60 + (randInRange(0, 35, i * 29 + year) % 36);
      await prisma.placement.create({
        data: {
          collegeId: college.id,
          year,
          avgPackage: Math.round(avgPackage * 100) / 100,
          medianPackage: Math.round(medianPackage * 100) / 100,
          highestPackage: Math.round(highestPackage * 100) / 100,
          placementRate,
        },
      });
    }

    const reviewCount = 2 + (i % 3);
    for (let r = 0; r < reviewCount; r++) {
      await prisma.review.create({
        data: {
          collegeId: college.id,
          rating: 3 + ((i + r) % 3),
          title: pick(REVIEW_TITLES, i * 31 + r),
          body: pick(REVIEW_BODIES, i * 37 + r * 3),
        },
      });
    }

    if (collegesCreated % 20 === 0) {
      console.log(`  ${collegesCreated}/${targetCount} colleges seeded`);
    }
  }

  const demoPasswordHash = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: {
      email: "demo@example.com",
      passwordHash: demoPasswordHash,
      name: "Demo User",
    },
  });

  console.log(`Done. Created ${collegesCreated} colleges with courses, placements, and reviews.`);
  console.log("Demo login: demo@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
