import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {ProductOption} from '@prisma/client';
import {JSX} from 'react';

export function ProductOptionsCard({
  options,
  actions: Actions = () => <></>,
}: {
  options: ProductOption[];
  actions?: ({a}: {a: ProductOption}) => JSX.Element;
}) {
  const attributes = Object.groupBy(options, o => o.attribute);
  const keys = Object.keys(attributes);

  return (
    <>
      {keys.length > 0 ? (
        keys.map(a => {
          const attribute = attributes[a];
          return (
            <Card key={`attr-${a}`} variant="outlined">
              <CardHeader title={`Option: ${a}`} />
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{fontWeight: 'bold'}}>Value</TableCell>
                      <TableCell sx={{fontWeight: 'bold'}}>Stock</TableCell>
                      <TableCell sx={{fontWeight: 'bold'}}>
                        Extra Cost
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attribute
                      ?.sort((a, b) => {
                        if (a.stock > b.stock) {
                          return -1;
                        } else if (a.stock < b.stock) {
                          return 1;
                        } else return 0;
                      })
                      .map(a => {
                        return (
                          <TableRow key={`attr-${a.id}`}>
                            <TableCell>
                              <Tooltip title={`SKU: ${a.sku}`} arrow>
                                <Typography sx={{width: 'fit-content'}}>
                                  {a.value}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>{a.stock}</TableCell>
                            <TableCell>
                              {a.extra > 0 ? '+' : '-'} $
                              {Number(a.extra).toFixed(2)}
                            </TableCell>

                            <TableCell align="right">
                              <Actions a={a} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Card variant="outlined">
          <CardHeader subheader="No Options" />
        </Card>
      )}
    </>
  );
}

export default ProductOptionsCard;
