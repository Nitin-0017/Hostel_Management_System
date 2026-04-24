import { PrismaClient, Role, RoomType, RoomStatus, ComplaintCategory, ComplaintStatus, LeaveStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  console.log('🧹 Clearing existing data...');
  // Delete in reverse order of dependencies
  await prisma.cleaningStatusLog.deleteMany();
  await prisma.cleaningRequest.deleteMany();
  await prisma.staffRoomAssignment.deleteMany();
  await prisma.feeRecord.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.roomAllocation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  
  await prisma.student.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Admin@1234', 10);
  const studentPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  console.log('👤 Creating Admin user...');
  await prisma.user.create({
    data: {
      email: 'admin@hostelhub.com',
      passwordHash: passwordHash,
      firstName: 'Hostel',
      lastName: 'Admin',
      phone: '9876543210',
      role: Role.ADMIN,
      admin: {
        create: {
          adminLevel: 2
        }
      }
    }
  });

  // 2. Create Rooms
  console.log('🏠 Creating Rooms...');
  const roomsData = [
    { roomNumber: '101', floor: 1, building: 'Block A', type: RoomType.SINGLE, capacity: 1, monthlyFee: 5000, status: RoomStatus.AVAILABLE, amenities: '["AC", "Balcony"]' },
    { roomNumber: '102', floor: 1, building: 'Block A', type: RoomType.DOUBLE, capacity: 2, monthlyFee: 3500, status: RoomStatus.AVAILABLE, amenities: '["Non-AC"]' },
    { roomNumber: '201', floor: 2, building: 'Block B', type: RoomType.TRIPLE, capacity: 3, monthlyFee: 2500, status: RoomStatus.AVAILABLE, amenities: '["Non-AC", "Attached Bath"]' },
    { roomNumber: '202', floor: 2, building: 'Block B', type: RoomType.DOUBLE, capacity: 2, monthlyFee: 3500, status: RoomStatus.AVAILABLE, amenities: '["AC"]' },
    { roomNumber: '301', floor: 3, building: 'Block C', type: RoomType.SINGLE, capacity: 1, monthlyFee: 5000, status: RoomStatus.MAINTENANCE, amenities: '["AC"]' },
  ];

  const createdRooms = [];
  for (const room of roomsData) {
    createdRooms.push(await prisma.room.create({ data: room }));
  }

  // 3. Create Students and Allocations
  console.log('🎓 Creating Students and Allocations...');
  const studentsData = [
    { firstName: 'John', lastName: 'Doe', email: 'john@student.com', course: 'B.Tech', year: 1, enrollmentNumber: '240101001', parentName: 'Michael Doe', parentPhone: '1112223333' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane@student.com', course: 'B.Tech', year: 2, enrollmentNumber: '240101002', parentName: 'Robert Smith', parentPhone: '4445556666' },
    { firstName: 'Pragyan', lastName: 'Sandhu', email: 'pragyan@student.com', course: 'B.Tech', year: 1, enrollmentNumber: '240101003', parentName: 'Arjun Sandhu', parentPhone: '7778889999' },
  ];

  const createdStudents = [];
  for (let i = 0; i < studentsData.length; i++) {
    const s = studentsData[i];
    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash: studentPasswordHash,
        firstName: s.firstName,
        lastName: s.lastName,
        phone: '123123123' + i,
        role: Role.STUDENT,
        student: {
          create: {
            enrollmentNumber: s.enrollmentNumber,
            course: s.course,
            year: s.year,
            parentName: s.parentName,
            parentPhone: s.parentPhone,
            address: '123 Campus Road'
          }
        }
      },
      include: { student: true }
    });
    
    if (user.student) {
      createdStudents.push(user.student);
      
      // Allocate room (skip last student so they are unallocated)
      if (i < 2) {
        const room = createdRooms[i];
        if (room) {
          await prisma.roomAllocation.create({
            data: {
              studentId: user.student.id,
              roomId: room.id,
            }
          });
          await prisma.room.update({
            where: { id: room.id },
            data: { 
              occupied: { increment: 1 }, 
              status: room.capacity > 1 ? RoomStatus.AVAILABLE : RoomStatus.OCCUPIED 
            }
          });
        }
      }
    }
  }

  // 4. Create Complaints
  console.log('📋 Creating Complaints...');
  if (createdStudents[0]) {
    await prisma.complaint.create({
      data: {
        studentId: createdStudents[0].id,
        category: ComplaintCategory.MAINTENANCE,
        subject: 'Leaking Tap in 101',
        description: 'The tap in the bathroom is leaking continuously and wasting water.',
        status: ComplaintStatus.OPEN
      }
    });
  }

  if (createdStudents[1]) {
    await prisma.complaint.create({
      data: {
        studentId: createdStudents[1].id,
        category: ComplaintCategory.CLEANLINESS,
        subject: 'Room 102 not cleaned',
        description: 'Room has not been cleaned for 3 days. Dust is accumulating.',
        status: ComplaintStatus.IN_PROGRESS
      }
    });
  }

  // 5. Create Leave Requests
  console.log('📅 Creating Leave Requests...');
  if (createdStudents[0]) {
    await prisma.leaveRequest.create({
      data: {
        studentId: createdStudents[0].id,
        fromDate: new Date(Date.now() + 86400000), // Tomorrow
        toDate: new Date(Date.now() + 3 * 86400000), // +3 days
        reason: 'Going home for a family function',
        status: LeaveStatus.PENDING
      }
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
