export type ComplaintStatus = "Pending" | "Solved" | "Rejected";

export interface Complaint {
  id: number;
  sNo: number;
  complaintDescription: string;
  submittedDate: string;
  status: ComplaintStatus;
}
