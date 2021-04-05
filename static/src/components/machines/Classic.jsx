import React, { useEffect, useState } from 'react';
import { Container, Button, Paper, Grid, TextField, IconButton, CircularProgress, SvgIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import get_svg_component from '../../SvgIconSet';
import wretch from 'wretch'
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    root: {
        width: "100%",
        paddingTop: '56.25%',
        background: 'linear-gradient(135deg, rgba(252,176,69,1) 0%, rgba(253,29,29,1) 62%, rgba(131,58,180,1) 100%)',
        position: 'relative'
    },
    content: {
        position: 'absolute',
        background: 'rgb(252,176,69)',
        background: 'linear-gradient(315deg, rgba(252,176,69,1) 0%, rgba(253,29,29,1) 62%, rgba(131,58,180,1) 100%)',
        top: '1%',
        left: '1%',
        bottom: '1%',
        right: '1%',
    },
    bar: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        backgroundColor: '#00FF00',
        height: '65%',
        width: '25%',
        overflow: 'hidden',
        background: 'rgb(213,209,197)',
        background: 'linear-gradient(0deg, rgba(172,168,157,1) 0%, rgba(255,254,245,1) 50%, rgba(150,141,120,1) 100%)',
        borderWidth: 3,
        borderStyle:'solid',
        borderBottomColor:'#ddd',
        borderRightColor:'#ddd',
        borderTopColor:'#aaa',
        borderLeftColor:'#aaa',
        borderRadius:'5',
        WebkitBorderRadius:'5',
    },
    firstBar: {
        top: '10%',
        left: '10%',
    },
    secondBar: {
        top: '10%',
        left: '37.5%',
    },
    thirdBar: {
        top: '10%',
        left: '65%',
    },
    icon: {
        borderTopWidth: 1,
        borderTopColor: '#999999',
        borderTopStyle: 'solid',
        position: 'relative',
        top: "-75%",
        width: '100%',
        height: '50%',
        paddingTop: '2%',
        paddingBottom: '2%',
        animationName: 'end',
        animationDuration: '0.5s',
        animationIterationCount: 1
    },
    iconRoll: {
        filter: 'url(#blur)',
        animationName: 'roll',
        animationDuration: '0.5s',
        animationIterationCount: 'infinite'
    },
    animationDelayOne: {
        animationDelay: '0.25s'
    },
    animationDelayTwo: {
        animationDelay: '0.4s'
    },
    animationDurationOne: {
        animationDuration: '0.5s'
    },
    animationDurationTwo: {
        animationDuration: '1s'
    },
    betLabel: {
        position: 'absolute',
        top: '83%',
        left: '10%',
        width: '16%',
        backgroundColor: '#330000'
    },
    balanceLabel: {
        position: 'absolute',
        backgroundColor: '#330000',
        top: '83%',
        left: '45%',
        width: '20%',
    },
    rewardLabel: {
        position: 'absolute',
        color: '#009900',
        top: '90%',
        left: '45%',
        width: '20%',
        fontSize: '1.5vw',
        textAlign: 'right',
    },
    playButton: {
        position: 'absolute',
        backgroundColor: 'red',
        top: '80%',
        left: '70%',
        width: '20%',
        height: '10%',
    },
    decreaseBetButton: {
        position: 'absolute',
        backgroundColor: 'red',
        top: '83%',
        left: '32%',
        width: '5%',
        height: '6%',
    },
    increaseBetButton: {
        position: 'absolute',
        backgroundColor: 'red',
        top: '83%',
        left: '27%',
        width: '5%',
        height: '6%',
    },
    fontSpecs: {
        fontSize: '2vw',
        color: 'red',
        textAlign: 'right',
    },
    fontSpecsButton: {
        fontSize: '2vw',
        color: 'white',
        textAlign: 'right',
    },
    exitIcon: {
        width: '5%',
        height: '5%',
        color: 'rgba(255, 255, 255, 0.54)',
    },
});

const availableElements = [
    "bar",
    "bell",
    "cherry",
    "orange",
    "plum",
    "seven"
];

function getRndElement() {
    const index = Math.floor(Math.random() * (availableElements.length));
    return availableElements[index];
}

const colCount = 5;
const rowCount = 3;

const getRandomElements = () => {
    const elements = [];
    for (let i = 0; i < rowCount; i++) {
        const col = [];
        for (let j = 0; j < colCount; j++) {
            col.push(getRndElement());
        }
        elements.push(col);
    }
    return elements;
};

const token = localStorage.getItem("token");

