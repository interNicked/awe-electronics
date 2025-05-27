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
import {ProductGrid} from '@/lib/components/ProductGrid';
import {useSession} from 'next-auth/react';

export default function ProductsIndexPage() {
  const {products, productOptions, productCategories} = useProducts();
  const {data: session} = useSession();

  console.log({session});
  return (
    <>
      <Card>
        <CardHeader
          title="Products"
          action={
            <ButtonGroup variant="contained" color="secondary">
              <Tooltip title="Refresh" arrow>
                <Button>
                  <RefreshIcon />
                </Button>
              </Tooltip>
              {session?.user.role === 'admin' && (
                <Tooltip title="Add Product" arrow>
                  <Button LinkComponent={Link} href="/products/add">
                    <AddIcon />
                  </Button>
                </Tooltip>
              )}
            </ButtonGroup>
          }
        />
        <ProductGrid />
      </Card>
    </>
  );
}
