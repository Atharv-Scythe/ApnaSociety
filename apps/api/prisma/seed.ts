// ──────────────────────────────────────────────────────────
// ApnaSociety — Rich Hackathon DB Seeder
// ──────────────────────────────────────────────────────────
// Seeds a complete "Apex Heights" society with realistic
// Indian data: wings, units, residents, fund heads, billing
// history, notices, complaints, polls, amenities.
// ──────────────────────────────────────────────────────────

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Helper: hash password (simple for hackathon) ────────
// In production, use bcrypt. For hackathon speed, we store plain.
function hashPassword(pw: string): string {
  // TODO: Replace with bcrypt in production
  return pw;
}

async function main() {
  console.log("🏗️  Seeding ApnaSociety database...\n");

  // ═══════════════════════════════════════════════════════
  // 1. SOCIETY
  // ═══════════════════════════════════════════════════════
  const society = await prisma.society.create({
    data: {
      name: "Apex Heights Co-operative Housing Society",
      registrationNo: "MH/MUM/HSG/1402/2018",
      address: "Survey No. 42, Baner Road, Near Balewadi High Street",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411045",
      settings: {
        lateFeePercent: 1.5,
        lateFeeGraceDays: 15,
        billingFrequency: "MONTHLY",
        votingUnit: "PER_FLAT",
        quorumDefault: 51,
      },
    },
  });
  console.log(`✅ Society: ${society.name} (${society.id})`);

  // ═══════════════════════════════════════════════════════
  // 2. WINGS
  // ═══════════════════════════════════════════════════════
  const wingA = await prisma.wing.create({
    data: { societyId: society.id, name: "A", floors: 10 },
  });
  const wingB = await prisma.wing.create({
    data: { societyId: society.id, name: "B", floors: 10 },
  });
  console.log(`✅ Wings: ${wingA.name}, ${wingB.name}`);

  // ═══════════════════════════════════════════════════════
  // 3. UNITS (20 per wing = 40 total)
  // ═══════════════════════════════════════════════════════
  const unitTypes = [
    { type: "2BHK", sqft: 950 },
    { type: "3BHK", sqft: 1350 },
  ];

  const allUnits: { id: string; number: string; wingId: string; areaSqft: number }[] = [];

  for (const wing of [wingA, wingB]) {
    for (let floor = 1; floor <= 10; floor++) {
      for (let flat = 1; flat <= 2; flat++) {
        const unitType = unitTypes[(floor + flat) % 2];
        const unitNumber = `${wing.name}-${floor}${String(flat).padStart(2, "0")}`;
        const unit = await prisma.unit.create({
          data: {
            societyId: society.id,
            wingId: wing.id,
            number: unitNumber,
            floor,
            areaSqft: unitType.sqft,
            type: unitType.type,
            status: "OCCUPIED",
          },
        });
        allUnits.push({ id: unit.id, number: unit.number, wingId: wing.id, areaSqft: unit.areaSqft });
      }
    }
  }
  console.log(`✅ Units: ${allUnits.length} flats created`);

  // ═══════════════════════════════════════════════════════
  // 4. ROLES (seeded defaults)
  // ═══════════════════════════════════════════════════════
  const roleNames = [
    "CHAIRMAN", "SECRETARY", "TREASURER",
    "WING_REP", "COMMITTEE_MEMBER", "OWNER", "TENANT",
  ];
  const roles: Record<string, string> = {};
  for (const name of roleNames) {
    const role = await prisma.role.create({
      data: { name, description: `${name} role` },
    });
    roles[name] = role.id;
  }
  console.log(`✅ Roles: ${Object.keys(roles).join(", ")}`);

  // ═══════════════════════════════════════════════════════
  // 5. DEMO USERS
  // ═══════════════════════════════════════════════════════

  // --- Chairman: Rajesh Sharma ---
  const chairman = await prisma.user.create({
    data: {
      societyId: society.id,
      name: "Rajesh Sharma",
      email: "chairman@apex.com",
      mobile: "9876543210",
      password: hashPassword("chairman123"),
      status: "ACTIVE",
    },
  });
  await prisma.roleAssignment.create({
    data: {
      userId: chairman.id,
      roleId: roles.CHAIRMAN,
      scopeType: "SOCIETY",
      scopeId: society.id,
    },
  });
  // Chairman also owns A-501
  const chairmanUnit = allUnits.find((u) => u.number === "A-501")!;
  await prisma.unitMembership.create({
    data: {
      userId: chairman.id,
      unitId: chairmanUnit.id,
      relation: "OWNER",
      canVote: true,
      canPay: true,
    },
  });
  await prisma.roleAssignment.create({
    data: {
      userId: chairman.id,
      roleId: roles.OWNER,
      scopeType: "UNIT",
      scopeId: chairmanUnit.id,
    },
  });

  // --- Wing Rep A: Sunita Patel ---
  const wingRepA = await prisma.user.create({
    data: {
      societyId: society.id,
      name: "Sunita Patel",
      email: "wingrep.a@apex.com",
      mobile: "9876543211",
      password: hashPassword("wingrep123"),
      status: "ACTIVE",
    },
  });
  await prisma.roleAssignment.create({
    data: {
      userId: wingRepA.id,
      roleId: roles.WING_REP,
      scopeType: "WING",
      scopeId: wingA.id,
    },
  });
  const wingRepUnit = allUnits.find((u) => u.number === "A-301")!;
  await prisma.unitMembership.create({
    data: {
      userId: wingRepA.id,
      unitId: wingRepUnit.id,
      relation: "OWNER",
      canVote: true,
      canPay: true,
    },
  });

  // --- Resident: Amit Verma (Owner, A-402) ---
  const resident = await prisma.user.create({
    data: {
      societyId: society.id,
      name: "Amit Verma",
      email: "resident.a402@apex.com",
      mobile: "9876543212",
      password: hashPassword("resident123"),
      status: "ACTIVE",
    },
  });
  const residentUnit = allUnits.find((u) => u.number === "A-402")!;
  await prisma.unitMembership.create({
    data: {
      userId: resident.id,
      unitId: residentUnit.id,
      relation: "OWNER",
      canVote: true,
      canPay: true,
    },
  });
  await prisma.roleAssignment.create({
    data: {
      userId: resident.id,
      roleId: roles.OWNER,
      scopeType: "UNIT",
      scopeId: residentUnit.id,
    },
  });

  // --- Tenant: Karan Rao (Tenant, B-101) ---
  const tenant = await prisma.user.create({
    data: {
      societyId: society.id,
      name: "Karan Rao",
      email: "tenant.b101@apex.com",
      mobile: "9876543213",
      password: hashPassword("tenant123"),
      status: "ACTIVE",
    },
  });
  const tenantUnit = allUnits.find((u) => u.number === "B-101")!;
  await prisma.unitMembership.create({
    data: {
      userId: tenant.id,
      unitId: tenantUnit.id,
      relation: "TENANT",
      canVote: false,
      canPay: true,
    },
  });
  await prisma.roleAssignment.create({
    data: {
      userId: tenant.id,
      roleId: roles.TENANT,
      scopeType: "UNIT",
      scopeId: tenantUnit.id,
    },
  });

  // --- Secretary: Meera Joshi ---
  const secretary = await prisma.user.create({
    data: {
      societyId: society.id,
      name: "Meera Joshi",
      email: "secretary@apex.com",
      mobile: "9876543214",
      password: hashPassword("secretary123"),
      status: "ACTIVE",
    },
  });
  await prisma.roleAssignment.create({
    data: {
      userId: secretary.id,
      roleId: roles.SECRETARY,
      scopeType: "SOCIETY",
      scopeId: society.id,
    },
  });
  const secretaryUnit = allUnits.find((u) => u.number === "A-201")!;
  await prisma.unitMembership.create({
    data: {
      userId: secretary.id,
      unitId: secretaryUnit.id,
      relation: "OWNER",
      canVote: true,
      canPay: true,
    },
  });

  console.log(`✅ Users: Chairman (Rajesh), Wing Rep A (Sunita), Resident A-402 (Amit), Tenant B-101 (Karan), Secretary (Meera)`);

  // ═══════════════════════════════════════════════════════
  // 6. FUND HEADS
  // ═══════════════════════════════════════════════════════
  const fundMaintenance = await prisma.fund.create({
    data: { societyId: society.id, name: "General Maintenance", type: "MAINTENANCE" },
  });
  const fundSinking = await prisma.fund.create({
    data: { societyId: society.id, name: "Sinking Fund", type: "SINKING" },
  });
  const fundClub = await prisma.fund.create({
    data: { societyId: society.id, name: "Clubhouse & Sports", type: "CLUBHOUSE" },
  });
  const fundRepair = await prisma.fund.create({
    data: { societyId: society.id, name: "Major Repairs Reserve", type: "REPAIR" },
  });
  console.log(`✅ Funds: Maintenance, Sinking, Clubhouse, Repair`);

  // ═══════════════════════════════════════════════════════
  // 7. CHARGE RULES
  // ═══════════════════════════════════════════════════════
  const now = new Date();
  const effectiveFrom = new Date(2026, 3, 1); // April 2026

  await prisma.chargeRule.createMany({
    data: [
      // General Maintenance: ₹2.50/sqft
      { fundId: fundMaintenance.id, basis: "PER_SQFT", amount: new Prisma.Decimal(2.50), frequency: "MONTHLY", effectiveFrom },
      // Sinking Fund: flat ₹1,000/unit
      { fundId: fundSinking.id, basis: "FLAT", amount: new Prisma.Decimal(1000), frequency: "MONTHLY", effectiveFrom },
      // Clubhouse: flat ₹500/unit
      { fundId: fundClub.id, basis: "FLAT", amount: new Prisma.Decimal(500), frequency: "MONTHLY", effectiveFrom },
      // Major Repairs: flat ₹300/unit
      { fundId: fundRepair.id, basis: "FLAT", amount: new Prisma.Decimal(300), frequency: "MONTHLY", effectiveFrom },
    ],
  });
  console.log(`✅ Charge rules: ₹2.50/sqft Maintenance + ₹1,000 Sinking + ₹500 Club + ₹300 Repair`);

  // ═══════════════════════════════════════════════════════
  // 8. BILLING CYCLES & INVOICES (2 past paid + 1 current)
  // ═══════════════════════════════════════════════════════

  // Helper to calculate unit charges
  function calcUnitTotal(areaSqft: number): {
    maintenance: number; sinking: number; club: number; repair: number; total: number;
  } {
    const maintenance = areaSqft * 2.5;
    const sinking = 1000;
    const club = 500;
    const repair = 300;
    return { maintenance, sinking, club, repair, total: maintenance + sinking + club + repair };
  }

  // --- Past Cycle 1: Aug 2026 (PAID) ---
  const cycle1 = await prisma.billingCycle.create({
    data: {
      societyId: society.id,
      periodStart: new Date(2026, 7, 1),
      periodEnd: new Date(2026, 7, 31),
      dueDate: new Date(2026, 7, 15),
      status: "CLOSED",
    },
  });

  // --- Past Cycle 2: Sep 2026 (PAID) ---
  const cycle2 = await prisma.billingCycle.create({
    data: {
      societyId: society.id,
      periodStart: new Date(2026, 8, 1),
      periodEnd: new Date(2026, 8, 30),
      dueDate: new Date(2026, 8, 15),
      status: "CLOSED",
    },
  });

  // --- Current Cycle: Oct 2026 (ISSUED / PENDING) ---
  const cycle3 = await prisma.billingCycle.create({
    data: {
      societyId: society.id,
      periodStart: new Date(2026, 9, 1),
      periodEnd: new Date(2026, 9, 31),
      dueDate: new Date(2026, 9, 31),
      status: "ISSUED",
    },
  });

  let invoiceSeq = 1;

  // Create invoices for key demo units
  const demoUnits = [
    residentUnit,   // A-402 (Amit Verma)
    chairmanUnit,   // A-501 (Chairman)
    wingRepUnit,    // A-301 (Wing Rep)
    tenantUnit,     // B-101 (Tenant)
  ];

  for (const unit of demoUnits) {
    const charges = calcUnitTotal(unit.areaSqft);

    for (const cycle of [cycle1, cycle2]) {
      const monthNum = cycle.periodStart.getMonth() + 1;
      const yearNum = cycle.periodStart.getFullYear();
      const invNumber = `INV-${yearNum}-${String(monthNum).padStart(2, "0")}-${String(invoiceSeq).padStart(4, "0")}`;

      const invoice = await prisma.invoice.create({
        data: {
          unitId: unit.id,
          cycleId: cycle.id,
          number: invNumber,
          total: new Prisma.Decimal(charges.total),
          status: "PAID",
          issuedAt: cycle.periodStart,
        },
      });

      // Invoice lines
      await prisma.invoiceLine.createMany({
        data: [
          { invoiceId: invoice.id, fundId: fundMaintenance.id, description: "General Maintenance", amount: new Prisma.Decimal(charges.maintenance) },
          { invoiceId: invoice.id, fundId: fundSinking.id, description: "Sinking Fund", amount: new Prisma.Decimal(charges.sinking) },
          { invoiceId: invoice.id, fundId: fundClub.id, description: "Clubhouse & Sports", amount: new Prisma.Decimal(charges.club) },
          { invoiceId: invoice.id, fundId: fundRepair.id, description: "Major Repairs Reserve", amount: new Prisma.Decimal(charges.repair) },
        ],
      });

      // Payment record
      const payment = await prisma.payment.create({
        data: {
          unitId: unit.id,
          amount: new Prisma.Decimal(charges.total),
          method: "UPI",
          gatewayRef: `PAY-${invNumber}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          status: "SUCCESS",
          receivedAt: new Date(cycle.periodStart.getTime() + 7 * 24 * 60 * 60 * 1000), // paid ~7 days after cycle start
        },
      });

      await prisma.paymentAllocation.create({
        data: { paymentId: payment.id, invoiceId: invoice.id, amount: new Prisma.Decimal(charges.total) },
      });

      // Ledger entries for income
      await prisma.ledgerEntry.createMany({
        data: [
          { societyId: society.id, unitId: unit.id, fundId: fundMaintenance.id, account: "UNIT_RECEIVABLE", debit: new Prisma.Decimal(charges.maintenance), credit: new Prisma.Decimal(0), refType: "INVOICE", refId: invoice.id, narration: `Maintenance charge - ${unit.number}` },
          { societyId: society.id, unitId: unit.id, fundId: fundMaintenance.id, account: "FUND_INCOME", debit: new Prisma.Decimal(0), credit: new Prisma.Decimal(charges.maintenance), refType: "INVOICE", refId: invoice.id, narration: `Maintenance income - ${unit.number}` },
          { societyId: society.id, unitId: unit.id, fundId: fundSinking.id, account: "UNIT_RECEIVABLE", debit: new Prisma.Decimal(charges.sinking), credit: new Prisma.Decimal(0), refType: "INVOICE", refId: invoice.id },
          { societyId: society.id, unitId: unit.id, fundId: fundSinking.id, account: "FUND_INCOME", debit: new Prisma.Decimal(0), credit: new Prisma.Decimal(charges.sinking), refType: "INVOICE", refId: invoice.id },
          // Payment entries
          { societyId: society.id, unitId: unit.id, fundId: fundMaintenance.id, account: "BANK_GATEWAY", debit: new Prisma.Decimal(charges.total), credit: new Prisma.Decimal(0), refType: "PAYMENT", refId: payment.id, narration: `UPI payment - ${unit.number}` },
          { societyId: society.id, unitId: unit.id, fundId: fundMaintenance.id, account: "UNIT_RECEIVABLE", debit: new Prisma.Decimal(0), credit: new Prisma.Decimal(charges.total), refType: "PAYMENT", refId: payment.id, narration: `Payment received - ${unit.number}` },
        ],
      });

      invoiceSeq++;
    }

    // Current cycle invoice (PENDING — not yet paid)
    const currentInvNumber = `INV-2026-10-${String(invoiceSeq).padStart(4, "0")}`;
    const currentInvoice = await prisma.invoice.create({
      data: {
        unitId: unit.id,
        cycleId: cycle3.id,
        number: currentInvNumber,
        total: new Prisma.Decimal(charges.total),
        status: "PENDING",
        issuedAt: cycle3.periodStart,
      },
    });

    await prisma.invoiceLine.createMany({
      data: [
        { invoiceId: currentInvoice.id, fundId: fundMaintenance.id, description: "General Maintenance", amount: new Prisma.Decimal(charges.maintenance) },
        { invoiceId: currentInvoice.id, fundId: fundSinking.id, description: "Sinking Fund", amount: new Prisma.Decimal(charges.sinking) },
        { invoiceId: currentInvoice.id, fundId: fundClub.id, description: "Clubhouse & Sports", amount: new Prisma.Decimal(charges.club) },
        { invoiceId: currentInvoice.id, fundId: fundRepair.id, description: "Major Repairs Reserve", amount: new Prisma.Decimal(charges.repair) },
      ],
    });

    // Ledger entries for the receivable (charge posted but not yet paid)
    await prisma.ledgerEntry.createMany({
      data: [
        { societyId: society.id, unitId: unit.id, fundId: fundMaintenance.id, account: "UNIT_RECEIVABLE", debit: new Prisma.Decimal(charges.maintenance), credit: new Prisma.Decimal(0), refType: "INVOICE", refId: currentInvoice.id, narration: `Oct 2026 Maintenance - ${unit.number}` },
        { societyId: society.id, unitId: unit.id, fundId: fundMaintenance.id, account: "FUND_INCOME", debit: new Prisma.Decimal(0), credit: new Prisma.Decimal(charges.maintenance), refType: "INVOICE", refId: currentInvoice.id },
        { societyId: society.id, unitId: unit.id, fundId: fundSinking.id, account: "UNIT_RECEIVABLE", debit: new Prisma.Decimal(charges.sinking), credit: new Prisma.Decimal(0), refType: "INVOICE", refId: currentInvoice.id },
        { societyId: society.id, unitId: unit.id, fundId: fundSinking.id, account: "FUND_INCOME", debit: new Prisma.Decimal(0), credit: new Prisma.Decimal(charges.sinking), refType: "INVOICE", refId: currentInvoice.id },
        { societyId: society.id, unitId: unit.id, fundId: fundClub.id, account: "UNIT_RECEIVABLE", debit: new Prisma.Decimal(charges.club), credit: new Prisma.Decimal(0), refType: "INVOICE", refId: currentInvoice.id },
        { societyId: society.id, unitId: unit.id, fundId: fundClub.id, account: "FUND_INCOME", debit: new Prisma.Decimal(0), credit: new Prisma.Decimal(charges.club), refType: "INVOICE", refId: currentInvoice.id },
      ],
    });

    invoiceSeq++;
  }
  console.log(`✅ Billing: 2 past paid cycles + 1 current pending cycle (${invoiceSeq - 1} invoices total)`);

  // ═══════════════════════════════════════════════════════
  // 9. NOTICES
  // ═══════════════════════════════════════════════════════
  const notice1 = await prisma.notice.create({
    data: {
      societyId: society.id,
      title: "Annual General Meeting — Sunday, 25th October 2026",
      body: `Dear Members,\n\nThe Annual General Meeting of Apex Heights CHS Ltd. will be held on Sunday, 25th October 2026, at 10:00 AM in the Society Clubhouse (Ground Floor, Wing B).\n\n**Agenda:**\n1. Confirmation of minutes of last AGM\n2. Adoption of audited accounts for FY 2025-26\n3. Approval of revised maintenance charges from January 2027\n4. Proposal: Installation of solar panels on terrace\n5. Proposal: Replacement of Wing A elevators (OTIS contract)\n6. Election of new committee members\n7. Any other matter with permission of the Chair\n\nPlease carry your identity proof and flat ownership documents. One vote per flat.\n\nRegards,\nMeera Joshi\nHon. Secretary`,
      category: "ANNOUNCEMENT",
      pinned: true,
      status: "PUBLISHED",
    },
  });

  const notice2 = await prisma.notice.create({
    data: {
      societyId: society.id,
      title: "🚨 Emergency: Wing A Water Tank Cleaning — 18th October",
      body: `Dear Wing A Residents,\n\nThe overhead water tank for Wing A will be cleaned on Saturday, 18th October 2026. Water supply will be interrupted from 9:00 AM to 2:00 PM.\n\nPlease store sufficient water for the day. Tanker water will be available on request (contact security desk).\n\nApologies for the inconvenience.\n\n— Society Maintenance Team`,
      category: "EMERGENCY",
      pinned: true,
      status: "PUBLISHED",
    },
  });
  // Target notice2 to Wing A only
  await prisma.noticeTarget.create({
    data: { noticeId: notice2.id, wingId: wingA.id },
  });

  const notice3 = await prisma.notice.create({
    data: {
      societyId: society.id,
      title: "Updated Parking Regulations — Effective 1st November 2026",
      body: `The committee has approved revised parking regulations:\n\n1. Each flat is entitled to one reserved parking spot.\n2. Second vehicle parking: ₹500/month (subject to availability).\n3. Visitor parking limited to 4 hours; overnight requires security log entry.\n4. Two-wheelers must use the designated two-wheeler bay only.\n5. No commercial vehicles allowed overnight.\n\nFull rules document available in the Document Vault.\n\n— Rajesh Sharma, Chairman`,
      category: "RULES",
      pinned: false,
      status: "PUBLISHED",
      version: 2,
    },
  });
  console.log(`✅ Notices: AGM announcement, Wing A emergency, parking rules`);

  // ═══════════════════════════════════════════════════════
  // 10. COMPLAINTS
  // ═══════════════════════════════════════════════════════
  const complaint1 = await prisma.complaint.create({
    data: {
      societyId: society.id,
      unitId: residentUnit.id,
      wingId: wingA.id,
      raisedById: resident.id,
      assigneeId: wingRepA.id,
      title: "Wing A Elevator #2 — Frequent breakdowns",
      description: "The second elevator in Wing A (right side) has been breaking down almost every other day for the past 2 weeks. Yesterday it got stuck between floors 4 and 5 for 20 minutes with an elderly resident inside. This is a serious safety hazard. Please get the OTIS maintenance team to do a full inspection.",
      category: "ELEVATOR",
      priority: "HIGH",
      status: "IN_PROGRESS",
      slaDueAt: new Date(2026, 9, 20),
    },
  });
  await prisma.complaintEvent.createMany({
    data: [
      { complaintId: complaint1.id, actorId: resident.id, type: "COMMENT", visibility: "PUBLIC", content: "The elevator made a grinding noise again this morning around 8:30 AM.", createdAt: new Date(2026, 9, 10) },
      { complaintId: complaint1.id, actorId: wingRepA.id, type: "STATUS_CHANGE", visibility: "PUBLIC", content: "OTIS maintenance team has been contacted. Inspection scheduled for 16th October.", metadata: { from: "OPEN", to: "IN_PROGRESS" }, createdAt: new Date(2026, 9, 11) },
      { complaintId: complaint1.id, actorId: wingRepA.id, type: "COMMENT", visibility: "INTERNAL", content: "OTIS contract is up for renewal in December. Quote from ThyssenKrupp also obtained — ₹3.2L/year vs OTIS ₹3.8L/year. Will present at AGM.", createdAt: new Date(2026, 9, 12) },
    ],
  });

  const complaint2 = await prisma.complaint.create({
    data: {
      societyId: society.id,
      wingId: wingB.id,
      raisedById: tenant.id,
      title: "Stray dogs entering from back gate",
      description: "There are 3-4 stray dogs entering the society from the back gate (near the service road). They bark loudly at night and have chased my child twice. The security guard at the back gate leaves it open after 8 PM.",
      category: "SECURITY",
      priority: "MEDIUM",
      status: "ACKNOWLEDGED",
      anonymous: true,
    },
  });
  await prisma.complaintEvent.create({
    data: {
      complaintId: complaint2.id,
      actorId: secretary.id,
      type: "STATUS_CHANGE",
      visibility: "PUBLIC",
      content: "Acknowledged. Security supervisor has been informed. Will ensure the back gate is kept closed at all times.",
      metadata: { from: "OPEN", to: "ACKNOWLEDGED" },
    },
  });
  console.log(`✅ Complaints: Elevator (IN_PROGRESS), Stray dogs (ACKNOWLEDGED)`);

  // ═══════════════════════════════════════════════════════
  // 11. POLLS
  // ═══════════════════════════════════════════════════════
  const poll = await prisma.poll.create({
    data: {
      societyId: society.id,
      title: "Approve installation of solar panels on society terrace",
      description: "The committee proposes installing a 50kW solar panel system on the terrace of both wings. Estimated cost: ₹22,00,000 (funded from Sinking Fund + Government subsidy of 40%). Expected savings: ₹3,500/month on common electricity. Payback period: ~3.5 years.\n\nDo you approve this expenditure?",
      type: "YES_NO",
      ownersOnly: true,
      secretBallot: false,
      quorumPercent: 51,
      passThreshold: 67, // Two-thirds majority required for capital expenditure
      opensAt: new Date(2026, 9, 14, 10, 0), // Today
      closesAt: new Date(2026, 9, 25, 18, 0), // Closes at AGM
      status: "OPEN",
    },
  });

  const optionYes = await prisma.pollOption.create({
    data: { pollId: poll.id, label: "Yes, approve the solar panel installation", order: 1 },
  });
  const optionNo = await prisma.pollOption.create({
    data: { pollId: poll.id, label: "No, do not approve", order: 2 },
  });
  const optionAbstain = await prisma.pollOption.create({
    data: { pollId: poll.id, label: "Abstain", order: 3 },
  });

  // Pre-cast some votes to show partial results
  const votingUnits = allUnits.filter((u) => u.wingId === wingA.id).slice(0, 8);
  for (let i = 0; i < votingUnits.length; i++) {
    const option = i < 5 ? optionYes : i < 7 ? optionNo : optionAbstain;
    await prisma.vote.create({
      data: { pollId: poll.id, optionId: option.id, unitId: votingUnits[i].id },
    });
  }
  console.log(`✅ Poll: Solar panel approval (8 votes pre-cast, poll OPEN)`);

  // ═══════════════════════════════════════════════════════
  // 12. MEETINGS
  // ═══════════════════════════════════════════════════════
  const agm = await prisma.meeting.create({
    data: {
      societyId: society.id,
      title: "Annual General Meeting 2026-27",
      type: "AGM",
      scopeType: "SOCIETY",
      scheduledAt: new Date(2026, 9, 25, 10, 0),
      venue: "Society Clubhouse, Ground Floor, Wing B",
      quorumRequired: 21, // 51% of 40 units
      agenda: "1. Minutes of last AGM\n2. Audited Accounts FY 2025-26\n3. Revised Maintenance\n4. Solar Panel Proposal\n5. Elevator Replacement\n6. Committee Election\n7. AOB",
      status: "SCHEDULED",
    },
  });

  // Pre-fill some RSVPs
  await prisma.attendance.createMany({
    data: [
      { meetingId: agm.id, userId: chairman.id, response: "ATTENDING" },
      { meetingId: agm.id, userId: wingRepA.id, response: "ATTENDING" },
      { meetingId: agm.id, userId: resident.id, response: "ATTENDING" },
      { meetingId: agm.id, userId: secretary.id, response: "ATTENDING" },
    ],
  });
  console.log(`✅ Meeting: AGM scheduled for 25th Oct, 4 RSVPs`);

  // ═══════════════════════════════════════════════════════
  // 13. AMENITIES
  // ═══════════════════════════════════════════════════════
  const clubhouse = await prisma.amenity.create({
    data: {
      societyId: society.id,
      name: "Clubhouse Party Hall",
      description: "Air-conditioned party hall with 100-person capacity, sound system, and kitchen access. Ideal for birthdays, festivals, and get-togethers.",
      operatingHours: "09:00-22:00",
      slotMinutes: 240,
      bookingFee: new Prisma.Decimal(1500),
      depositAmount: new Prisma.Decimal(3000),
      maxAdvanceDays: 30,
      requiresClearDues: true,
    },
  });

  const badminton = await prisma.amenity.create({
    data: {
      societyId: society.id,
      name: "Badminton Court",
      description: "Indoor badminton court with professional flooring and LED lighting. Rackets available at security desk.",
      operatingHours: "06:00-22:00",
      slotMinutes: 60,
      bookingFee: new Prisma.Decimal(0),
      maxAdvanceDays: 7,
      requiresClearDues: false,
    },
  });

  const pool = await prisma.amenity.create({
    data: {
      societyId: society.id,
      name: "Swimming Pool",
      description: "25m lap pool with children's section. Lifeguard on duty during operating hours. Cap and costume mandatory.",
      operatingHours: "06:00-09:00,16:00-20:00",
      slotMinutes: 60,
      bookingFee: new Prisma.Decimal(0),
      maxAdvanceDays: 3,
      requiresClearDues: true,
    },
  });

  // Pre-fill some bookings
  await prisma.booking.create({
    data: {
      amenityId: clubhouse.id,
      unitId: chairmanUnit.id,
      userId: chairman.id,
      date: new Date(2026, 9, 18),
      startTime: "18:00",
      endTime: "22:00",
      status: "CONFIRMED",
      fee: new Prisma.Decimal(1500),
      notes: "Diwali celebration — society members welcome",
    },
  });

  await prisma.booking.create({
    data: {
      amenityId: badminton.id,
      unitId: residentUnit.id,
      userId: resident.id,
      date: new Date(2026, 9, 15),
      startTime: "07:00",
      endTime: "08:00",
      status: "CONFIRMED",
      fee: new Prisma.Decimal(0),
    },
  });
  console.log(`✅ Amenities: Clubhouse, Badminton, Swimming Pool (2 bookings)`);

  // ═══════════════════════════════════════════════════════
  // 14. DOCUMENTS
  // ═══════════════════════════════════════════════════════
  await prisma.document.createMany({
    data: [
      { societyId: society.id, title: "Society Bye-Laws (Amended 2024)", category: "BYE_LAWS", fileUrl: "/docs/bye-laws-2024.pdf", version: 3 },
      { societyId: society.id, title: "Audited Accounts FY 2025-26", category: "AUDIT_REPORT", fileUrl: "/docs/audit-2025-26.pdf", version: 1 },
      { societyId: society.id, title: "Building Insurance Policy 2026-27", category: "INSURANCE", fileUrl: "/docs/insurance-2026-27.pdf", version: 1 },
      { societyId: society.id, title: "OTIS Elevator AMC Agreement", category: "AMC", fileUrl: "/docs/otis-amc-2026.pdf", version: 1 },
    ],
  });
  console.log(`✅ Documents: Bye-laws, Audit Report, Insurance, OTIS AMC`);

  // ═══════════════════════════════════════════════════════
  // 15. AUDIT LOG SAMPLES
  // ═══════════════════════════════════════════════════════
  await prisma.auditLog.createMany({
    data: [
      { societyId: society.id, actorId: chairman.id, action: "CREATE", entity: "billing_cycles", entityId: cycle3.id, after: { period: "Oct 2026", status: "ISSUED" }, timestamp: new Date(2026, 9, 1) },
      { societyId: society.id, actorId: secretary.id, action: "CREATE", entity: "notices", entityId: notice1.id, after: { title: "AGM Notice" }, timestamp: new Date(2026, 9, 5) },
      { societyId: society.id, actorId: chairman.id, action: "CREATE", entity: "polls", entityId: poll.id, after: { title: "Solar Panel Approval" }, timestamp: new Date(2026, 9, 14) },
    ],
  });
  console.log(`✅ Audit logs: 3 sample entries\n`);

  // ═══════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════
  console.log("═══════════════════════════════════════════════════");
  console.log("  🎉 Seeding complete! ApnaSociety is ready.     ");
  console.log("═══════════════════════════════════════════════════");
  console.log("");
  console.log("  Demo Credentials:");
  console.log("  ────────────────────────────────────────────────");
  console.log("  Chairman Rajesh Sharma  → chairman@apex.com / chairman123");
  console.log("  Wing Rep Sunita Patel   → wingrep.a@apex.com / wingrep123");
  console.log("  Resident Amit Verma     → resident.a402@apex.com / resident123");
  console.log("  Tenant Karan Rao        → tenant.b101@apex.com / tenant123");
  console.log("  Secretary Meera Joshi   → secretary@apex.com / secretary123");
  console.log("  OTP Bypass              → Any registered mobile + OTP 123456");
  console.log("═══════════════════════════════════════════════════\n");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    prisma.$disconnect();
    process.exit(1);
  });
