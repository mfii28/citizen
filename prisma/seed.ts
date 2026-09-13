import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---- Admin user (change this password immediately after first login) ----
  await prisma.user.upsert({
    where: { email: "admin@thecitizenproject.org" },
    update: {},
    create: {
      name: "Site Administrator",
      email: "admin@thecitizenproject.org",
      passwordHash: await bcrypt.hash("Admin123!", 10),
      role: "ADMIN",
    },
  });

  // ---- Demo donor/volunteer accounts (for testing /account and the leaderboard) ----
  const donorUser = await prisma.user.upsert({
    where: { email: "ama.donor@example.org" },
    update: {},
    create: {
      name: "Ama Donkor",
      email: "ama.donor@example.org",
      passwordHash: await bcrypt.hash("Donor123!", 10),
      role: "MEMBER",
    },
  });

  const volunteerOne = await prisma.user.upsert({
    where: { email: "kwame.volunteer@example.org" },
    update: {},
    create: {
      name: "Kwame Asare",
      email: "kwame.volunteer@example.org",
      passwordHash: await bcrypt.hash("Volunteer123!", 10),
      role: "VOLUNTEER",
    },
  });

  const volunteerTwo = await prisma.user.upsert({
    where: { email: "esi.volunteer@example.org" },
    update: {},
    create: {
      name: "Esi Mensah",
      email: "esi.volunteer@example.org",
      passwordHash: await bcrypt.hash("Volunteer123!", 10),
      role: "VOLUNTEER",
    },
  });

  // ---- Initiatives ----
  const civicEd = await prisma.initiative.upsert({
    where: { slug: "global-citizenship-civic-education-programme" },
    update: {},
    create: {
      slug: "global-citizenship-civic-education-programme",
      title: "Global Citizenship & Civic Education Programme",
      summary:
        "A five-part programme helping basic school learners understand global citizenship, personal responsibility, and the social issues shaping their communities.",
      description:
        "Delivered in partnership with the National Commission for Civic Education, this programme takes JHS and upper primary learners through a structured journey — from a launch seminar on global citizenship, through honest conversations about adolescence and social vices, into hands-on community responsibility projects, a national day of service, and a closing pledge ceremony. It is designed around UN SDG 4 (Targets 4.6 and 4.7) and complements NCCE's civic education mandate with a youth-first, participatory approach.",
      coverImage: null,
      category: "Education & Civic Responsibility",
      objectives: [
        "Build learners' understanding of global citizenship and civic duty",
        "Equip young people to recognise and resist social vices",
        "Translate civic knowledge into visible community action",
      ],
      sdgTags: ["SDG 4"],
      status: "ACTIVE",
      budget: 45000,
      amountRaised: 12500,
      location: "South Tongu District, Volta Region",
      beneficiaries: "Basic school learners, ages 9–15",
      volunteersInvolved: 18,
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-03-01"),
    },
  });

  const clean = await prisma.initiative.upsert({
    where: { slug: "clean-communities-initiative" },
    update: {},
    create: {
      slug: "clean-communities-initiative",
      title: "Clean Communities Initiative",
      summary: "Volunteer-led clean-up and waste management education across riverside communities.",
      description:
        "South Tongu's communities live alongside the Volta estuary — a source of livelihood that also needs protecting. This initiative organises community clean-up days, basic waste segregation training, and youth-led environmental clubs in partnership with local assemblies.",
      category: "Environmental Sustainability",
      objectives: [
        "Reduce plastic waste along the riverbanks",
        "Train youth environmental ambassadors in each community",
        "Partner with local assemblies on waste collection points",
      ],
      sdgTags: ["SDG 11", "SDG 13", "SDG 14"],
      status: "ACTIVE",
      budget: 20000,
      amountRaised: 6400,
      location: "Riverside communities, South Tongu",
      beneficiaries: "Riverside households and youth groups",
      volunteersInvolved: 32,
      startDate: new Date("2026-06-01"),
    },
  });

  const skills = await prisma.initiative.upsert({
    where: { slug: "youth-skills-livelihood-initiative" },
    update: {},
    create: {
      slug: "youth-skills-livelihood-initiative",
      title: "Youth Skills & Livelihood Initiative",
      summary: "Practical vocational taster sessions and mentorship for out-of-school youth.",
      description:
        "For young people who have left school early, this initiative connects them with short vocational taster sessions, savings-group mentorship, and links to Ghana Enterprise Agency support — building a bridge back into productive, dignified work.",
      category: "Youth Empowerment",
      objectives: [
        "Provide vocational taster sessions in trades with local demand",
        "Pair each participant with a community mentor",
        "Track participants into further training or employment",
      ],
      sdgTags: ["SDG 4", "SDG 8"],
      status: "UPCOMING",
      budget: 30000,
      amountRaised: 3000,
      location: "South Tongu District",
      beneficiaries: "Out-of-school youth, ages 16–24",
      volunteersInvolved: 9,
      startDate: new Date("2026-11-01"),
    },
  });

  // ---- The five-event calendar, linked to the civic education initiative ----
  const events = [
    {
      slug: "launch-and-global-citizenship-seminar",
      title: "Launch & Global Citizenship Seminar",
      summary: "The public launch of The Citizen Project, followed by an interactive seminar on global citizenship.",
      description:
        "Community leaders, learners, and partner institutions gather to launch the programme, with a seminar introducing global citizenship concepts and how they connect to everyday life in South Tongu.",
      startDate: new Date("2026-09-12T09:00:00Z"),
      location: "South Tongu District",
    },
    {
      slug: "know-yourself-know-your-path",
      title: "Know Yourself, Know Your Path",
      summary: "An interactive dialogue on adolescence and social vices, led by facilitators and health partners.",
      description:
        "A candid, age-appropriate dialogue exploring the pressures of adolescence — peer pressure, examination malpractice, and other social vices — and how learners can chart a confident, healthy path forward.",
      startDate: new Date("2026-10-17T09:00:00Z"),
      location: "South Tongu District",
    },
    {
      slug: "our-community-our-responsibility",
      title: "Our Community, Our Responsibility",
      summary: "A play-based learning event exploring community responsibility through drama and games.",
      description:
        "Learners take part in role-play and structured games designed to make civic responsibility tangible — practising the everyday choices that keep a community healthy, safe, and fair.",
      startDate: new Date("2026-11-21T09:00:00Z"),
      location: "South Tongu District",
    },
    {
      slug: "national-service-day",
      title: "National Service Day",
      summary: "A day of hands-on volunteering and patriotism-building activities across participating communities.",
      description:
        "Learners and volunteers spend the day on visible community service projects — from clean-ups to helping elders — anchored in volunteerism and national pride.",
      startDate: new Date("2027-01-23T08:00:00Z"),
      location: "South Tongu District",
    },
    {
      slug: "citizens-pledge-and-showcase",
      title: "Citizens' Pledge & Showcase",
      summary: "The closing symposium, where learners take the Citizens' Pledge and showcase what they've built.",
      description:
        "The programme concludes with learners presenting projects from across the five events and publicly reciting the Citizens' Pledge — a personal commitment to civic responsibility.",
      startDate: new Date("2027-02-27T09:00:00Z"),
      location: "South Tongu District",
    },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: { ...e, initiativeId: civicEd.id },
    });
  }

  // ---- Testimonials ----
  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "JHS Form 2 learner",
        role: "Programme participant",
        content:
          "I used to think civic education was just a subject to pass. Now I actually point out when something in my community needs fixing — and I know who to tell.",
        featured: true,
      },
      {
        name: "Community volunteer",
        role: "Clean Communities Initiative",
        content:
          "Seeing the riverbank clear after our clean-up day, with the kids who did the work standing right there proud of it — that's the whole point of this project.",
        featured: true,
      },
      {
        name: "School headteacher",
        role: "Partner institution",
        content:
          "The five-event structure gave our students a full arc, not a one-off talk. They still bring up 'Know Yourself, Know Your Path' months later.",
        featured: true,
      },
    ],
  });

  // ---- Blog posts ----
  await prisma.blogPost.createMany({
    skipDuplicates: true,
    data: [
      {
        slug: "why-civic-education-matters-for-ghanas-youth",
        title: "Why Civic Education Matters for Ghana's Youth",
        excerpt: "Civic knowledge means little without the chance to practise it. Here's how we're closing that gap in South Tongu.",
        content:
          "Civic education has long lived inside a classroom subject. But knowing what a good citizen looks like is different from being one. This post walks through why The Citizen Project pairs every civic lesson with a real community action — and what we're seeing change as a result.",
        category: "Civic Education",
        tags: ["SDG4", "civic-education"],
        published: true,
      },
      {
        slug: "five-ways-to-get-involved-this-season",
        title: "Five Ways to Get Involved This Season",
        excerpt: "From a single afternoon to an ongoing role — here's where your time or support goes furthest right now.",
        content:
          "Not everyone can commit to a weekly volunteer shift, and that's fine. This post breaks down five concrete ways to support The Citizen Project this season, matched to how much time you actually have.",
        category: "Volunteering",
        tags: ["volunteering", "get-involved"],
        published: true,
      },
      {
        slug: "inside-our-community-survey-early-findings",
        title: "Inside Our Community Survey: Early Findings",
        excerpt: "The first reports are in. Here's what South Tongu residents are telling us — and what happens next.",
        content:
          "Our community reporting tool has been live for a few weeks, and the early pattern of submissions is already shaping where we focus. This post shares what residents are raising, without naming individual reporters, and how each report moves from submission to follow-up.",
        category: "Transparency",
        tags: ["community-survey", "transparency"],
        published: true,
      },
    ],
  });

  // ---- Partners ----
  await prisma.partner.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Ama Serwaa",
        organisation: "Ghana Health Service — South Tongu",
        position: "District Health Promotion Officer",
        email: "partnerships@example.org",
        category: "GOVERNMENT_AGENCY",
        purpose: "Co-facilitate the adolescent health dialogue sessions.",
        status: "APPROVED",
      },
      {
        name: "Kofi Mensah",
        organisation: "Volta Traders Union",
        position: "Chairman",
        email: "kofi@example.org",
        category: "COMMUNITY_GROUP",
        purpose: "Sponsor learning materials for the civic education programme.",
        status: "APPROVED",
      },
      {
        name: "Efua Asante",
        organisation: "Riverside Basic School",
        position: "Headteacher",
        email: "efua@example.org",
        category: "SCHOOL",
        purpose: "Host programme events and provide facilitation space.",
        status: "PENDING",
      },
    ],
  });

  // ---- Donations & expenditures (for the transparency dashboard) ----
  await prisma.donation.createMany({
    skipDuplicates: true,
    data: [
      { donorName: "Anonymous", donorEmail: "a1@example.org", amount: 500, method: "MOBILE_MONEY", status: "SUCCESS", reference: "SEED-D1", anonymous: true, initiativeId: civicEd.id },
      { donorName: "Efo Attipoe", donorEmail: "a2@example.org", amount: 1200, method: "CARD", status: "SUCCESS", reference: "SEED-D2", initiativeId: clean.id },
      { donorName: "Diaspora Friends of South Tongu", donorEmail: "a3@example.org", amount: 3000, method: "PAYPAL", status: "SUCCESS", reference: "SEED-D3", corporate: true, initiativeId: skills.id },
      { donorName: "Anonymous", donorEmail: "a4@example.org", amount: 250, method: "MOBILE_MONEY", status: "SUCCESS", reference: "SEED-D4", anonymous: true },
    ],
  });

  await prisma.expenditure.createMany({
    skipDuplicates: true,
    data: [
      { category: "PROGRAMS", description: "Facilitation & event materials", amount: 8200, date: new Date("2026-06-15"), initiativeId: civicEd.id },
      { category: "PROGRAMS", description: "Clean-up equipment & transport", amount: 3100, date: new Date("2026-06-20"), initiativeId: clean.id },
      { category: "ADMINISTRATION", description: "Coordination & communications", amount: 1400, date: new Date("2026-07-01") },
      { category: "FUNDRAISING", description: "Donor outreach materials", amount: 600, date: new Date("2026-07-05") },
    ],
  });

  // ---- Community survey reports (feeds the Community Map) ----
  await prisma.surveyReport.createMany({
    skipDuplicates: true,
    data: [
      {
        community: "Agorkpo",
        town: "Agorkpo",
        category: "INFRASTRUCTURE",
        title: "Broken bridge",
        description: "The community bridge is broken, cutting off safe access for residents and schoolchildren during the rainy season.",
        priority: "HIGH",
        urgency: "HIGH",
        status: "SUBMITTED",
        anonymous: true,
      },
      {
        community: "Dabala",
        town: "Dabala",
        category: "SANITATION",
        title: "Poor sanitation",
        description: "Waste is accumulating faster than it can be cleared, creating health risks near the market area.",
        priority: "HIGH",
        urgency: "HIGH",
        status: "IN_REVIEW",
        anonymous: true,
      },
      {
        community: "Sogakope",
        town: "Sogakope",
        category: "EDUCATION",
        title: "School furniture shortage",
        description: "Several classrooms have far more learners than desks, forcing some children to sit on the floor.",
        priority: "MEDIUM",
        urgency: "MEDIUM",
        status: "SUBMITTED",
        anonymous: true,
      },
    ],
  });

  // ---- Volunteer hours (feeds the Ambassadors leaderboard + certificates) ----
  await prisma.volunteerHour.createMany({
    data: [
      { userId: volunteerOne.id, initiativeId: clean.id, hours: 42, date: new Date("2026-06-10"), approved: true, description: "Riverbank clean-up days" },
      { userId: volunteerTwo.id, initiativeId: civicEd.id, hours: 18, date: new Date("2026-06-20"), approved: true, description: "Event facilitation" },
      { userId: donorUser.id, initiativeId: civicEd.id, hours: 6, date: new Date("2026-07-01"), approved: true, description: "Newsletter design help" },
    ],
  });

  // ---- A donation and a recurring gift linked to the demo donor account ----
  await prisma.donation.upsert({
    where: { reference: "SEED-D5-LINKED" },
    update: {},
    create: {
      donorName: donorUser.name,
      donorEmail: donorUser.email,
      userId: donorUser.id,
      amount: 400,
      method: "MOBILE_MONEY",
      status: "SUCCESS",
      reference: "SEED-D5-LINKED",
      initiativeId: civicEd.id,
    },
  });

  await prisma.recurringDonation.createMany({
    data: [{ userId: donorUser.id, initiativeId: clean.id, amount: 50, status: "ACTIVE" }],
  });

  await prisma.favorite.upsert({
    where: { userId_initiativeId: { userId: donorUser.id, initiativeId: skills.id } },
    update: {},
    create: { userId: donorUser.id, initiativeId: skills.id },
  });

  // ---- Success stories ----
  await prisma.successStory.createMany({
    skipDuplicates: true,
    data: [
      {
        slug: "from-classroom-to-community-action",
        title: "From classroom lesson to community action",
        beneficiaryName: "A JHS 2 learner, Sogakope",
        story: "After the 'Our Community, Our Responsibility' event, a small group of learners organised their own weekend litter-picking round — unprompted. It's now a monthly fixture.",
        impactMetric: "30+ learners now volunteering monthly",
        initiativeId: civicEd.id,
      },
      {
        slug: "clearer-water-safer-fishing",
        title: "Clearer water, safer fishing",
        beneficiaryName: "Fishing households, riverside communities",
        story: "Three clean-up days later, households along the clean-up stretch report fewer snagged nets and a noticeably clearer bank at low tide.",
        impactMetric: "3 clean-up days, 1.2km of riverbank cleared",
        initiativeId: clean.id,
      },
    ],
  });

  // ---- Reports ----
  await prisma.report.createMany({
    skipDuplicates: true,
    data: [
      { title: "The Citizen Project — Year One Impact Report", type: "IMPACT", year: 2026, summary: "Our first full programme cycle: reach, spend, and what changed on the ground." },
      { title: "Financial Statement — H1 2026", type: "FINANCIAL", year: 2026, summary: "Income and expenditure for the first half of the year, matching the live Transparency dashboard." },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
