import {useUsers} from '@/lib/components/hooks/useUsers';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link as MLink,
  ButtonGroup,
  Button,
  Tooltip,
} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid/DataGrid';
import useProducts from '@/lib/components/hooks/useProducts';
import Link from 'next/link';

import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function ProductsIndexPage() {
  const {products, productOptions, productCategories} = useProducts();

  return (
    <>
      <Card>
        <CardHeader title="Products" action={<ButtonGroup variant='contained' color='secondary'>
          <Tooltip title="Refresh" arrow><Button><RefreshIcon /></Button></Tooltip>
          <Tooltip title="Add Product" arrow><Button LinkComponent={Link} href="/products/add"><AddIcon /></Button></Tooltip>
        </ButtonGroup>}/>
        <CardContent>
          <DataGrid
            rows={products}
            columns={[
              {
                field: 'title',
                flex: 2,
                renderCell(params) {
                  return (
                    <MLink
                      component={Link}
                      href={`/products/${params.row.id}`}
                      sx={{mt: '20%'}}
                    >
                      <Typography>{params.row.title}</Typography>
                    </MLink>
                  );
                },
              },
              {
                field: 'status',
                headerName: 'Available',
                renderCell: params => (
                  <Avatar
                    sx={{
                      height: '1.5rem',
                      width: '1.5rem',
                      margin: 'auto',
                      mt: '17.5%',
                      bgcolor: params.row.status === 'available' ? 'green' : 'red',
                    }}
                  >
                    {params.row.status === 'available' ? (
                      <CheckIcon fontSize="small" />
                    ) : (
                      <CancelIcon fontSize="small" />
                    )}
                  </Avatar>
                ),
              },
              {field: 'createdAt', flex: 1},
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}
