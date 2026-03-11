import { Complaint } from 'src/types/Complaint';

export const mockComplaintData: Complaint[] = [
  {
    id: 1,
    sNo: 1,
    complaintDescription: "Theft of mobile phone at railway station",
    submittedDate: "2024-01-15",
    status: "Solved"
  },
  {
    id: 2,
    sNo: 2,
    complaintDescription: "Fraud case involving online payment scam",
    submittedDate: "2024-02-20",
    status: "Solved"
  },
  {
    id: 3,
    sNo: 3,
    complaintDescription: "Assault and battery incident at local market",
    submittedDate: "2024-03-10",
    status: "Pending"
  }
];
