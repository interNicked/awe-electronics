export class ReportManager {
  static salesCSV(orders: {id: string; total: number}[]) {
    return (
      'order_id,total\n' + orders.map(o => `${o.id},${o.total}`).join('\n')
    );
  }
}
