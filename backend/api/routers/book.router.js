"use strict";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  getTotalPage,
  getAllBook,
  getBookByPublisher,
  getBookByCategory,
  getBookByAuthor,
  getBookByID,
  getRelatedBook,
} from "../controllers/book.controller.js";
import faker from "faker";
import Book from "../models/book.model.js";
import Category from "../models/category.model.js";
import Bill from "../models/bill.model.js";

import Vector from "vector-object";
import natural from "natural";
const TfIdf = natural.TfIdf;

import mongoose from "mongoose";
import validator from "../validator/index.js";

import startOfDay from "date-fns/startOfDay/index.js";
import endOfDay from "date-fns/endOfDay/index.js";
import startOfWeek from "date-fns/startOfWeek/index.js";
import endOfWeek from "date-fns/endOfWeek/index.js";
import startOfMonth from "date-fns/startOfMonth/index.js";
import endOfMonth from "date-fns/endOfMonth/index.js";

const bookRouter = express.Router();

bookRouter.get("/book/totalpage", getTotalPage);
bookRouter.post("/book/allbook", getAllBook);
// Fake data products
bookRouter.get("/generate-fake-data", async (req, res, next) => {
  for (let i = 0; i < 10; i++) {
    const newprd = new Book();
    newprd.id_category = faker.commerce.productName();
    newprd.id_nsx = faker.commerce.productName();
    newprd.id_author = faker.commerce.productName();
    newprd.name = faker.commerce.productName();
    newprd.price = faker.commerce.price();
    newprd.quantity = faker.commerce.price();
    newprd.published = faker.datatype.boolean();
    newprd.img = faker.image.image();
    newprd.describe = faker.commerce.productName();
    newprd.save((err) => {
      if (err) {
        return next(err);
      }
    });
  }
  res.redirect("/");
});
bookRouter.post(
  "/api/getAllBook",
  expressAsyncHandler(async (req, res) => {
    let count = null;

    try {
      count = await Book.countDocuments();
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err });
      return;
    }

    let perPage = parseInt(req.body.size) || 10; // số lượng sản phẩm xuất hiện trên 1 page
    let totalPage = parseInt((count - 1) / perPage + 1);
    const { name } = req.body;
    let page = parseInt(req.body.page) || 1;
    if (parseInt(page) < 1 || parseInt(page) > totalPage) {
      res.status(200).json({ data: [], msg: "Invalid page", totalPage });
      return;
    }

    let bookFind;
    if (name) {
      try {
        console.log(name);
        bookFind = await Book.aggregate([
          {
            $addFields: {
              convertedZipCode: { $toString: "$published" },
            },
          },
          {
            $match: {
              name: { $regex: name, $options: "i" },
            },
          },
          {
            $project: {
              id_category: {
                $toObjectId: "$id_category",
              },
              createdAt: 1,
              name: 1,
              describe: 1,
              sales: 1,
              img: 1,
              convertedZipCode: 1,
              price: 1,
              quantity: 1,
              // new_amount: { $add: ["$price", 100] },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "id_category",
              foreignField: "_id",
              as: "cate",
            },
          },
          {
            $project: {
              createdAt: 1,
              name: 1,
              describe: 1,
              sales: 1,
              img: 1,
              convertedZipCode: 1,
              price: 1,
              quantity: 1,
              // new_amount: { $add: ["$price", 100] },
              cate_name: "$cate.name",
            },
          },
          {
            $unwind: "$cate_name",
          },
          { $sort: { createdAt: -1 } },
          // { $skip: perPage * (parseInt(page) - 1) },
          // { $limit: perPage },
        ]);

        res.status(200).json({
          result: "success",
          data: bookFind,
          totalPage,
          pageCurrent: page,
        });
        return;
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
      }
    } else {
      try {
        bookFind = await Book.aggregate([
          {
            $addFields: {
              convertedZipCode: { $toString: "$published" },
            },
          },
          {
            $project: {
              id_category: {
                $toObjectId: "$id_category",
              },
              createdAt: 1,
              name: 1,
              describe: 1,
              sales: 1,
              img: 1,
              convertedZipCode: 1,
              price: 1,
              quantity: 1,
              _id: 1,
              id_nsx: 1,
              id_author: 1,
              published: 1,
              // new_amount: { $add: ["$price", 100] },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "id_category",
              foreignField: "_id",
              as: "cate",
            },
          },
          {
            $project: {
              createdAt: 1,
              name: 1,
              describe: 1,
              sales: 1,
              img: 1,
              convertedZipCode: 1,
              price: 1,
              quantity: 1,
              _id: 1,
              id_nsx: 1,
              id_author: 1,
              published: 1,
              // new_amount: { $add: ["$price", 100] },
              cate_name: "$cate.name",
              id_category: "$cate._id",
            },
          },
          {
            $unwind: "$cate_name",
          },
          {
            $unwind: "$id_category",
          },
          // {
          //   $group: {
          //     _id: "$cate_name",
          //     count: { $sum: 1 },
          //     id_book: { $first: "$_id" },
          //     name: { $first: "$name" },
          //     describe: {$first: "$describe"},
          //     describe: {$first: "$describe"},
          //   },
          // },
          // {
          //   $project: {
          //     name: "$name",
          //     count: 1
          //     //  age: "$age",
          //     //  count: "$count",
          //     //  _id:0
          //   },
          // },
          { $sort: { createdAt: -1 } },
          // { $skip: perPage * (parseInt(page) - 1) },
          // { $limit: perPage },
        ]);

        res.status(200).json({
          result: "success",
          data: bookFind,
          totalPage,
          // pageCurrent: page,
        });
        return;
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
      }
    }
  })
);
bookRouter.get(
  "/api/product",
  expressAsyncHandler(async (req, res) => {
    const { page, size, name } = req.query;
    console.log(name);
    if (name) {
      try {
        const productCategories = await Book.aggregate([
          {
            $addFields: {
              convertedZipCode: { $toString: "$published" },
            },
          },
          {
            $match: {
              name: { $regex: name, $options: "i" },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
        ]);
        res.json({ result: "success", data: productCategories });
      } catch (err) {
        res.json({ result: "error", message: err.msg });
      }
    } else {
      console.log("fail");
      try {
        const productCategories = await Book.aggregate([
          {
            $addFields: {
              convertedZipCode: { $toString: "$published" },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
        ]);
        res.json({ result: "success", data: productCategories });
      } catch (err) {
        res.json({ result: "error", message: err.msg });
      }
    }
  })
);
bookRouter.get(
  "/api/findproduct",
  expressAsyncHandler(async (req, res) => {
    const { page, size, name } = req.query;
    console.log(name);
    const condition = name
      ? {
          name: { $regex: new RegExp(name), $options: "i" },
          published: true,
          quantity: { $gte: 1 },
          // published: { $regex: new RegExp(published) },
        }
      : { published: true, quantity: { $gte: 1 } };
    let productCategories;
    try {
      productCategories = await Book.find(
        condition
        // sort: { createdAt: +1 },
      ).sort({ createdAt: -1 });
      res.json({ result: "success", data: productCategories });
    } catch (err) {
      res.json({ result: "error", message: err.msg });
    }
  })
);
bookRouter.post("/book/publisher", getBookByPublisher);
bookRouter.post("/book/category", getBookByCategory);
bookRouter.post("/book/author", getBookByAuthor);
bookRouter.get("/book/:id", getBookByID);
bookRouter.get("/book/related/:bookId", getRelatedBook);

bookRouter.post(
  "/get/best-seller",
  expressAsyncHandler(async (req, res) => {
    const pipeline = [
      // {
      //   $project: {
      //     _id: {
      //       $toObjectId: "$products._id",
      //     },
      //   },
      // },
      {
        $unwind: "$products", // lấy ra param order_list[] chia đều thành mảng các object
      },
      { $project: { products: 1 } }, // chỉ hiển thị field order_list
      {
        $group: {
          _id: "$products._id",
          name: { $first: "$products.name" },
          price: { $first: "$products.price" },
          img: { $first: "$products.img" },
          count: { $sum: 1 },
        },
      },
      // {
      //   $project: {
      //     name: 1,
      //     count: 1,
      //   },
      // },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ];
    const order = await Bill.aggregate(pipeline);
    // await Product.populate(order, {
    //   path: "_id",
    //   select: [
    //     "name",
    //     "bigimage",
    //     "stars",
    //     "price_min",
    //     "reviewCount",
    //     "pathseo",
    //     "active",
    //   ],
    //   populate: { path: "bigimage", select: "public_url" },
    // });
    return res.status(200).json({ success: true, code: 200, products: order });
  })
);

bookRouter.post(
  "/api/get-newest-product",
  expressAsyncHandler(async (req, res) => {
    let products = await Book.find(
      { published: true },
      {
        name: 1,
        price: 1,
        img: 1,
        quantity: 1,
        describe: 1,
        // group: 0,
        // category: 0,
        // brand: 0,
        createdAt: 1,
        // updatedAt: 0,
        // price_max: 0,
      }
    )
      // .populate({ path: "bigimage", select: "public_url" })
      .limit(2)
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, code: 200, products });
  })
);

bookRouter.post(
  "/api/get-favor-product",
  expressAsyncHandler(async (req, res) => {
    const pipeline = [
      {
        $match: { published: true },
      },
      {
        $sort: { stars: -1 },
      },
      {
        $limit: 2,
      },
      {
        $project: {
          name: 1,
          img: 1,
          stars: 1,
          price: 1,
          reviewCount: 1,
          published: 1,
        },
      },
    ];
    const products = await Book.aggregate(pipeline);
    // await Image.populate(products, {path: "bigimage", select: 'public_url'})
    return res.status(200).json({ success: true, code: 200, products });
  })
);

// Content-based Filtering
bookRouter.post(
  "/book/get-all-books/:id",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);

    const pipeline = [
      // {
      //   $lookup: {
      //     from: "ratings",
      //     localField: "ratingx1",
      //     foreignField: "_id",
      //     as: "rates",
      //   },
      // },
      {
        $match: {
          published: true,
        },
      },
      {
        $project: {
          _id: 1,
          id_category: 1,
          id_nsx: 1,
          id_author: 1,
          createdAt: 1,
          name: 1,
          describe: 1,
          sales: 1,
          stars: 1,
          view_counts: 1,
          img: 1,
          price: 1,
          quantity: 1,
          ratings: 1,
          // new_amount: { $add: ["$price", 100] },
          // rate_value: "$rates.value",
        },
      },
      // {
      //   $unwind: "$rate_value",
      // },
      {
        $sort: { name: 1 },
      },
      // {
      //   $limit: 4,
      // },
    ];

    const products = await Book.aggregate(pipeline);

    // let books = await Book.find({}).sort({ createdAt: -1 }).limit(2);
    // books = await Book.populate(books, { path: "ratingx1", select: "value" });

    // const formattedData = [
    //   {
    //     id: "1.jpg",
    //     content:
    //       "flower flowering plant plant petal geraniaceae melastome family geranium wildflower geraniales perennial plant",
    //   },
    // ];

    console.log(
      "----------------------------------------------------------------------------------------------------------------------------------------"
    );
    console.log(products);
    console.log(products.length);

    // const formatData = (data) => {
    //   let formatted = [];

    //   for (const [key, labels] of Object.entries(data)) {
    //     let tmpObj = {};
    //     const desc = labels.map((l) => {
    // return l.description.toLowerCase();
    //       return l.rating;
    //     });

    //     console.log(desc);
    // console.log(Number(desc.join(' ')))

    //     tmpObj = {
    //       id: key,
    // content: desc.join(','),
    //       content: desc,
    //     };

    //     formatted.push(tmpObj);
    //   }

    // console.log(formatted);

    //   return formatted;
    // };

    // const processedDocs = formatData(originalData);
    console.log(
      "----------------------------------------------------------------------------------------------------------------------------------------"
    );

    const createVectorsFromDocs = (processedDocs) => {
      // console.log(processedDocs);
      const tfidf = new TfIdf();

      processedDocs.forEach((processedDocument) => {
        tfidf.addDocument(processedDocument.ratings);
        // console.log(tfidf);
      });

      // console.log(
      //   "----------------------------------------------------------------------------------------------------------------------------------------"
      // );
      // console.log(tfidf);
      // console.log(
      //   "----------------------------------------------------------------------------------------------------------------------------------------"
      // );
      // return;

      const documentVectors = [];

      for (let i = 0; i < processedDocs.length; i += 1) {
        const processedDocument = processedDocs[i];
        // console.log(processedDocument);
        const obj = {};

        const items = tfidf.listTerms(i);
        // console.log(items);
        // return;

        for (let j = 0; j < items.length; j += 1) {
          const item = items[j];
          obj[item.term] = item.tfidf;
        }

        const documentVector = {
          id: processedDocument._id,
          name: processedDocument.name,
          img: processedDocument.img,
          price: processedDocument.price,
          quantity: processedDocument.quantity,
          sales: processedDocument.sales,
          view_counts: processedDocument.view_counts,
          id_category: processedDocument.id_category,
          id_author: processedDocument.id_author,
          id_nsx: processedDocument.id_nsx,
          createdAt: processedDocument.createdAt,
          vector: new Vector(obj),
        };

        console.log(documentVector);

        documentVectors.push(documentVector);
      }

      console.log(documentVectors);

      return documentVectors;
    };

    const calcSimilarities = (docVectors) => {
      // number of results that you want to return.
      const MAX_SIMILAR = 5;
      // min cosine similarity score that should be returned.
      const MIN_SCORE = 0.2;
      const data = {};

      for (let i = 0; i < docVectors.length; i += 1) {
        const documentVector = docVectors[i];
        // console.log(documentVector);
        const { id } = documentVector;

        data[id] = [];
      }

      // console.log(data);
      // console.log(docVectors.length);
      // return

      for (let i = 0; i < docVectors.length; i += 1) {
        // console.log(docVectors[i]);
        // console.log(docVectors[0])
        // console.log(i)

        for (let j = 0; j < i; j += 1) {
          // console.log(i)
          // console.log(docVectors[i]);
          // console.log(docVectors[j]);

          const idi = docVectors[i].id;
          const namei = docVectors[i].name;
          const imgi = docVectors[i].img;
          const pricei = docVectors[i].price;
          const quantityi = docVectors[i].quantity;
          const salesi = docVectors[i].sales;
          const viewCountsi = docVectors[i].view_counts;
          const id_categoryi = docVectors[i].id_category;
          const id_authori = docVectors[i].id_author;
          const id_nsxi = docVectors[i].id_nsx;
          const createdAti = docVectors[i].createdAt;
          const vi = docVectors[i].vector;

          const idj = docVectors[j].id;
          const namej = docVectors[j].name;
          const imgj = docVectors[j].img;
          const pricej = docVectors[j].price;
          const quantityj = docVectors[j].quantity;
          const salesj = docVectors[j].sales;
          const viewCountsj = docVectors[j].view_counts;
          const id_categoryj = docVectors[j].id_category;
          const id_authorj = docVectors[j].id_author;
          const id_nsxj = docVectors[j].id_nsx;
          const createdAtj = docVectors[j].createdAt;
          const vj = docVectors[j].vector;

          console.log(vi);
          console.log(vj);

          const similarity = vi.getCosineSimilarity(vj);

          console.log(similarity);

          if (similarity > MIN_SCORE) {
            data[idi].push({
              _id: idj,
              name: namej,
              img: imgj,
              price: pricej,
              quantity: quantityj,
              sales: salesj,
              view_counts: viewCountsj,
              id_category: id_categoryj,
              id_author: id_authorj,
              id_nsx: id_nsxj,
              createdAt: createdAtj,
              score: similarity,
            });

            data[idj].push({
              _id: idi,
              name: namei,
              img: imgi,
              price: pricei,
              quantity: quantityi,
              sales: salesi,
              view_counts: viewCountsi,
              id_category: id_categoryi,
              id_author: id_authori,
              id_nsx: id_nsxi,
              createdAt: createdAti,
              score: similarity,
            });
          }
        }
      }

      console.log(data);

      // finally sort the similar documents by descending order
      Object.keys(data).forEach((id) => {
        data[id].sort((a, b) => b.score - a.score);

        if (data[id].length > MAX_SIMILAR) {
          data[id] = data[id].slice(0, MAX_SIMILAR);
        }
      });

      console.log(data);

      return data;
    };

    const getSimilarDocuments = (id, trainedData) => {
      let similarDocuments = trainedData[id];

      if (similarDocuments === undefined) {
        return [];
      }

      // console.log(
      //   "----------------------------------------------------------------------------------------------------------------------------------------"
      // );
      // console.log(trainedData);
      // console.log(id);
      // console.log(similarDocuments);

      return similarDocuments;
    };

    const vectorsFromDocs = createVectorsFromDocs(products);
    // console.log(vectorsFromDocs);
    console.log(
      "----------------------------------------------------------------------------------------------------------------------------------------"
    );

    const similaritiesCalc = calcSimilarities(vectorsFromDocs);
    // console.log(similaritiesCalc);

    const similarProductGet = getSimilarDocuments(id, similaritiesCalc);
    console.log(similarProductGet);

    return res
      .status(200)
      .json({ success: true, code: 200, products, similarProductGet });
  })
);

