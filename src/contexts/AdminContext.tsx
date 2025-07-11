import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, PendingApproval, SystemAlert, FinancialSummary } from '../types/admin';

interface AdminContextType {
  adminUser: AdminUser | null;
  pendingApprovals: PendingApproval[];
  systemAlerts: SystemAlert[];
  financialSummary: FinancialSummary;
  refreshData: () => void;
  approveRequest: (id: string, comments?: string) => Promise<void>;
  rejectRequest: (id: string, reason: string) => Promise<void>;
  markAlertAsRead: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalMembers: 2500,
    activeMembers: 2350,
    totalContributions: 125000000,
    monthlyContributions: 5200000,
    totalClaims: 45,
    pendingClaims: 12,
    medicalExpenditure: 2800000,
    accountBalance: 890000000
  });

  useEffect(() => {
    // Load admin user from localStorage or API
    const savedAdmin = localStorage.getItem('adminUser');
    if (savedAdmin) {
      setAdminUser(JSON.parse(savedAdmin));
    }

    // Load mock data
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock pending approvals
    setPendingApprovals([
      {
        id: '1',
        type: 'Profile Update',
        memberId: 'M001234',
        memberName: 'John Doe',
        submittedBy: 'John Doe',
        submittedDate: '2024-01-15',
        status: 'Pending',
        priority: 'Medium',
        changes: [
          { field: 'Phone Number', oldValue: '+254 712 345 678', newValue: '+254 712 345 679' },
          { field: 'Email', oldValue: 'john.old@email.com', newValue: 'john.new@email.com' }
        ]
      },
      {
        id: '2',
        type: 'Beneficiary Change',
        memberId: 'M001235',
        memberName: 'Jane Smith',
        submittedBy: 'Jane Smith',
        submittedDate: '2024-01-14',
        status: 'Under Review',
        priority: 'High',
        changes: [
          { field: 'Beneficiary Added', oldValue: null, newValue: 'Michael Smith (Son) - 25%' }
        ],
        documents: ['birth_certificate.pdf', 'relationship_affidavit.pdf']
      },
      {
        id: '3',
        type: 'Claim Submission',
        memberId: 'M001236',
        memberName: 'Robert Johnson',
        submittedBy: 'Robert Johnson',
        submittedDate: '2024-01-13',
        status: 'Pending',
        priority: 'High',
        changes: [
          { field: 'Medical Claim', oldValue: null, newValue: 'KES 45,000 - Emergency Surgery' }
        ],
        documents: ['medical_report.pdf', 'hospital_bill.pdf']
      }
    ]);

    // Mock system alerts
    setSystemAlerts([
      {
        id: '1',
        type: 'Medical Overdue',
        severity: 'High',
        message: 'Kenyatta Hospital has overdue bills exceeding 45 days (KES 125,000)',
        memberId: 'M001240',
        createdDate: '2024-01-15',
        isRead: false,
        actionRequired: true
      },
      {
        id: '2',
        type: 'Contribution Missing',
        severity: 'Critical',
        message: 'ABC Company Ltd has not submitted December 2023 contributions',
        createdDate: '2024-01-14',
        isRead: false,
        actionRequired: true
      },
      {
        id: '3',
        type: 'Document Expiry',
        severity: 'Medium',
        message: '15 members have KRA PIN certificates expiring within 30 days',
        createdDate: '2024-01-13',
        isRead: true,
        actionRequired: true
      }
    ]);
  };

  const refreshData = () => {
    loadMockData();
  };

  const approveRequest = async (id: string, comments?: string) => {
    setPendingApprovals(prev => 
      prev.map(approval => 
        approval.id === id 
          ? { ...approval, status: 'Approved' as const, reviewedDate: new Date().toISOString() }
          : approval
      )
    );
  };

  const rejectRequest = async (id: string, reason: string) => {
    setPendingApprovals(prev => 
      prev.map(approval => 
        approval.id === id 
          ? { 
              ...approval, 
              status: 'Rejected' as const, 
              rejectionReason: reason,
              reviewedDate: new Date().toISOString()
            }
          : approval
      )
    );
  };

  const markAlertAsRead = (id: string) => {
    setSystemAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
  };

  return (
    <AdminContext.Provider value={{
      adminUser,
      pendingApprovals,
      systemAlerts,
      financialSummary,
      refreshData,
      approveRequest,
      rejectRequest,
      markAlertAsRead
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};