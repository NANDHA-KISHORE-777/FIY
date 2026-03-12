// Mock data for analytics dashboard

export const complaintTrendsData = {
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  series: [
    {
      name: 'Complaints Submitted',
      data: [12, 15, 18, 22, 19, 25, 28, 24, 30, 27, 32, 35]
    },
    {
      name: 'Complaints Resolved',
      data: [10, 13, 16, 20, 17, 23, 25, 22, 28, 25, 30, 32]
    }
  ]
};

export const ipcDistributionData = [
  { label: 'BNS 379 (Theft)', value: 45 },
  { label: 'BNS 420 (Fraud)', value: 32 },
  { label: 'BNS 323 (Assault)', value: 28 },
  { label: 'BNS 406 (Breach of Trust)', value: 22 },
  { label: 'BNS 504 (Insult)', value: 18 },
  { label: 'Others', value: 35 }
];

export const statusBreakdownData = [
  { status: 'Solved', count: 120, color: '#10b981' },
  { status: 'Pending', count: 45, color: '#f59e0b' },
  { status: 'Rejected', count: 15, color: '#ef4444' }
];

export const responseTimeData = {
  avgResponseTime: '2.5 days',
  fastestResponse: '4 hours',
  slowestResponse: '7 days',
  categories: ['< 1 day', '1-3 days', '3-5 days', '5-7 days', '> 7 days'],
  data: [35, 65, 45, 25, 10]
};

export const monthlyStatsData = [
  { month: 'January', submitted: 12, solved: 10, pending: 2, rejected: 0 },
  { month: 'February', submitted: 15, solved: 13, pending: 2, rejected: 0 },
  { month: 'March', submitted: 18, solved: 16, pending: 2, rejected: 0 },
  { month: 'April', submitted: 22, solved: 20, pending: 2, rejected: 0 },
  { month: 'May', submitted: 19, solved: 17, pending: 2, rejected: 0 },
  { month: 'June', submitted: 25, solved: 23, pending: 2, rejected: 0 },
];

export const topIPCSections = [
  { section: 'BNS 379', description: 'Theft', count: 45, percentage: 25 },
  { section: 'BNS 420', description: 'Fraud', count: 32, percentage: 18 },
  { section: 'BNS 323', description: 'Assault', count: 28, percentage: 16 },
  { section: 'BNS 406', description: 'Breach of Trust', count: 22, percentage: 12 },
  { section: 'BNS 504', description: 'Insult', count: 18, percentage: 10 },
];

export const dailyActivityData = {
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      name: 'New Complaints',
      data: [8, 12, 15, 10, 14, 6, 4]
    }
  ]
};

export const categoryWiseData = [
  { category: 'Theft', count: 45, color: '#667eea' },
  { category: 'Fraud', count: 32, color: '#f59e0b' },
  { category: 'Assault', count: 28, color: '#ef4444' },
  { category: 'Cyber Crime', count: 25, color: '#10b981' },
  { category: 'Property', count: 22, color: '#8b5cf6' },
  { category: 'Others', count: 28, color: '#6b7280' }
];

export const resolutionTimelineData = {
  categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  series: [
    {
      name: 'Resolved',
      data: [25, 30, 35, 30]
    },
    {
      name: 'In Progress',
      data: [15, 12, 10, 8]
    }
  ]
};