bookRouter.post(
  "/api/get-list-books",
  expressAsyncHandler(async (req, res) => {
    // const pipeline = [
    //   {
    //     $sort: { stars: -1 },
    //   },
    //   {
    //     $limit: 2,
    //   },
    //   {
    //     $project: {
    //       name: 1,
    //       img: 1,
    //       stars: 1,
    //       price: 1,
    //       reviewCount: 1,
    //       published: 1,
    //     },
    //   },
    // ];
    // const products = await Book.aggregate(pipeline);

    const { ids } = req.body;

    function convertToObjectId(id) {
      const id_obj = mongoose.Types.ObjectId(id);
      return id_obj;
    }

    let arr = [];
    ids.forEach((e) => {
      e = convertToObjectId(e);
      // console.log(mongoose.Types.ObjectId.isValid(e));
      arr.push(e);
    });

    let bookFind;
    bookFind = await Book.find({
      _id: {
        $in: arr,
      },
    });

    // await Image.populate(products, {path: "bigimage", select: 'public_url'})
    return res.status(200).json({ success: true, code: 200, data: bookFind });
  })
);

bookRouter.post(
  "/api/get-best-seller-product-top-5/by-day",
  expressAsyncHandler(async (req, res) => {
    // let today = new Date().toISOString().slice(0, 10).split("-");
    // const day = today[2];
    // const month = today[1];
    // const year = today[0];
    // console.log(today);
    // console.log(month);
    // console.log(new Date(year, month - 1, parseInt(day) + 1));
    // console.log(new Date(year, month - 1, parseInt(day) + 2));
    // console.log(new Date(year, month - 1, day));
    // console.log(startOfDay(new Date()));
    // console.log(endOfDay(new Date()));

    const pipeline = [
      {
        $match: {
          sales: { $gte: 1 },
          published: true,
          updatedAt: {
            $gte: startOfDay(new Date()),
            $lte: endOfDay(new Date()),
          },
        },
      },
      {
        $sort: { sales: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          name: 1,
          img: 1,
          stars: 1,
          price: 1,
          reviewCount: 1,
          published: 1,
          quantity: 1,
          sales: 1,
          updatedAt: 1,
        },
      },
    ];
    const products = await Book.aggregate(pipeline);
    return res.status(200).json({ success: true, code: 200, data: products });
  })
);

