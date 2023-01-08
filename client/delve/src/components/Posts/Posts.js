import React from 'react'
import Post from './Post/Post'

import useStyles from './styles';
import { Grid, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

const Posts = ({ setcurrentId }) => {
  const classes = useStyles();
  const { posts, isLoading } = useSelector((state) => state.posts);

  if (!posts.length && !isLoading) return 'Currently No Posts Available for this Destination.';

  return (
    isLoading ? <CircularProgress /> : (
      <Grid className={classes.container} container alignItems="stretch" spacing={2}>
        {
          posts.map((post) => (
            <Grid key={post._id} item xs={12} sm={12} md={6} lg={4}>
              <Post post={post} setcurrentId={setcurrentId} />
            </Grid>
          ))
        }
      </Grid>
    )
  );
}

export default Posts