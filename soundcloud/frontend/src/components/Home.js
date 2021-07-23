import React, {useState, useEffect} from 'react';
import {
    List, 
    ListItem,
    ListItemText,
    Button,
    Typography,
    TextField,
    Avatar,
    AppBar,
    Toolbar,
    IconButton,
    Dialog,
    Slide,
    makeStyles,
    Grid,
} from '@material-ui/core/';

import AddCommentIcon from '@material-ui/icons/AddComment';

import Waveform from './Waveform';

const axios = require('axios');

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    commentBox: {
        marginTop: '10px',
        marginBottom: '10px',
        width: '90%',
    },
    listItem: {
        width: '60vw',
        wordWrap: 'break-word'
    }
}));

// https://material-ui.com/components/dialogs/#dialog
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});

function Home() {
    const [username, setUsername] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [content, setContent] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [comments, setComments] = useState([]);
    const [openCommentDialogue, setOpenCommentDialogue] = useState(false);

    const classes = useStyles();

    const handleCommentSubmit = () => {
        const commentInfo = {
            'username': username,
            'timestamp': timestamp,
            'content': content
        };

        axios.post('/api/post/', commentInfo)
            .then(() => {
                setContent('');
                setOpenCommentDialogue(false);
            });
    };

    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleTimestamp = (e) => {
        setTimestamp(e.target.value);
    };

    const handleContent = (e) => {
        setContent(e.target.value);
    };

   

    useEffect(() => {
        axios.get('/api/get')
            .then((res) => {
                // Populate the comments section
                const commentList = res.data.map((comment) => {
                    return(
                        <ListItem key={comment.id}>
                            <Avatar style={{marginRight:'20px'}}>
                                {comment.username[0].toUpperCase()}
                            </Avatar>
                            <ListItemText 
                                primary={
                                    <Typography noWrap>
                                        {comment.username} at {comment.timestamp}
                                    </Typography>  
                                    
                                }
                                secondary={
                                    <Typography className={classes.listItem}>
                                        {comment.content}
                                    </Typography>
                                } 
                            />
                            <ListItemText
                                style={{display:'flex', justifyContent:'flex-end'}}
                                primary={
                                    <Typography>
                                        {comment.date_created}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    )
                });
                setComments(commentList);
            });

        setButtonDisabled(username.length > 0 && timestamp.length > 0 && content.length > 0);
    }, [username, timestamp, content, comments]);
      

    return (
        <div>
            <AppBar position='fixed' style={{background: '#333'}}>
                <Toolbar>
                    <Typography>Soundcloud</Typography>
                    <Typography variant='h6' style={{flexGrow: 1}}>
                    </Typography>
                    <IconButton color='inherit' edge='end' onClick = {() => setOpenCommentDialogue(true)} >
                        <AddCommentIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div className={classes.toolbar} />
            <List style={{maxHeight: '50vh', minWidth: '100vw', overflow: 'auto'}}>
                {comments}
            </List>
            <Waveform/>
            <Dialog
                style={{zIndex: 2401}}
                fullWidth
                open={openCommentDialogue} onClose={() => {
                    setOpenCommentDialogue(false);
                }}
                TransitionComponent={Transition}>
                <Grid direction='column' container display='flex' alignItems='center'>
                    <div className={classes.commentBox}>
                        <div>
                            <TextField value={username}
                                inputProps={{ maxLength: 10 }}
                                label='Username'
                                required
                                fullWidth
                                onChange={(e) => {
                                    handleUsername(e);
                            }}
                            />
                        </div>
                        <div>
                            <TextField value={timestamp}
                                inputProps={{ maxLength: 5 }}
                                label='Timestamp'
                                required
                                fullWidth
                                onChange={(e) => {
                                    handleTimestamp(e);
                                }}
                            />
                        </div>
                        <div>
                            <TextField value={content}
                                inputProps={{ maxLength: 250 }}
                                label='Comment'
                                required
                                fullWidth
                                multiline
                                rows={5}
                                onChange={(e) => {
                                    handleContent(e);
                                }}
                            />
                        </div>
                        <div>
                            <Button onClick={handleCommentSubmit} 
                                disabled={!buttonDisabled}
                                variant='contained'
                                color='primary'
                                fullWidth
                            >
                                Submit Comment
                            </Button>
                        </div>
                    </div>
                </Grid>
            </Dialog>
        </div>
    );
}

export default Home;