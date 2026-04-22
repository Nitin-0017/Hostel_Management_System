import { StudentService } from "../services/StudentService";
import { RoomService } from "../services/RoomService";
import { ComplaintService } from "../services/ComplaintService";
import { LeaveService } from "../services/LeaveService";
import { CleaningService } from "../services/CleaningService";
import { NotificationService } from "../services/NotificationService";
import { ReportService } from "../services/ReportService";
import { AuthService } from "../services/AuthService";
import { StaffService } from "../services/StaffService";

export class ServiceRegistry {
  private static instance: ServiceRegistry;

  readonly auth: AuthService;
  readonly student: StudentService;
  readonly staff: StaffService;
  readonly room: RoomService;
  readonly complaint: ComplaintService;
  readonly leave: LeaveService;
  readonly cleaning: CleaningService;
  readonly notification: NotificationService;
  readonly report: ReportService;

  private constructor() {
    this.auth = new AuthService();
    this.student = new StudentService();
    this.staff = new StaffService();
    this.room = new RoomService();
    this.complaint = new ComplaintService();
    this.leave = new LeaveService();
    this.cleaning = new CleaningService();
    this.notification = new NotificationService();
    this.report = new ReportService();
  }

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }
}
