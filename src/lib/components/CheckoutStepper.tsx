import AddressForm from '@/lib/components/AddressForm';
import CartCard from '@/lib/components/cards/CartCard';
import {
  Alert,
  Fab,
  IconButton,
  Skeleton,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from '@mui/material';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import OrderConfirmCard from './cards/OrderConfirmCard';

import AddCardIcon from '@mui/icons-material/AddCard';
import ArrowRightIcon from '@mui/icons-material/ArrowForward';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ColorlibConnector = styled(StepConnector)(({theme}) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: {completed?: boolean; active?: boolean};
}>(({theme}) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ownerState}) => ownerState.active,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      },
    },
    {
      props: ({ownerState}) => ownerState.completed,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      },
    },
  ],
}));

const steps = [
  {label: 'Cart', card: CartCard},
  {label: 'Address', card: AddressForm},
  {
    label: 'Payment',
    card: () => (
      <>
        <Alert severity="warning" sx={{mt: '1rem'}}>
          Payments Not Yet Implemented
        </Alert>
        <Skeleton
          height="3rem"
          width="100%"
          variant="rounded"
          sx={{mt: '1rem'}}
        />
        <Skeleton
          height="3rem"
          width="100%"
          variant="rounded"
          sx={{mt: '1rem'}}
        />
        <Skeleton
          height="3rem"
          width="100%"
          variant="rounded"
          sx={{mt: '1rem', mb: '1rem'}}
        />
      </>
    ),
  },
  {label: 'Confirm', card: OrderConfirmCard},
];

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const Card = steps[activeStep].card;

  const handleSetStep = (n: number) => {
    router.push({
      pathname: router.pathname,
      query: {...router.query, step: n},
    });
    setActiveStep(n);
  };

  const ColorlibStepIcon = (props: StepIconProps) => {
    const {active, completed, className} = props;

    const icons: {[index: string]: React.ReactElement<unknown>} = {
      1: <ShoppingCartIcon />,
      2: <LocalPostOfficeIcon />,
      3: <AddCardIcon />,
      4: <VisibilityIcon />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{completed, active}}
        className={className}
      >
        <IconButton onClick={() => handleSetStep(Number(props.icon) - 1)}>
          {icons[String(props.icon)]}
        </IconButton>
      </ColorlibStepIconRoot>
    );
  };

  const router = useRouter();
  const {query} = router;

  useEffect(() => {
    const n = Number(query.step);
    if (query.step && Number.isInteger(n)) setActiveStep(n);
  }, [query.step]);

  return (
    <>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map(step => {
          const {label} = step;
          return (
            <Step key={label}>
              <StepLabel
                slots={{stepIcon: ColorlibStepIcon}}
                slotProps={{label: {sx: {mt: '0 !important'}}}}
              >
                <Typography variant="overline">{label}</Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Card />
      <Fab
        sx={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          color: 'white',
          fontWeight: 'bold',
          backgroundImage:
            'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        }}
        disabled={activeStep === steps.length - 1}
        onClick={() => handleSetStep(activeStep + 1)}
      >
        <ArrowRightIcon />
      </Fab>
    </>
  );
}
