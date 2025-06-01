import {Shipment} from '@/lib/classes/Shipment';
import {ShipmentSchema} from '@/lib/schemas/Shipment';
import {getRelativeTimeString} from '@/pages/orders';
import ContentCopy from '@mui/icons-material/ContentCopy';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardProps,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {DateTimePicker} from '@mui/x-date-pickers';
import {ShipmentStatus} from '@prisma/client';
import dayjs from 'dayjs';
import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import {useState} from 'react';

export function ShipmentCard({
  shipment,
  editable = false,
  cardProps = {variant: 'outlined'},
}: {
  shipment: ReturnType<typeof Shipment.serialize>;
  editable?: boolean;
  cardProps?: CardProps;
}) {
  const {enqueueSnackbar} = useSnackbar();
  const [_shipmentState, setShipmentState] = useState(shipment);
  const [shipmentEditState, setShipmentEditState] = useState(
    replaceNullsWithEmptyStrings(shipment),
  );
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const shipmentState = editable ? shipmentEditState : _shipmentState;

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar(`Copied ${field} to clipboard`, {
      variant: 'info',
      autoHideDuration: 800,
    });
  };

  const validateAndSave = async () => {
    const {success, error, data} = await ShipmentSchema.safeParseAsync({
      ...shipmentEditState,
      ...(shipment.status === 'preparing' &&
      shipmentEditState.status === 'in_transit'
        ? {
            shippedAt: dayjs().valueOf(),
          }
        : {}),
    });
    if (success) {
      console.log({data});
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const {shippedAt, status} = await res.json();
        setShipmentEditState({
          ...shipmentState,
          shippedAt: new Date(shippedAt).valueOf(),
          status,
          createdAt: shipment.createdAt,
          updatedAt: shipment.updatedAt,
        });
        enqueueSnackbar('Saved!', {variant: 'success'});
      }
    }
    setErrors(
      error?.issues.flatMap(i => {
        enqueueSnackbar(
          `${i.path.toLocaleString().toLocaleUpperCase()} - ${i.message}`,
          {variant: 'error'},
        );
        return i.path.toString();
      }) ?? [],
    );
  };

  return (
    <Card {...cardProps}>
      <CardHeader
        title={`Shipment: ${shipment.id}`}
        subheader={`Last Updated: ${getRelativeTimeString(shipment.updatedAt)}`}
        action={
          <>
            <Chip
              label={
                <Typography variant="overline">
                  {shipmentState.status.replaceAll('_', ' ')}
                </Typography>
              }
            />
            <IconButton onClick={() => handleCopy('Shipment Id', shipment.id)}>
              <ContentCopy />
            </IconButton>
          </>
        }
      />
      <CardContent sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        {editable && (
          <FormControl>
            <InputLabel htmlFor="status-select">Status</InputLabel>
            <Select
              label="Status"
              id="stauts-select"
              value={shipmentState.status}
              onChange={e => {
                setShipmentEditState({
                  ...shipmentState,
                  status: e.target.value,
                });
              }}
            >
              {Object.keys(ShipmentStatus).map(s => {
                return (
                  <MenuItem value={s}>
                    {s.replaceAll('_', ' ').toLocaleUpperCase()}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
        <TextField
          variant="filled"
          label="Shipped At"
          slotProps={{inputLabel: {disabled: false}}}
          error={errors.includes('shippedAt')}
          disabled
          value={`${
            shipmentState.shippedAt
              ? getRelativeTimeString(shipmentState.shippedAt)
              : 'N/A'
          }`}
        />
        <TextField
          variant="filled"
          label="Tracking Number"
          error={errors.includes('trackingNumber')}
          helperText={'Must be 10 digits long'}
          slotProps={{
            inputLabel: {disabled: false},
            input: {
              endAdornment: !editable && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      handleCopy(
                        'Tracking Number',
                        `${shipment.trackingNumber ?? 'N/A'}`,
                      )
                    }
                  >
                    <ContentCopy />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          disabled={!editable}
          onChange={e => {
            if (!editable) return;
            setShipmentEditState({
              ...shipmentState,
              trackingNumber: e.target.value,
            });
          }}
          value={`${shipmentState.trackingNumber ?? 'N/A'}`}
        />
        <TextField
          variant="filled"
          label="Carrier"
          error={errors.includes('carrier')}
          helperText={'Must be 5 digits long'}
          slotProps={{inputLabel: {disabled: false}}}
          disabled={!editable}
          onChange={e => {
            if (!editable) return;
            setShipmentEditState({...shipmentState, carrier: e.target.value});
          }}
          value={`${shipmentState.carrier ?? 'N/A'}`}
        />
        {editable && (
          <DateTimePicker
            label="ETA"
            minDate={dayjs()}
            value={dayjs(shipmentState.eta)}
            onChange={v => {
              if (!editable || !v) return;
              setShipmentEditState({...shipmentState, eta: v.valueOf()});
            }}
            sx={{mt: '1rem'}}
          />
        )}
      </CardContent>
      {editable && (
        <Button
          variant="outlined"
          onClick={validateAndSave}
          sx={{m: '1rem', width: 'calc(100% - 2rem)'}}
        >
          Save
        </Button>
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
    const result: any = {};
    for (const [key, value] of Object.entries(input)) {
      result[key] = replaceNullsWithEmptyStrings(value);
    }
    return result;
  }

  return input;
}
