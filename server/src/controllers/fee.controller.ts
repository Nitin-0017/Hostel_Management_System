import { Request, Response } from "express";
import { FeeService } from "../services/FeeService";

const service = new FeeService();

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatFee(r: any) {
  return {
    id:            r.id,
    month:         r.month,
    monthName:     MONTH_NAMES[r.month] ?? "",
    year:          r.year,
    amount:        Number(r.amount),
    status:        r.status,
    dueDate:       r.dueDate,
    paidAt:        r.paidAt ?? null,
    paymentMethod: r.paymentMethod ?? null,
    transactionId: r.transactionId ?? null,
    remarks:       r.remarks ?? null,
    createdAt:     r.createdAt,
  };
}

export const getMyFees = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await service.getByStudent(req.user!.subId);
    res.json({ success: true, data: records.map(formatFee) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyFeeSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const summary = await service.getSummary(req.user!.subId);
    res.json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
