const Smtp = require("../models/smtpModel");
// newSmtp = new Smtp({
//   host: "sampleHost",
//   username: "sampleUser",
//   category: "cat1",
//   valid: "valid",
//   type: "smtp",
//   status: "active",
// });
// newSmtp.save();
// Smtp.deleteMany().exec();
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
      res.json({ category: ["cat1", "cat2"], status: ["active", "inactive"] });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = smtpCtrl;
