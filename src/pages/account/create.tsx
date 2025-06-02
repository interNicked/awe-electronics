import {Button, CardContent, CardHeader, TextField} from '@mui/material';
import {signIn} from 'next-auth/react';
import {useSnackbar} from 'notistack';
import {useState} from 'react';
import {z} from 'zod';

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function CreateAccountPage() {
  const {enqueueSnackbar} = useSnackbar();

  const [state, setState] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async () => {
    const {email, password, confirmPassword} = state;
    const {error} = Schema.safeParse({email, password});

    if (password !== confirmPassword) {
      enqueueSnackbar('Passwords Must Match!', {variant: 'error'});
      return;
    }

    if (error) {
      error.issues.map(i =>
        enqueueSnackbar(`${i.path} : ${i.message}`, {variant: 'error'}),
      );
      return;
    }
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(state),
    });

    if (res.ok) {
      enqueueSnackbar('Success! You can now login!', {
        variant: 'success',
        autoHideDuration: 4000,
      });
      signIn();
    }
  };

  return (
    <>
      <CardHeader title="Create an Account" />
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
        <TextField
          variant="filled"
          name="confirm password"
          value={state.confirmPassword}
          label="Confirm Password"
          type="password"
          onChange={e => setState({...state, confirmPassword: e.target.value})}
          onSubmit={handleSubmit}
        />
      </CardContent>
      <CardContent>
        <Button onClick={handleSubmit}>Register</Button>
      </CardContent>
    </>
  );
}

export default CreateAccountPage;
