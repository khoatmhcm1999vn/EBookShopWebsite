import React, { Component, Fragment } from "react";

import Backdrop from "./Backdrop";
import Modal from "../Modal/Modal";
import Input from "./Input";
import FilePicker from "./FilePicker";
import Image from "./Image";

import ShowImage from "../core/ShowImage";

import { required, length } from "../utils/validators";
import { generateBase64FromImage } from "../utils/image";

const POST_FORM = {
  name: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
  category: {
    value: "1",
  },
  image: {
    value: "",
    valid: false,
    touched: false,
    validators: [required],
  },
  content: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
};

class FeedEdit extends Component {
  state = {
    postForm: POST_FORM,
    formIsValid: false,
    imagePreview: null,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.editing &&
      prevProps.editing !== this.props.editing &&
      prevProps.selectedPost !== this.props.selectedPost
    ) {
      const postForm = {
        name: {
          ...prevState.postForm.name,
          value: this.props.selectedPost.name,
          valid: true,
        },
        category: {
          ...prevState.postForm.category,
          value: this.props.categories,
        },
        image: {
          ...prevState.postForm.image,
          value: this.props.selectedPost.imagePath,
          valid: true,
        },
        content: {
          ...prevState.postForm.content,
          value: this.props.selectedPost.content,
          valid: true,
        },
      };
      this.setState({ postForm: postForm, formIsValid: true });
    }
  }

  postInputChangeHandler = (input, value, files) => {
    if (files) {
      generateBase64FromImage(files[0])
        .then((b64) => {
          this.setState({ imagePreview: b64 });
        })
        .catch((e) => {
          this.setState({ imagePreview: null });
        });
    }
    this.setState((prevState) => {
      // let isValid = true;
      // for (const validator of prevState.postForm[input].validators) {
      //   isValid = isValid && validator(value);
      // }
      const updatedForm = {
        ...prevState.postForm,
        [input]: {
          ...prevState.postForm[input],
          // valid: isValid,
          value: files ? files[0] : value,
        },
      };
      // let formIsValid = true;
      // for (const inputName in updatedForm) {
      //   formIsValid = formIsValid && updatedForm[inputName].valid;
      // }
      return {
        postForm: updatedForm,
        // formIsValid: formIsValid,
      };
    });
  };

  inputBlurHandler = (input) => {
    this.setState((prevState) => {
      return {
        postForm: {
          ...prevState.postForm,
          [input]: {
            ...prevState.postForm[input],
            touched: true,
          },
        },
      };
    });
  };

  cancelPostChangeHandler = () => {
    this.setState({
      postForm: POST_FORM,
      formIsValid: false,
    });
    this.props.onCancelEdit();
  };

  acceptPostChangeHandler = () => {
    const post = {
      name: this.state.postForm.name.value,
      category: this.state.postForm.category.value,
      image: this.state.postForm.image.value,
      content: this.state.postForm.content.value,
    };
    this.props.onFinishEdit(post);
    this.setState({
      postForm: POST_FORM,
      formIsValid: false,
      imagePreview: null,
    });
  };

  render() {
    return this.props.editing ? (
      <Fragment>
        <Backdrop onClick={this.cancelPostChangeHandler} />
        <Modal
          title="New Post"
          acceptEnabled={this.state.formIsValid}
          onCancelModal={this.cancelPostChangeHandler}
          onAcceptModal={this.acceptPostChangeHandler}
          isLoading={this.props.loading}
        >
          <form>
            <Input
              id="name"
              label="Name"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "name")}
              valid={this.state.postForm["name"].valid}
              touched={this.state.postForm["name"].touched}
              value={this.state.postForm["name"].value}
            />

            <div className="form-group">
              <label className="text-muted">Category</label>
              <select
                onChange={this.postInputChangeHandler}
                className="form-control"
              >
                <option>Please select</option>
                {this.props.categories &&
                  this.props.categories.map((c, i) => (
                    <option key={i} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* <div className="form-group">
              <label className="text-muted">Shipping</label>
              <select
                value={this.state.postForm["category"].value}
                onChange={this.postInputChangeHandler}
                className="form-control"
              >
                <option>Please select</option>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div> */}

            {/* <Input
              id="category"
              label="Category"
              control="select"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "category")}
              valid={this.state.postForm["category"].valid}
              touched={this.state.postForm["category"].touched}
              value={this.state.postForm["category"].value}
            />
            <option>Please select</option>
            <option value="0">No</option>
            <option value="1">Yes</option> */}

            <FilePicker
              id="image"
              label="Image"
              control="input"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "image")}
              valid={this.state.postForm["image"].valid}
              touched={this.state.postForm["image"].touched}
            />
            <div className="new-post__preview-image">
              {!this.state.imagePreview && <p>Please choose an image.</p>}
              {this.state.imagePreview && (
                <ShowImage imageUrl={this.state.imagePreview} contain left />
              )}
            </div>
            <Input
              id="content"
              label="Content"
              control="textarea"
              rows="5"
              onChange={this.postInputChangeHandler}
              onBlur={this.inputBlurHandler.bind(this, "content")}
              valid={this.state.postForm["content"].valid}
              touched={this.state.postForm["content"].touched}
              value={this.state.postForm["content"].value}
            />
          </form>
        </Modal>
      </Fragment>
    ) : null;
  }
}

export default FeedEdit;
