import {Table, TableBody, TableRow, TableCell} from '@mui/material';
import {Order} from '../classes/Order';

export function AddressTable({
  addresses,
}: {
  addresses: ReturnType<typeof Order.serialize>['addresses'];
}) {
  return (
    <Table>
      <TableBody>
        {addresses.map(a => (
          <TableRow key={a.type}>
            <TableCell sx={{fontWeight: 'bold'}}>
              {a.type === 'BillingAddress' ? 'Billing' : 'Delivery'} Address
            </TableCell>
            <TableCell>{a.fullName}</TableCell>
            <TableCell>
              {a.addressLine1}
              {a.addressLine2 && (
                <>
                  <br /> {a.addressLine2}
                </>
              )}
              , {a.city}, {a.state}, {a.country}, {a.postcode}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default AddressTable;
