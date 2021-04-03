import React, { useEffect, useState } from 'react';
import { Container, Button, Paper, Grid, TextField, Snackbar, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import wretch from 'wretch'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';

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
  }
}));

function Machines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    getMachines();
  },[]);

  const getMachines = () => {
    wretch("api/machine")
      .get()
      .json((result) => {
        setMachines(result);
        setLoading(false);
      })
  }

  return (
    loading ? <CircularProgress /> : 
      <Container maxWidth="sm">
        <Paper className={classes.paper}>
          <GridList cellHeight={180} className={classes.gridList} cols={4} spacing={0}>
            <GridListTile key="Subheader" cols={4} style={{ height: '180' }}>
              <ListSubheader component="div">Makineler</ListSubheader>
            </GridListTile>
            {machines.map((machine) => (
              <GridListTile key={machine.id}  cols={1}>
                <img src={'static/machine_img/' + machine.type + '.jpg'} alt={machine.name} />
                <GridListTileBar
                  title={machine.name}
                  subtitle={<span>{machine.assigned_user}</span>}
                  actionIcon={
                    <IconButton aria-label={`info about ${machine.name}`} className={classes.icon}>
                      HELLO
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </Paper>
      </Container>
  );
}

export default Machines;