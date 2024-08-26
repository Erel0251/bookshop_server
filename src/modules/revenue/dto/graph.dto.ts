export class GraphData {
  expenses: number[];
  incomes: number[];
  labels: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  constructor(expenses: number[], incomes: number[]) {
    this.expenses = expenses;
    this.incomes = incomes;
  }
}
