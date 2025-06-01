import {Shipment} from '@/lib/classes/Shipment';
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
import {ShipmentStatus} from '@prisma/client';
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
  const [shipmentState, setShipmentState] = useState(shipment);

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar(`Copied ${field} to clipboard`, {
      variant: 'info',
      autoHideDuration: 800,
    });
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
                <Typography variant="overline">{shipment.status}</Typography>
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
                setShipmentState({...shipmentState, status: e.target.value});
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
            setShipmentState({
              ...shipmentState,
              trackingNumber: e.target.value,
            });
          }}
          value={`${shipmentState.trackingNumber ?? 'N/A'}`}
        />
        <TextField
          variant="filled"
          label="Carrier"
          slotProps={{inputLabel: {disabled: false}}}
          disabled={!editable}
          onChange={e => {
            if (!editable) return;
            setShipmentState({...shipmentState, carrier: e.target.value});
          }}
          value={`${shipmentState.carrier ?? 'N/A'}`}
        />
      </CardContent>
      {editable && (
        <Button variant="outlined" sx={{m: '1rem', width: 'calc(100% - 2rem)'}}>
          Save
        </Button>
      )}
    </Card>
  );
}
