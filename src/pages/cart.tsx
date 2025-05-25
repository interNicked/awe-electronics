import {useCart} from '@/lib/components/hooks/useCart';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Link as MLink,
} from '@mui/material';
import {DataGrid, GridCell} from '@mui/x-data-grid';
import Link from 'next/link';

export function CartPage() {
  const {state} = useCart();

  return (
    <>
      <Card>
        <CardHeader title="Cart" subheader={`Cart ID: ${state.id}`} />
        <CardContent>
          <DataGrid
            rows={state.items}
            columns={[
              {
                field: 'Product',
                flex: 1,
                renderCell: params => {
                  return (
                    <>
                      <MLink
                        component={Link}
                        sx={{mt: '15%'}}
                        href={`/products/${params.row.productId}${params.row.productOptionId ? `?option=${params.row.productOptionId}` : ''}`}
                      >
                        <Typography>{params.row.title}</Typography>
                      </MLink>
                    </>
                  );
                },
              },
              {
                field: 'quantity',
                headerName: 'Qty',
              },
              {
                field: 'Cost',
                renderCell: params => (
                  <>
                    <Typography sx={{mt: '15%'}}>
                      $
                      {(params.row.extraPrice
                        ? params.row.basePrice + params.row.extraPrice
                        : params.row.basePrice
                      ).toFixed(2)}
                    </Typography>
                  </>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}

export default CartPage;