function Classic(props) {
    const [loading, setLoading] = useState(false);
    const styles = useStyles();
    const [elements, setElements] = useState(getRandomElements())
    const [balance, setBalance] = useState(props.balance)
    const [bet, setBet] = useState(1)
    const [reward, setReward] = useState(null)
    const [audioIndex, setAudioIndex] = useState(1)
    const history = useHistory();
    

    useEffect(() => {
        setTimeout(() => {
            if (reward % 2 === 0) {
                setAudioIndex(audioIndex => ((audioIndex + 1) % 9) + 1);
                console.log(`coin${audioIndex}`);
                document.getElementById(`coin${audioIndex}`).play();
            }
            if (reward > 0) {
                setBalance(prev => prev + 1)
                if (reward === 1)
                    setReward(null)
                else
                    setReward(prev => prev - 1)
            }
        }, 100)

    }, [reward]);

    const goBack = () => {
        history.replace({pathname:`/machines`});
    }

    const play = () => {
        setBalance(balance - bet)
        let final_balance = 0;
        let finishLoading = 2;
        let total_reward = 0;
        setLoading(true);
        setElements(getRandomElements());
        setTimeout(() => {
            if (--finishLoading === 0) {
                setLoading(false);
                //setBalance(final_balance)
                setReward(total_reward)
            }
        }, 2000)
        wretch(`api/machine/${props.machineId}/play`)
            .json({
                "lines": [
                    "0"
                ],
                "bet": bet
            })
            .auth(`Bearer ${token}`)
            .post()
            .json((result) => {
                const newElements = getRandomElements();
                for (let i = 0; i < result.elements[0].length; i++)
                    newElements[i][2] = result.elements[0][i];
                setElements(newElements)
                final_balance = result.final_balance;
                total_reward = null;
                if (result.total_reward > 0)
                    total_reward = result.total_reward;
                if (--finishLoading === 0) {
                    setLoading(false);
                    // setBalance(final_balance)
                    setReward(total_reward)
                }
            })
    }

    const inscreaseBet = () => {
        document.getElementById(`coin1`).play();
        setBet(bet => bet + 1)
    }

    let firstBarIconsStyle = `${styles.icon}`
    let secondBarIconsStyle = `${styles.icon} ${styles.animationDurationOne}`
    let thirdBarIconsStyle = `${styles.icon} ${styles.animationDurationTwo}`
    if (loading) {
        firstBarIconsStyle = `${styles.icon} ${styles.iconRoll}`
        secondBarIconsStyle = `${styles.icon} ${styles.iconRoll} ${styles.animationDelayOne}`
        thirdBarIconsStyle = `${styles.icon} ${styles.iconRoll} ${styles.animationDelayTwo}`
    }
    return (
        <div className={styles.root}>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="blur">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="0,50" />
                    </filter>
                </defs>
            </svg>

            <div className={styles.content}>                    
                <IconButton aria-label={`Go Back`} className={styles.exitIcon} onClick={() => goBack()}>
                      <SvgIcon component={get_svg_component("stop")} viewBox="0 0 256 256"></SvgIcon>
                    </IconButton>
                <div className={styles.bar + ' ' + styles.firstBar}>
                    {
                        elements[0].map(element =>
                            <SvgIcon className={firstBarIconsStyle} component={get_svg_component(element)} viewBox="0 0 256 256"></SvgIcon>
                        )
                    }
                </div>
                <div className={styles.bar + ' ' + styles.secondBar}>
                    {
                        elements[1].map(element =>
                            <SvgIcon className={secondBarIconsStyle} component={get_svg_component(element)} viewBox="0 0 256 256"></SvgIcon>
                        )
                    }
                </div>
                <div className={styles.bar + ' ' + styles.thirdBar}>
                    {
                        elements[2].map(element =>
                            <SvgIcon className={thirdBarIconsStyle} component={get_svg_component(element)} viewBox="0 0 256 256"></SvgIcon>
                        )
                    }
                </div>
                <TextField InputProps={{ "classes": { 'input': styles.fontSpecs } }} className={styles.betLabel} value={bet}></TextField>
                <Button className={styles.increaseBetButton + ' ' + styles.fontSpecsButton} variant="contained" color="primary" onClick={() => inscreaseBet()}>
                    +
                </Button>
                <Button className={styles.decreaseBetButton + ' ' + styles.fontSpecsButton} variant="contained" color="primary" onClick={() => setBet(bet - 1)}>
                    -
                </Button>
                <TextField InputProps={{ "classes": { 'input': styles.fontSpecs } }} className={styles.balanceLabel} value={balance}></TextField>
                <div className={styles.rewardLabel}>{reward}</div>
                <Button className={styles.playButton + ' ' + styles.fontSpecsButton} variant="contained" color="primary" onClick={() => play()}>
                    Play
                </Button>
            </div>
        </div>
    )
}

export default Classic;