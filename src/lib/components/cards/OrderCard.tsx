import {Order} from '@/lib/classes/Order';
import {AddressTable} from '@/lib/components/AddressTable';
import CartCard from '@/lib/components/cards/CartCard';
import OrderSchema from '@/lib/schemas/OrderSchema';
import {
  Button,
  Card,
  CardHeader,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {OrderStatus} from '@prisma/client';
import Link from 'next/link';
import {useSnackbar} from 'notistack';
import {useState} from 'react';
import {ShipmentCard} from './ShipmentCard';
import z from 'zod';

import {Shipment} from '@/lib/classes/Shipment';
import ArrowRightIcon from '@mui/icons-material/ArrowForward';
import ContentCopy from '@mui/icons-material/ContentCopy';
import RelativeTime from '../RelativeTime';

const PostSchema = OrderSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid().optional(),
  status: z.nativeEnum(OrderStatus),
  billingAddressId: z.string().uuid(),
  deliveryAddressId: z.string().uuid(),
});

export default function OrderCard({
  order,
  shipment,
  editable = false,
}: {
  order: ReturnType<typeof Order.serialize>;
  shipment: ReturnType<typeof Shipment.serialize>;
  editable?: boolean;
}) {
  const [_orderState, setOrderState] = useState(order);
  const [orderEditState, setOrderEditState] = useState(
    replaceNullsWithEmptyStrings(order),
  );
  const {enqueueSnackbar} = useSnackbar();

  const orderState = editable ? orderEditState : _orderState;

  const OrderStatusChip = () => (
    <Chip
      color={order.status === 'paid' ? 'success' : 'default'}
      label={<Typography variant="overline">{_orderState.status}</Typography>}
    />
  );

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar(`Copied ${field} to clipboard`, {
      variant: 'info',
      autoHideDuration: 800,
    });
  };

  const validateAndSave = async () => {
    const {data, error} = PostSchema.safeParse(orderState);
    if (error) {
      error.issues.map(i => {
        enqueueSnackbar(`${i.path} - ${i.message}`, {variant: 'error'});
      });
    } else {
      const res = await fetch(`/api/orders/${data.id}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const s = await res.json();
        setOrderState({
          ...s,
          updatedAt: new Date(s.updatedAt),
          createdAt: new Date(s.createdAt),
        });
      }
    }
  };

  return (
    <Card sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <CardHeader
        title={`Order: ${order.id}`}
        subheader={
          <RelativeTime
            date={new Date(_orderState.updatedAt)}
            prefix="Last Updated: "
          />
        }
        action={
          <>
            <OrderStatusChip />
            <IconButton onClick={() => handleCopy('Order Id', order.id)}>
              <ContentCopy />
            </IconButton>
          </>
        }
      />
      {editable && (
        <FormControl>
          <InputLabel htmlFor="status-select">Status</InputLabel>
          <Select
            label="Status"
            id="stauts-select"
            value={orderState.status}
            onChange={e => {
              setOrderEditState({
                ...orderState,
                status: e.target.value,
              });
            }}
          >
            {Object.keys(OrderStatus).map(s => {
              return (
                <MenuItem value={s}>
                  {s.replaceAll('_', ' ').toLocaleUpperCase()}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
      {editable && (
        <Button variant="outlined" onClick={validateAndSave} fullWidth>
          Save
        </Button>
      )}
      <CartCard
        cardProps={{sx: {p: 0}, variant: 'outlined'}}
        editable={false}
        cart={{
          id: order.id,
          items: order.items.map(i => {
            return {...i, cartId: order.id};
          }),
        }}
      />
      <Card variant="outlined">
        <AddressTable
          addresses={order.addresses.map((a, i) => {
            return {
              ...a,
              type: i === 0 ? 'BillingAddress' : 'DeliveryAddress',
            };
          })}
        />
      </Card>
      {editable ? (
        <Card variant="outlined">
          <CardHeader
            title={`Shipment: ${shipment.id}`}
            subheader={<RelativeTime date={new Date(shipment.updatedAt)} />}
            action={
              <>
                <Chip
                  label={
                    <Typography variant="overline">
                      {shipment.status}
                    </Typography>
                  }
                />
                <IconButton
                  href={`/manage/shipments/${shipment.id}`}
                  LinkComponent={Link}
                >
                  <ArrowRightIcon />
                </IconButton>
              </>
            }
          />
        </Card>
      ) : (
        <ShipmentCard shipment={shipment} />
      )}
    </Card>
  );
}

function replaceNullsWithEmptyStrings<T>(input: T): T {
  if (input === null) return '' as unknown as T;

  if (Array.isArray(input)) {
    return input.map(item =>
      replaceNullsWithEmptyStrings(item),
    ) as unknown as T;
  }

  if (typeof input === 'object' && input !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};
    for (const [key, value] of Object.entries(input)) {
      result[key] = replaceNullsWithEmptyStrings(value);
    }
    return result;
  }

  return input;
}
