const Smtp = require("../models/smtpModel");
const Category = require("../models/category");
const category = require("../models/category");

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
// newCategory = new Category({
//   name: "cat1",
// });
// newCategory.save();
// newCategory = new Category({
//   name: "cat2",
// });
// newCategory.save();
// for (let i = 0; i < 200; i++) {
//   newSmtp = new Smtp({
//     host: makeid(5),
//     username: makeid(10),
//     category: Math.random() > 0.5 ? "cat1" : "cat2",
//     valid: Math.random() > 0.5 ? "valid" : "invalid",
//     type: "smtp",
//     status: Math.random() > 0.5 ? "active" : "inactive",
//   });
//   newSmtp.save();
// }

const smtpCtrl = {
  getSmtp: async (req, res) => {
    const keyword = req.query.keyword
      ? {
          host: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const pageSize = Number(req.query.pageSize) || 10;
    const sort = req.query.sortField
      ? {
          [req.query.sortField]: req.query.sortDirection || 1,
        }
      : {};
    const count = await Smtp.countDocuments({ ...keyword });
    const totalPages = Math.ceil(count / pageSize);
    let page = Number(req.query.page) || 1;
    page = page > totalPages ? totalPages : page;
    page = page <= 0 ? 1 : page;

    const smtpLists = await Smtp.find({ ...keyword }, null, {
      sort,
      limit: pageSize,
      skip: pageSize * (page - 1),
    }).lean();

    for (let i = 0; i < smtpLists.length; i++) {
      smtpLists[i].snum = i + pageSize * (page - 1) + 1;
    }
    pages = [];

    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page >= totalPages - 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push("prev3");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else if (page <= 4) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("next3");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push("prev3");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("next3");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      }
    }
    return res.json({
      smtpLists,
      page,
      totalPages,
      pages,
      totalEntries: count,
    });
  },
  createSmtp: async (req, res) => {
    try {
      const smtp = new Smtp(req.body);
      await smtp.save();
      res.json({ msg: "Created a Note" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  editSmtp: async (req, res) => {
    try {
      Smtp.updateOne({ _id: req.body["_id"] }, req.body).exec();
      res.json({ msg: "Updated a Note" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getOptions: async (req, res) => {
    try {
      const resData = { category: [], status: ["active", "inactive"] };
      const results = await Category.find().lean();
      results.forEach((result) => resData.category.push(result.name));
      res.json(resData);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const newCategory = new Category(req.body);
      await newCategory.save();
      res.json({ msg: "Created a Category" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = smtpCtrl;
