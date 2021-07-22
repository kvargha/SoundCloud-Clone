import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const axios = require('axios');

function Home() {
    const [username, setUsername] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [content, setContent] = useState('');

    const handleCommentSubmit = () => {
        const commentInfo = {
            'username': username,
            'timestamp': timestamp,
            'content': content
        };

        axios.post('/api/post/', commentInfo)
            .then(() => {
                console.log("Comment Posted");
                setContent('');
            });
    };

    const handleUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleTimestamp = (e) => {
        setTimestamp(e.target.value);
    }

    const handleContent = (e) => {
        setContent(e.target.value);
    }

    return (
        <div>
            <TextField value={username} label='Username'
                required
                onChange={(e) => {
                    handleUsername(e);
                }}
            />
            <TextField value={timestamp} label='Timestamp'
                required
                onChange={(e) => {
                    handleTimestamp(e);
                }}
            />
            <TextField value={content} label='Comment'
                required
                multiline
                rows={5}
                onChange={(e) => {
                    handleContent(e);
                }}
            />
            <Button onClick={handleCommentSubmit} color="primary">
                Submit Comment
            </Button>
        </div>
    );
}

export default Home;