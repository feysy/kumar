import React, { useState } from 'react';
import { Container, Button, Paper, Grid, TextField, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import wretch from 'wretch'
import {
   useHistory
 } from "react-router-dom";

function Login() {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [loginError, setLoginError] = useState(null);
   const history = useHistory();
 
   const login = () => {
     wretch("api/token").formData({
       username,
       password
     })
       .post()
       .json((result) => {
         localStorage.setItem('token', result.access_token);
         history.replace({pathname:'/machines'});
       })
       .catch((error) => setLoginError(JSON.parse(error.text).detail));
   }

   return(
      <Container maxWidth="xs" justify="">
      <Paper elevation={3}>
        <Snackbar open={loginError != null} autoHideDuration={6000} onClose={() => setLoginError(null)}>
          <Alert onClose={() => setLoginError(null)} severity="error">
            Kullanıcı adı veya şifre yanlış!
          </Alert>
        </Snackbar>
        <Grid
          spacing={2}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={3}/>
          <Grid item xs={6}>
            <TextField
              required
              id="filled-required"
              label="Kulanıcı Adı"
              defaultValue=""
              variant="filled"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}/>
          <Grid item xs={3}/>
          <Grid item xs={6}>
            <TextField
              id="filled-password-input"
              label="Şifre"
              type="password"
              autoComplete="current-password"
              variant="filled"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}/>
          <Grid item xs={6}/>
          <Grid item xs={3}>
            <Button variant="contained" color="primary" onClick={() => login()}>
              Giriş
            </Button>
          </Grid>
          <Grid item xs={3}/>
        </Grid>
      </Paper>
    </Container>
   );
}

export default Login;