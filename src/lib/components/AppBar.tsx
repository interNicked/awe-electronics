import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import {Badge} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {signIn, signOut, useSession} from 'next-auth/react';
import Link from 'next/link';
import * as React from 'react';
import {useCart} from './hooks/useCart';

const pages = ['Products', 'Cart'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const {state} = useCart();
  const {data: session} = useSession();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {xs: 'none', md: 'flex'},
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            AWE
          </Typography>

          <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{display: {xs: 'block', md: 'none'}}}
            >
              {pages.map(page =>
                page === 'Cart' ? (
                  <Link key={page} href={`/${page.toLowerCase()}`}>
                    <MenuItem
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{width: '100%'}}
                    >
                      <Badge
                        badgeContent={state.items.reduce(
                          (pv, cv) => (pv += cv.quantity),
                          0,
                        )}
                        color="primary"
                      >
                        <Typography sx={{textAlign: 'center', pr: '0.5rem'}}>
                          {page}
                        </Typography>
                      </Badge>
                    </MenuItem>
                  </Link>
                ) : (
                  <Link key={page} href={`/${page.toLowerCase()}`}>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography sx={{textAlign: 'center'}}>{page}</Typography>
                    </MenuItem>
                  </Link>
                ),
              )}
            </Menu>
          </Box>
          <AdbIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {xs: 'flex', md: 'none'},
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            AWE
          </Typography>
          <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {pages.map(page =>
              page === 'Cart' ? (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  href={`/${page.toLowerCase()}`}
                  LinkComponent={Link}
                  sx={{py: 2, color: 'white', display: 'block'}}
                >
                  <Badge
                    badgeContent={state.items.reduce(
                      (pv, cv) => (pv += cv.quantity),
                      0,
                    )}
                    color="primary"
                    sx={{px: '0.5rem'}}
                  >
                    {page}
                  </Badge>
                </Button>
              ) : (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  href={`/${page.toLowerCase()}`}
                  LinkComponent={Link}
                  sx={{py: 2, color: 'white', display: 'block'}}
                >
                  {page}
                </Button>
              ),
            )}
          </Box>
          <Box sx={{flexGrow: 0}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                <Avatar alt={session?.user.email} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{mt: '45px'}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {session?.user.role === 'admin' && (
                <Link href="/manage">
                  <MenuItem>
                    <Typography sx={{textAlign: 'center'}}>Manage</Typography>
                  </MenuItem>
                </Link>
              )}
              {session?.user && (
                <Link href="/account">
                  <MenuItem>
                    <Typography sx={{textAlign: 'center'}}>Account</Typography>
                  </MenuItem>
                </Link>
              )}
              {session?.user && (
                <Link href="/orders">
                  <MenuItem>
                    <Typography sx={{textAlign: 'center'}}>Orders</Typography>
                  </MenuItem>
                </Link>
              )}
              <MenuItem
                onClick={session?.user ? () => signOut() : () => signIn()}
              >
                <Typography sx={{textAlign: 'center'}}>
                  {session?.user ? 'Logout' : 'Login'}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
