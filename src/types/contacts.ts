export type InquiryStatus = "UNREAD" | "READ" | "RESOLVED";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
};
