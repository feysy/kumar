import React, { useEffect, useState } from 'react';
import { Container, Button, Paper, Grid, TextField, Snackbar, CircularProgress, SvgIcon, useRadioGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import wretch from 'wretch'
import Classic from "./machines/Classic"

const useStyles = makeStyles((theme) => ({
  // root: {
  //   display: 'flex',
  //   flexWrap: 'wrap',
  //   justifyContent: 'space-around',
  //   overflow: 'hidden',
  //   backgroundColor: theme.palette.background.paper,
  // },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },

  paper: {
    display: 'flex',
    justifyContent: 'center',
    height:'50%',
    width:'80%',
  }
}));

const machineMapping = {
  "not_found": CircularProgress,
  "bar": Classic
}

const get_machine_component = (name) => {
  if (!(name in machineMapping)) {
      return machineMapping["not_found"];
  }
  return machineMapping[name];
}

function Play() {
  const [machine, setMachine] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const machineId = urlParams.get('id');
    const token = localStorage.getItem("token");
    assignToMachine(machineId, token);
  },[]);

  const assignToMachine = (machineId, token) => {
    wretch(`api/machine/${machineId}/assign_machine`)
      .auth(`Bearer ${token}`)
      .get()
      .json((result) => {
        setMachine(result.machine);
        setUser(result.user);
        setLoading(false);
      })
  }

  let Machine = machineMapping["not_found"];
  if (machine){
    Machine = get_machine_component(machine.type)
  }

  return (
    loading ? <CircularProgress /> : 
        <Paper className={classes.paper}>
          <Machine machineId={machine.id} balance={user.balance}></Machine>
        </Paper>
  );
}

export default Play;