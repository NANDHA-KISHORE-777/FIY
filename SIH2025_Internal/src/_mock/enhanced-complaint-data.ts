import { Complaint } from 'src/types/Complaint';

export interface EnhancedComplaint extends Complaint {
  complainantName: string;
  location: string;
  ipcSection?: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo?: string;
  remarks?: string;
}

export const enhancedComplaintData: EnhancedComplaint[] = [
  {
    id: 1,
    sNo: 1,
    complaintDescription: "Theft of mobile phone at railway station during evening hours",
    submittedDate: "2024-01-15",
    status: "Solved",
    complainantName: "Rajesh Kumar",
    location: "Mumbai Central Railway Station",
    ipcSection: "IPC 379",
    priority: "High",
    assignedTo: "Officer Sharma",
    remarks: "CCTV footage reviewed, suspect identified and arrested"
  },
  {
    id: 2,
    sNo: 2,
    complaintDescription: "Online payment fraud involving fake investment scheme",
    submittedDate: "2024-02-20",
    status: "Solved",
    complainantName: "Priya Patel",
    location: "Ahmedabad",
    ipcSection: "IPC 420",
    priority: "High",
    assignedTo: "Officer Mehta",
    remarks: "Fraudulent website shut down, amount recovered"
  },
  {
    id: 3,
    sNo: 3,
    complaintDescription: "Physical assault and battery incident at local market",
    submittedDate: "2024-03-10",
    status: "Pending",
    complainantName: "Amit Singh",
    location: "Connaught Place, Delhi",
    ipcSection: "IPC 323",
    priority: "Medium",
    assignedTo: "Officer Verma",
    remarks: "Investigation in progress, witness statements being recorded"
  },
  {
    id: 4,
    sNo: 4,
    complaintDescription: "Breach of trust by business partner in joint venture",
    submittedDate: "2024-03-15",
    status: "Pending",
    complainantName: "Sunita Reddy",
    location: "Hyderabad",
    ipcSection: "IPC 406",
    priority: "Medium",
    assignedTo: "Officer Rao",
    remarks: "Financial documents under review"
  },
  {
    id: 5,
    sNo: 5,
    complaintDescription: "Verbal abuse and insult in public place",
    submittedDate: "2024-03-20",
    status: "Solved",
    complainantName: "Vikram Malhotra",
    location: "Bangalore",
    ipcSection: "IPC 504",
    priority: "Low",
    assignedTo: "Officer Nair",
    remarks: "Parties reconciled, case closed with mutual agreement"
  },
  {
    id: 6,
    sNo: 6,
    complaintDescription: "House burglary with forced entry during night",
    submittedDate: "2024-04-05",
    status: "Pending",
    complainantName: "Meera Joshi",
    location: "Pune",
    ipcSection: "IPC 380",
    priority: "High",
    assignedTo: "Officer Desai",
    remarks: "Forensic team collected evidence, investigation ongoing"
  },
  {
    id: 7,
    sNo: 7,
    complaintDescription: "Cyber harassment through social media platforms",
    submittedDate: "2024-04-12",
    status: "Solved",
    complainantName: "Anjali Sharma",
    location: "Chennai",
    ipcSection: "IPC 509",
    priority: "Medium",
    assignedTo: "Officer Kumar",
    remarks: "Accused identified through IP tracking, legal action taken"
  },
  {
    id: 8,
    sNo: 8,
    complaintDescription: "Forgery of documents for property transaction",
    submittedDate: "2024-04-18",
    status: "Pending",
    complainantName: "Ravi Iyer",
    location: "Kochi",
    ipcSection: "IPC 465",
    priority: "High",
    assignedTo: "Officer Menon",
    remarks: "Document verification in progress with registrar office"
  },
  {
    id: 9,
    sNo: 9,
    complaintDescription: "Defamation through false statements in newspaper",
    submittedDate: "2024-04-25",
    status: "Solved",
    complainantName: "Deepak Gupta",
    location: "Jaipur",
    ipcSection: "IPC 500",
    priority: "Medium",
    assignedTo: "Officer Rathore",
    remarks: "Newspaper published apology, case settled"
  },
  {
    id: 10,
    sNo: 10,
    complaintDescription: "Extortion attempt with threatening messages",
    submittedDate: "2024-05-02",
    status: "Pending",
    complainantName: "Kavita Nair",
    location: "Trivandrum",
    ipcSection: "IPC 384",
    priority: "High",
    assignedTo: "Officer Pillai",
    remarks: "Phone records being analyzed, suspect under surveillance"
  }
];
