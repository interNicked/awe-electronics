import {Shipment} from '@/lib/classes/Shipment';
import {getRelativeTimeString} from '@/pages/orders';
import ContentCopy from '@mui/icons-material/ContentCopy';
import {
  Card,
  CardContent,
  CardHeader,
  CardProps,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {useSnackbar} from 'notistack';

export function ShipmentCard({
  shipment,
  cardProps = {variant: 'outlined'},
}: {
  shipment: ReturnType<typeof Shipment.serialize>;
  cardProps?: CardProps;
}) {
  const {enqueueSnackbar} = useSnackbar();

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
        <TextField
          variant="filled"
          label="Shipped At"
          slotProps={{inputLabel: {disabled: false}}}
          disabled
          value={`${
            shipment.shippedAt
              ? getRelativeTimeString(shipment.shippedAt)
              : 'N/A'
          }`}
        />
        <TextField
          variant="filled"
          label="Tracking Number"
          slotProps={{
            inputLabel: {disabled: false},
            input: {
              endAdornment: (
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
          disabled
          value={`${shipment.trackingNumber ?? 'N/A'}`}
        />
        <TextField
          variant="filled"
          label="Carrier"
          slotProps={{inputLabel: {disabled: false}}}
          disabled
          value={`${shipment.carrier ?? 'N/A'}`}
        />
      </CardContent>
    </Card>
  );
}
