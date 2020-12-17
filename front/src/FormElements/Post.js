import React from "react";

import Button from "./Button";

import Image from "../FormElements/Image";

import classes from "./Post.css";

import "./Post.css";

const post = (props) => (
  <article className={classes.Post}>
    <header className={classes.Post__header}>
      <h3 className={classes.Post__meta}>
        Posted by {props.quantity} on {props.date}
      </h3>
      <h1 className={classes.Post__title}>{props.name}</h1>
      <h2>{props.category}</h2>
    </header>

    {/* <ShowImage img={props.image} /> */}

    <div className={classes.Post__image}>
      <Image imageUrl={props.image} contain />
      {/* <Image img={props.image} /> */}
    </div>

    {/* <div className="post__content">{props.content}</div> */}

    <div className={classes.Post__actions}>
      <Button mode="flat" link={`/product/${props.id}`}>
        View
      </Button>
      <Button mode="flat" onClick={props.onStartEdit}>
        Edit
      </Button>
      <Button mode="flat" design="danger" onClick={props.onDelete}>
        Delete
      </Button>
    </div>
  </article>
);

export default post;
