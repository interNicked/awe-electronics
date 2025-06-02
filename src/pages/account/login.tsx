import {Alert, Button, CardContent, CardHeader, TextField} from '@mui/material';
import {signIn} from 'next-auth/react';
import {useSnackbar} from 'notistack';
import {useEffect, useState} from 'react';
import {z} from 'zod';

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function CreateAccountPage() {
  const {enqueueSnackbar} = useSnackbar();

  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    const {email, password} = state;
    const {error} = Schema.safeParse({email, password});

    if (error) {
      error.issues.map(i =>
        enqueueSnackbar(`${i.path} : ${i.message}`, {variant: 'error'}),
      );
      return;
    }

    signIn('credentials', {
      email,
      password,
      callbackUrl: '/account',
    }).catch(() => setState({...state, password: ''}));
  };

  useEffect(() => {
    const url = new URL(window.location.toString());
    if (url.searchParams.has('error')) {
      setError(url.searchParams.get('error'));
    } else setError(null);
  }, []);

  return (
    <>
      <CardHeader title="Login with Credentials" />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          p: 0,
          mt: '2.5rem',
        }}
      >
        <TextField
          variant="filled"
          name="email"
          value={state.email}
          label="Email"
          onChange={e => setState({...state, email: e.target.value})}
          onSubmit={handleSubmit}
        />
        <TextField
          variant="filled"
          name="password"
          value={state.password}
          label="Password"
          type="password"
          onChange={e => setState({...state, password: e.target.value})}
          onSubmit={handleSubmit}
        />
      </CardContent>
      <CardContent sx={{px: 0}}>
        <Button variant="outlined" onClick={handleSubmit} fullWidth>
          Login
        </Button>
      </CardContent>
      <CardContent>
        {error && (
          <Alert severity="error">
            {error === 'CredentialsSignin' && 'Invalid Credentials'}
          </Alert>
        )}
      </CardContent>
    </>
  );
}

export default CreateAccountPage;
