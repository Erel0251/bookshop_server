export interface RevenueDto {
  registered: number;
  account_admin: number;
  account_user: number;
  book: number;
  category: {
    total: number;
    published: number;
    unpublished: number;
  };
  order: number;
  expense: number;
  income: number;
}
