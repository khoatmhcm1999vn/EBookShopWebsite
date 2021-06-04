import React, { useState, useRef } from "react"
import { getNameProductSearch } from "../../actions/home.action"
import { useDispatch, useSelector } from "react-redux"
import { debounce } from "../../utils/debounce"
import { Link } from "react-router-dom"

export default function SearchBox(props) {
  // console.log(props.history);
  const nameBookSearch = useSelector(
    state => state.homeReducers.book.nameProductSearch
  )
  const dispatch = useDispatch()

  const [name, setName] = useState("")
  const debouncedSearch = useRef(
    debounce(q => dispatch(getNameProductSearch(q)), 600)
  ).current

  const handleChange = e => {
    setName(e.target.value)
    debouncedSearch(e.target.value)
    // console.log(name);
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (name) {
      props.history.push(`/shop-page/name/${name}`)
      setName("")
    } else {
      props.history.push(`/shop-page`)
      // setName("");
    }
  }

  // console.log(nameBookSearch?.length);
  // console.log(name.length);

  return (
    <div className="header__form">
      <form onSubmit={handleSubmit}>
        <input
          className="header__form--input"
          placeholder="Search For Product, Author"
          onChange={handleChange}
          value={name}
        />
        <button className="header__form--search" type="submit">
          <i className="fas fa-search"></i>
        </button>
      </form>
      {nameBookSearch?.length
        ? name.length > 0 && (
            <ul className="header__form--queried">
              {nameBookSearch.map(item => (
                <Link
                  className="header__form--queried__link"
                  to={`/product/${item._id}`}
                  key={item._id}
                  onClick={() => setName("")}
                >
                  <li>
                    <img src={item.img} alt="Book" />
                    <div>
                      <p>{item.name}</p>
                      <p>{item.author_name}</p>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )
        : null}
    </div>
  )
}

/*
<form className="search" onSubmit={submitHandler}>
        <div className="row">
        <input
          type="text"
          name="q"
          id="q"
          onChange={(e) => setName(e.target.value)}
        />
        <button className="primary" type="submit">
          <i className="fa fa-search"></i>
        </button>
      </div>
      </form>
*/
