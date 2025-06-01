import {ProductGrid} from '@/lib/components/ProductGrid';
import {Button, ButtonGroup, Card, CardHeader, Tooltip} from '@mui/material';
import {useSession} from 'next-auth/react';
import Link from 'next/link';

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function ProductsIndexPage() {
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
              {session?.user?.role === 'admin' && (
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
