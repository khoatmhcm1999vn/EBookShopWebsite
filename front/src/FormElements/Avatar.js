import React from 'react';
import ShowImage from '../core/ShowImage';

import Image from '../FormElements/Image';

import classes from './Avatar.css'

const avatar = props => (
  <div
    className={classes.Avatar}
    style={{ width: props.size + 'rem', height: props.size + 'rem' }}
  >
    <ShowImage imageUrl={props.image} />
  </div>
);

export default avatar;
