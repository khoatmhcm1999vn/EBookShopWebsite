import React, { Component, Fragment } from "react";

// import openSocket from "socket.io-client";

import Post from "./Post";
import Button from "./Button";
import FeedEdit from "./FeedEdit";
import Input from "./Input";

import Footer from "../Footer/Footer";

import Paginator from "../Paginator/Paginator";
import LoadingSpinner from "./LoadingSpinner";
import ErrorHandler from "./ErrorModal";

import "./Feed.css";

import classes from "./Feed.css";

import Layout from "../Layout/Layout";

class Feed extends Component {
  state = {
    isEditing: false,
    products: [],
    totalPosts: 0,
    editPost: null,
    status: "",
    postPage: 1,
    postsLoading: true,
    editLoading: false,
    categories: [],
    category: "",
  };

  componentDidMount() {
    // fetch("http://localhost:8090/auth/status", {
    //   headers: {
    //     Authorization: "Bearer " + this.props.token,
    //   },
    // })
    //   .then((res) => {
    //     if (res.status !== 200) {
    //       throw new Error("Failed to fetch user status.");
    //     }
    //     return res.json();
    //   })
    //   .then((resData) => {
    //     this.setState({ status: resData.status });
    //   })
    //   .catch(this.catchError);

    fetch("http://localhost:8090/api/categories")
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch categories.");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({ categories: resData });
      })
      .catch(this.catchError);

    this.loadPosts();

    // const socket = openSocket("http://localhost:8090");
    // socket.on("posts", (data) => {
    //   if (data.action === "create") {
    //     this.addPost(data.post);
    //   } else if (data.action === "update") {
    //     this.updatePost(data.post);
    //   } else if (data.action === "delete") {
    //     this.loadPosts();
    //   }
    // });
  }

  addPost = (post) => {
    this.setState((prevState) => {
      const updatedPosts = [...prevState.products];
      if (prevState.postPage === 1) {
        if (prevState.products.length >= 2) {
          updatedPosts.pop();
        }
        updatedPosts.unshift(post);
      }
      return {
        products: updatedPosts,
        totalPosts: prevState.totalPosts + 1,
      };
    });
  };

  updatePost = (post) => {
    this.setState((prevState) => {
      const updatedPosts = [...prevState.products];
      const updatedPostIndex = updatedPosts.findIndex(
        (p) => p._id === post._id
      );
      if (updatedPostIndex > -1) {
        updatedPosts[updatedPostIndex] = post;
      }
      return {
        posts: updatedPosts,
      };
    });
  };

  loadPosts = (direction) => {
    if (direction) {
      this.setState({ postsLoading: true, products: [] });
    }
    let page = this.state.postPage;
    if (direction === "next") {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === "previous") {
      page--;
      this.setState({ postPage: page });
    }
    fetch("http://localhost:8090/api/listproducts?page=" + page, {
      // headers: {
      //   Authorization: "Bearer " + this.props.token,
      // },
      method: "GET",
    })
      // .then((res) => {
      //   if (res.status !== 200) {
      //     throw new Error("Failed to fetch products.");
      //   }
      //   return res.json();
      // })
      .then((res) => res.json())
      .then((resData) => {
        this.setState({
          products: resData.products.map((post) => {
            return {
              ...post,
              name: post.name,
              category: post.category,
              imagePath: post.imageUrl,
              quantity: post.quantity,
            };
          }),
          totalPosts: resData.totalItems,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  // statusUpdateHandler = (event) => {
  //   event.preventDefault();
  //   fetch("http://localhost:8090/auth/status", {
  //     method: "PATCH",
  //     headers: {
  //       Authorization: "Bearer " + this.props.token,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       status: this.state.status,
  //     }),
  //   })
  //     .then((res) => {
  //       if (res.status !== 200 && res.status !== 201) {
  //         throw new Error("Can't update status!");
  //       }
  //       return res.json();
  //     })
  //     .then((resData) => {
  //       console.log(resData);
  //     })
  //     .catch(this.catchError);
  // };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    this.setState((prevState) => {
      const loadedPost = {
        ...prevState.products.find((p) => p._id === postId),
      };

      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = (postData) => {
    this.setState({
      editLoading: true,
    });
    const formData = new FormData();
    formData.append("name", postData.name);
    // formData.append("content", postData.content);
    formData.append("image", postData.image);
    formData.append("category", postData.category);
    let url = "http://localhost:8090/api/product/create";
    let method = "POST";
    if (this.state.editPost) {
      url = "http://localhost:8090/api/product/edit" + this.state.editPost._id;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      body: formData,
      // headers: {
      //   Authorization: "Bearer " + this.props.token,
      // },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating or editing a product failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        const product = {
          _id: resData.product._id,
          name: resData.product.name,
          // content: resData.product.content,
          // creator: resData.product.creator,
          createdAt: resData.product.createdAt,
        };
        this.setState((prevState) => {
          let updatedPosts = [...prevState.products];
          if (prevState.editPost) {
            const postIndex = prevState.products.findIndex(
              (p) => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = product;
          } else if (prevState.product.length < 2) {
            updatedPosts = prevState.products.concat(product);
          }
          return {
            products: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false,
          };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = (productId) => {
    this.setState({ postsLoading: true });
    fetch("http://localhost:8090/api/product/delete" + productId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Deleting a product failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.loadPosts();
        this.setState((prevState) => {
          const updatedPosts = prevState.posts.filter(
            (p) => p._id !== productId
          );
          return { posts: updatedPosts, postsLoading: false };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = (error) => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <Layout
          title="Manage Products"
          description="Node React"
          className="container-fluid"
        >
          <FeedEdit
            categories={this.state.categories}
            editing={this.state.isEditing}
            selectedPost={this.state.editPost}
            loading={this.state.editLoading}
            onCancelEdit={this.cancelEditHandler}
            onFinishEdit={this.finishEditHandler}
          />
          <section className={classes.Feed}>
            <form onSubmit={this.statusUpdateHandler}>
              <Input
                type="text"
                placeholder="Your product value"
                control="input"
                onChange={this.statusInputChangeHandler}
                value={this.state.status}
              />
              <Button mode="flat" type="submit">
                Update
              </Button>
            </form>
          </section>
          <section className={classes.Feed__control}>
            <Button mode="raised" design="accent" onClick={this.newPostHandler}>
              New Post
            </Button>
          </section>

          <section className={classes.Feed}>
            {this.state.postsLoading && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <LoadingSpinner />
              </div>
            )}
            {this.state.products.length <= 0 && !this.state.postsLoading ? (
              <p style={{ textAlign: "center" }}>No products found.</p>
            ) : null}
            {!this.state.postsLoading && (
              <Paginator
                onPrevious={this.loadPosts.bind(this, "previous")}
                onNext={this.loadPosts.bind(this, "next")}
                lastPage={Math.ceil(this.state.totalPosts / 2)}
                currentPage={this.state.postPage}
              >
                {/* {JSON.stringify(this.state.products)} */}
                {this.state.categories.map((c, i) => (
                  <option key={i} value={c._id}>
                    {c.name}
                  </option>
                ))}
                {this.state.products.map((post) => (
                  <Post
                    key={post._id}
                    id={post._id}
                    name={post.name}
                    category={post.category._id}
                    quantity={post.quantity}
                    date={new Date(post.createdAt).toLocaleDateString("en-US")}
                    // title={post.title}
                    image={post.imageUrl}
                    // content={post.content}
                    onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                    onDelete={this.deletePostHandler.bind(this, post._id)}
                  />
                ))}
              </Paginator>
            )}
          </section>

          <Footer className={classes.Feed__footer} />
        </Layout>
      </Fragment>
    );
  }
}

export default Feed;