bookRouter.post(
  "/api/get-best-seller-product-all-pagination/by-day",
  expressAsyncHandler(async (req, res) => {
    let sortCriteria = {};
    const defaultSort = -1;
    const { sales, price, updatedAt } = req.body;
    if (sales) {
      sortCriteria["sales"] = parseInt(sales);
    } else if (price) {
      sortCriteria["price"] = parseInt(price);
    } else if (updatedAt) {
      sortCriteria["updatedAt"] = parseInt(updatedAt);
    } else {
      sortCriteria["sales"] = defaultSort;
    }
    // console.log(sortCriteria);

    let count = null;
    try {
      count = await Book.countDocuments({
        sales: { $gte: 1 },
        published: true,
        updatedAt: {
          $gte: startOfDay(new Date()),
          $lte: endOfDay(new Date()),
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err });
      return;
    }
    // console.log(count);

    let perPage = parseInt(req.body.size) || 10; //số lượng sản phẩm xuất hiện trên 1 page
    let totalPage = parseInt((count - 1) / perPage + 1);
    // const { name } = req.body;
    let page = parseInt(req.body.page) || 1;
    // if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    //   return res.json({ data: [], msg: "Invalid page", totalPage });
    // }
    // console.log(perPage);
    // console.log(page);

    const pipeline = [
      {
        $match: {
          sales: { $gte: 1 },
          published: true,
          updatedAt: {
            $gte: startOfDay(new Date()),
            $lte: endOfDay(new Date()),
          },
        },
      },
      {
        $sort: sortCriteria,
      },
      { $skip: perPage * (parseInt(page) - 1) },
      { $limit: perPage },
      {
        $project: {
          name: 1,
          img: 1,
          stars: 1,
          price: 1,
          reviewCount: 1,
          published: 1,
          quantity: 1,
          sales: 1,
          updatedAt: 1,
        },
      },
    ];
    const products = await Book.aggregate(pipeline);
    return res.status(200).json({
      success: true,
      code: 200,
      data: products,
      page,
      totalPage,
    });
  })
);

bookRouter.post(
  "/api/get-rating-rank-product-top-5",
  expressAsyncHandler(async (req, res) => {
    let matchCriteria = {};
    const { id_category } = req.body;
    if (id_category) {
      matchCriteria["id_category"] = id_category;
    }
    matchCriteria["view_counts"] = { $gte: 1 };
    matchCriteria["published"] = true;
    // console.log(matchCriteria);

    const pipeline = [
      {
        $addFields: {
          convertedAuthorId: { $toObjectId: "$id_author" },
          convertedPublisherId: { $toObjectId: "$id_nsx" },
        },
      },
      {
        $match: matchCriteria,
      },
      {
        $sort: { view_counts: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          name: 1,
          img: 1,
          // stars: 1,
          price: 1,
          describe: 1,
          // reviewCount: 1,
          // published: 1,
          // quantity: 1,
          view_counts: 1,
          // id_category: 1,
          // id_author: 1,
          convertedAuthorId: 1,
          convertedPublisherId: 1,
        },
      },
      {
        $lookup: {
          from: "authors",
          localField: "convertedAuthorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $project: {
          name: 1,
          describe: 1,
          img: 1,
          // stars: 1,
          price: 1,
          // reviewCount: 1,
          // published: 1,
          // quantity: 1,
          view_counts: 1,
          // id_category: 1,
          // id_author: 1,
          // convertedAuthorId: 1,
          convertedPublisherId: 1,
          author_name: "$author.name",
        },
      },
      {
        $unwind: "$author_name",
      },
      {
        $lookup: {
          from: "publishers",
          localField: "convertedPublisherId",
          foreignField: "_id",
          as: "publisher",
        },
      },
      {
        $project: {
          name: 1,
          describe: 1,
          img: 1,
          // stars: 1,
          price: 1,
          // reviewCount: 1,
          // published: 1,
          // quantity: 1,
          view_counts: 1,
          // id_category: 1,
          // id_author: 1,
          // convertedAuthorId: 1,
          // convertedPublisherId: 1,
          author_name: 1,
          publisher_name: "$publisher.name",
        },
      },
      {
        $unwind: "$publisher_name",
      },
    ];
    const products = await Book.aggregate(pipeline);
    return res.status(200).json({ success: true, code: 200, data: products });
  })
);

bookRouter.post(
  "/api/get-rating-rank-product-all",
  expressAsyncHandler(async (req, res) => {
    let matchCriteria = {};
    const { id_category } = req.body;
    if (id_category) {
      matchCriteria["id_category"] = id_category;
    }
    matchCriteria["view_counts"] = { $gte: 1 };
    matchCriteria["published"] = true;
    // console.log(matchCriteria);
    // console.log(req.body);

    const pipeline = [
      {
        $addFields: {
          convertedAuthorId: { $toObjectId: "$id_author" },
        },
      },
      {
        $match: matchCriteria,
      },
      {
        $sort: { view_counts: -1 },
      },
      {
        $limit: 20,
      },
      {
        $project: {
          name: 1,
          img: 1,
          // stars: 1,
          // price: 1,
          // reviewCount: 1,
          // published: 1,
          // quantity: 1,
          view_counts: 1,
          // id_category: 1,
          // id_author: 1,
          convertedAuthorId: 1,
        },
      },
      {
        $lookup: {
          from: "authors",
          localField: "convertedAuthorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $project: {
          name: 1,
          img: 1,
          // stars: 1,
          // price: 1,
          // reviewCount: 1,
          // published: 1,
          // quantity: 1,
          view_counts: 1,
          // id_category: 1,
          // id_author: 1,
          // convertedAuthorId: 1,
          author_name: "$author.name",
        },
      },
      {
        $unwind: "$author_name",
      },
    ];
    const products = await Book.aggregate(pipeline);
    return res.status(200).json({ success: true, code: 200, data: products });
  })
);

bookRouter.post(
  "/api/get-product-by-category-top-10",
  expressAsyncHandler(async (req, res) => {
    // let matchCriteria = {};
    // const { id_category } = req.body;
    // if (id_category) {
    //   matchCriteria["id_category"] = id_category;
    // }
    // matchCriteria["published"] = true;
    // // console.log(matchCriteria);

    // const pipeline = [
    //   {
    //     $match: matchCriteria,
    //   },
    //   {
    //     $sort: { createdAt: -1 },
    //   },
    //   {
    //     $limit: 10,
    //   },
    //   {
    //     $project: {
    //       name: 1,
    //       img: 1,
    //       stars: 1,
    //       price: 1,
    //       reviewCount: 1,
    //       quantity: 1,
    //       id_category: 1,
    //       createdAt: 1,
    //     },
    //   },
    // ];
    // const products = await Book.aggregate(pipeline);
    // return res.status(200).json({ success: true, code: 200, data: products });

    const pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
    const page = Number(req.body.pageNumber) || 1;
    const id_category = req.body.id_category || "";
    const published = req.body.published || true;
    console.log(req.body);

    const categoryFilter = id_category ? { id_category: id_category } : {};
    const publishedFilter = published
      ? { published: published }
      : { published: true };
    const objFilter = {
      ...categoryFilter,
      ...publishedFilter,
    };
    console.log(objFilter);

    let count = null;
    try {
      count = await Book.countDocuments(objFilter);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err });
    }
    console.log(count);

    const pipeline = [
      {
        $match: objFilter,
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: pageSize * (page - 1) },
      { $limit: pageSize },
      {
        $project: {
          name: 1,
          img: 1,
          published: 1,
          price: 1,
          quantity: 1,
          stars: 1,
          reviewCount: 1,
          sales: 1,
          id_category: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];
    const products = await Book.aggregate(pipeline);
    return res.status(200).json({
      success: true,
      code: 200,
      data: products,
      pageSizeOnePage: products.length,
      currPage: page,
      totalPage: Math.ceil(count / pageSize),
    });
  })
);

bookRouter.post(
  "/api/get-product-by-category-all-pagination",
  expressAsyncHandler(async (req, res) => {
    // let sortCriteria = {};
    // const defaultSort = -1;
    // const { sales, price, createdAt } = req.body;
    // if (sales) {
    //   sortCriteria["sales"] = parseInt(sales);
    // } else if (price) {
    //   sortCriteria["price"] = parseInt(price);
    // } else if (createdAt) {
    //   sortCriteria["createdAt"] = parseInt(createdAt);
    // } else {
    //   sortCriteria["createdAt"] = defaultSort;
    // }
    // console.log(sortCriteria);

    // let matchCriteria = {};
    // const { id_category } = req.body;
    // if (id_category) {
    //   matchCriteria["id_category"] = id_category;
    // }
    // matchCriteria["published"] = true;
    // console.log(matchCriteria);

    // let perPage = parseInt(req.body.size) || 10; //số lượng sản phẩm xuất hiện trên 1 page
    // let totalPage = parseInt((count - 1) / perPage + 1);
    // const { name } = req.body;
    // let page = parseInt(req.body.page) || 1;
    // if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    //   return res.json({ data: [], msg: "Invalid page", totalPage });
    // }
    // let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    // let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    // console.log(limit);
    // console.log(skip);

    // const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    // const skip = Number(req.query.skip) || 0;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || "";
    const id_category = req.query.id_category || "";
    const published = req.query.published || true;
    const order = req.query.order || "";
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const stars =
      req.query.stars && Number(req.query.stars) !== 0
        ? Number(req.query.stars)
        : 0;
    const sales = req.query.sales || "";
    const updatedAtByDay = req.query.updatedAtByDay || "";

    // console.log(limit);
    // console.log(skip);
    console.log(req.query);

    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    const categoryFilter = id_category ? { id_category: id_category } : {};
    const publishedFilter = published
      ? { published: published }
      : { published: true };
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = stars ? { stars: { $gte: stars } } : {};
    const salesFilter = sales == "1" ? { sales: { $gte: 1 } } : {};
    const updatedAtByDayFilter =
      updatedAtByDay == "day"
        ? {
            updatedAt: {
              $gte: startOfDay(new Date()),
              $lte: endOfDay(new Date()),
            },
          }
        : updatedAtByDay == "week"
        ? {
            updatedAt: {
              $gte: startOfWeek(new Date()),
              $lte: endOfWeek(new Date()),
            },
          }
        : updatedAtByDay == "month"
        ? {
            updatedAt: {
              $gte: startOfMonth(new Date()),
              $lte: endOfMonth(new Date()),
            },
          }
        : {};

    const sortOrder =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "lowrated"
        ? { stars: 1 }
        : order === "toprated"
        ? { stars: -1 }
        : order === "lowsale"
        ? { sales: 1 }
        : order === "highsale"
        ? { sales: -1 }
        : order === "lowname"
        ? { name: 1 }
        : order === "highname"
        ? { name: -1 }
        : order === "lowsearchname"
        ? { searchName: 1 }
        : order === "highsearchname"
        ? { searchName: -1 }
        : order === "lowupdated"
        ? { updatedAt: 1 }
        : order === "highupdated"
        ? { updatedAt: -1 }
        : order === "lowcreated"
        ? { createdAt: 1 }
        : { createdAt: -1 };

    console.log(sortOrder);
    const objFilter = {
      ...nameFilter,
      ...categoryFilter,
      ...publishedFilter,
      ...priceFilter,
      ...ratingFilter,
      ...salesFilter,
      ...updatedAtByDayFilter,
    };
    console.log(objFilter);

    let count = null;
    try {
      // if (id_category) {
      //   count = await Book.countDocuments(objFilter);
      // } else count = await Book.countDocuments({ published: true });

      count = await Book.countDocuments(objFilter);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err });
      return;
    }
    console.log(count);
    // return res.json({ msg: "fail" });

    const pipeline = [
      {
        $addFields: {
          searchName: { $toString: "$name" },
        },
      },
      {
        $match: objFilter,
      },
      {
        $sort: sortOrder,
      },
      { $skip: pageSize * (page - 1) },
      { $limit: pageSize },
      {
        $project: {
          name: 1,
          searchName: 1,
          img: 1,
          published: 1,
          price: 1,
          quantity: 1,
          stars: 1,
          reviewCount: 1,
          sales: 1,
          id_category: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];
    const products = await Book.aggregate(pipeline);
    return res.status(200).json({
      success: true,
      code: 200,
      products,
      size: products.length,
      page,
      pages: Math.ceil(count / pageSize),
      // page,
      // totalPage,
    });
  })
);

bookRouter.post(
  "/api/get-best-seller-product-top-10/by-week",
  expressAsyncHandler(async (req, res) => {
    // console.log(startOfWeek(new Date()));
    // console.log(endOfWeek(new Date()));

    let matchCriteria = {};
    const { id_category, week, month } = req.body;
    // console.log(req.body);
    if (id_category && parseInt(week) == 1) {
      matchCriteria["id_category"] = id_category;
      matchCriteria["sales"] = {
        $gte: 1,
      };
      matchCriteria["published"] = true;
      matchCriteria["updatedAt"] = {
        $gte: startOfWeek(new Date()),
        $lte: endOfWeek(new Date()),
      };
    } else if (id_category && parseInt(month) == 1) {
      matchCriteria["id_category"] = id_category;
      matchCriteria["sales"] = {
        $gte: 1,
      };
      matchCriteria["published"] = true;
      matchCriteria["updatedAt"] = {
        $gte: startOfMonth(new Date()),
        $lte: endOfMonth(new Date()),
      };
    } else if (parseInt(week) == 1) {
      matchCriteria["sales"] = {
        $gte: 1,
      };
      matchCriteria["published"] = true;
      matchCriteria["updatedAt"] = {
        $gte: startOfWeek(new Date()),
        $lte: endOfWeek(new Date()),
      };
    } else if (parseInt(month) == 1) {
      matchCriteria["sales"] = {
        $gte: 1,
      };
      matchCriteria["published"] = true;
      matchCriteria["updatedAt"] = {
        $gte: startOfMonth(new Date()),
        $lte: endOfMonth(new Date()),
      };
    } else {
      matchCriteria["sales"] = {
        $gte: 1,
      };
      matchCriteria["published"] = true;
      matchCriteria["updatedAt"] = {
        $gte: startOfWeek(new Date()),
        $lte: endOfWeek(new Date()),
      };
    }
    console.log(matchCriteria);

    const pipeline = [
      {
        $match: matchCriteria,
      },
      {
        $sort: { sales: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          name: 1,
          img: 1,
          stars: 1,
          price: 1,
          reviewCount: 1,
          published: 1,
          quantity: 1,
          sales: 1,
          updatedAt: 1,
          id_category: 1,
        },
      },
    ];
    const products = await Book.aggregate(pipeline);
    return res.status(200).json({ success: true, code: 200, data: products });
  })
);

bookRouter.post(
  "/api/get-list-category-ids",
  expressAsyncHandler(async (req, res) => {
    const pipeline = [
      {
        $match: { isEnabled: true },
      },
      {
        $sort: { name: 1 },
      },
      // {
      //   $limit: 10,
      // },
      {
        $project: {
          name: 1,
          isEnabled: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];
    const categorys = await Category.aggregate(pipeline);
    return res.status(200).json({ success: true, code: 200, data: categorys });
  })
);

bookRouter.post(
  "/api/get-best-seller-product-all-pagination/by-week",
  expressAsyncHandler(async (req, res) => {
    console.log(startOfWeek(new Date()));
    console.log(endOfWeek(new Date()));

    let matchCriteria = {};
    let name = req.body.name || "";
    const { week, month, id_category } = req.body;

    console.log(name);
    // console.log(name != "");
    // if (typeof name === "string" || name instanceof String) console.log("succ");

    if (
      name != "" &&
      name !== null &&
      name !== undefined &&
      parseInt(week) == 1
    ) {
      matchCriteria["name"] = {
        $regex: name,
        $options: "i",
      };
      matchCriteria["sales"] = {
        $gte: 1,
      };
      matchCriteria["published"] = true;
      matchCriteria["updatedAt"] = {
        $gte: startOfWeek(new Date()),
        $lte: endOfWeek(new Date()),
      };
    } else if (
      name != "" &&
      name !== null &&
      name !== undefined &&
      parseInt(month) == 1
    ) {
      console.log("name test");
      matchCriteria["name"] = {
        $regex: name,
        $options: "i",
      };
      matchCriteria["sales"] = {
        $gte: 1,
      };
      matchCriteria["published"] = true;
      matchCriteria["updatedAt"] = {
        $gte: startOfMonth(new Date()),
        $lte: endOfMonth(new Date()),
      };
    } else if (
      id_category != "" &&
      id_category !== null &&
      id_category !== undefined &&
      parseInt(week) == 1
    ) {
      console.log("name test");
      matchCriteria["id_category"] = id_category;
      matchCriteria["name"] = {
        $regex: name,
        $options: "i",
      };
      matchCriteria["sales"] = {
        $gte: 1,
      };
      matchCriteria["published"] = true;
      matchCriteria["updatedAt"] = {
        $gte: startOfMonth(new Date()),
        $lte: endOfMonth(new Date()),
      };
    } else if (parseInt(week) == 1) {
      matchCriteria["name"] = {
        $regex: "",
        $options: "i",
      };
      matchCriteria["sales"] = {
        $gte: 1,
      };
      matchCriteria["published"] = true;
      matchCriteria["updatedAt"] = {
        $gte: startOfWeek(new Date()),
        $lte: endOfWeek(new Date()),
      };
    } else if (parseInt(month) == 1) {
      matchCriteria["name"] = {
        $regex: "",
        $options: "i",
      };
      matchCriteria["sales"] = {
        $gte: 1,
      };
      matchCriteria["published"] = true;
      matchCriteria["updatedAt"] = {
        $gte: startOfMonth(new Date()),
        $lte: endOfMonth(new Date()),
      };
    } else {
      matchCriteria["name"] = {
        $regex: "",
        $options: "i",
      };
      matchCriteria["sales"] = {
        $gte: 1,
      };
      matchCriteria["published"] = true;
      matchCriteria["updatedAt"] = {
        $gte: startOfWeek(new Date()),
        $lte: endOfWeek(new Date()),
      };
    }
    console.log(matchCriteria);

    let sortCriteria = {};
    const defaultSort = -1;
    const { sales, price, createdAt, searchName } = req.body;
    if (sales) {
      sortCriteria["sales"] = parseInt(sales);
    } else if (price) {
      sortCriteria["price"] = parseInt(price);
    } else if (createdAt) {
      sortCriteria["createdAt"] = parseInt(createdAt);
    } else if (searchName) {
      sortCriteria["searchName"] = parseInt(searchName);
    } else {
      sortCriteria["sales"] = defaultSort;
    }
    console.log(sortCriteria);

    let count = null;
    try {
      if (
        name != "" &&
        name !== null &&
        name !== undefined &&
        parseInt(week) == 1
      ) {
        count = await Book.countDocuments({
          name: { $regex: name, $options: "i" },
          sales: { $gte: 1 },
          published: true,
          updatedAt: {
            $gte: startOfWeek(new Date()),
            $lte: endOfWeek(new Date()),
          },
        });
      } else if (
        name != "" &&
        name !== null &&
        name !== undefined &&
        parseInt(month) == 1
      ) {
        count = await Book.countDocuments({
          name: { $regex: name, $options: "i" },
          sales: { $gte: 1 },
          published: true,
          updatedAt: {
            $gte: startOfWeek(new Date()),
            $lte: endOfWeek(new Date()),
          },
        });
      } else if (
        id_category != "" &&
        id_category !== null &&
        id_category !== undefined &&
        parseInt(week) == 1
      ) {
        count = await Book.countDocuments({
          id_category: id_category,
          name: { $regex: name, $options: "i" },
          sales: { $gte: 1 },
          published: true,
          updatedAt: {
            $gte: startOfWeek(new Date()),
            $lte: endOfWeek(new Date()),
          },
        });
      } else if (parseInt(week) == 1) {
        count = await Book.countDocuments({
          name: { $regex: "", $options: "i" },
          sales: { $gte: 1 },
          published: true,
          updatedAt: {
            $gte: startOfWeek(new Date()),
            $lte: endOfWeek(new Date()),
          },
        });
      } else {
        count = await Book.countDocuments({
          name: { $regex: "", $options: "i" },
          sales: { $gte: 1 },
          published: true,
          updatedAt: {
            $gte: startOfMonth(new Date()),
            $lte: endOfMonth(new Date()),
          },
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err });
      return;
    }
    console.log(count);

    let perPage = parseInt(req.body.size) || 10; //số lượng sản phẩm xuất hiện trên 1 page
    let totalPage = parseInt((count - 1) / perPage + 1);
    // const { name } = req.body;
    let page = parseInt(req.body.page) || 1;
    if (parseInt(page) < 1 || parseInt(page) > totalPage) {
      return res.json({ data: [], msg: "Invalid page", totalPage });
    }

    const pipeline = [
      {
        $addFields: {
          searchName: { $toString: "$name" },
        },
      },
      {
        $match: matchCriteria,
      },
      {
        $sort: sortCriteria,
      },
      {
        $skip: perPage * (page - 1),
      },
      {
        $limit: perPage,
      },
      {
        $project: {
          name: 1,
          searchName: 1,
          img: 1,
          stars: 1,
          price: 1,
          reviewCount: 1,
          published: 1,
          quantity: 1,
          sales: 1,
          updatedAt: 1,
          id_category: 1,
        },
      },
    ];
    const products = await Book.aggregate(pipeline);
    return res.status(200).json({
      success: true,
      code: 200,
      data: products,
      currPage: page,
      totalPage,
      pageSizeOnePage: products.length,
    });
  })
);

export default bookRouter;
