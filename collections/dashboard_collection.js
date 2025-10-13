const Product = require("../models/product");
const Sale = require("../models/sales");
const { getDateRange } = require("../Utility/functions");

// 🧠 Main Dashboard Page
module.exports.dashboard = async (req, res) => {
  try {
    const filter = req.query.filter || "all";
    const dateRange = getDateRange(filter);
    const saleMatch = dateRange ? { createdAt: { $gte: dateRange.start, $lte: dateRange.end } } : {};

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [
      totalProducts,
      totalStockAgg,
      totalValueAgg,
      recentProducts,
      totalSalesAgg,
      totalProfitAgg,
      recentSalesAgg,
      totalSalesCount,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.aggregate([{ $group: { _id: null, total: { $sum: "$stock" } } }]),
      Product.aggregate([{ $group: { _id: null, value: { $sum: { $multiply: ["$stock", "$price"] } } } }]),
      Product.find().sort({ _id: -1 }).limit(5),
      Sale.aggregate([{ $match: saleMatch }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      Sale.aggregate([{ $match: saleMatch }, { $group: { _id: null, total: { $sum: "$profit" } } }]),
      Sale.aggregate([
        { $match: saleMatch },
        { $unwind: "$products" },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            _id: 1,
            date: "$createdAt",
            "productDetails.name": 1,
            "productDetails.category": 1,
            "products.quantity": 1,
            "products.price": 1,
            "products.subtotal": 1,
          },
        },
      ]),
      Sale.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalSalesCount / limit);

    const dashboard = {
      totalProducts,
      totalStock: totalStockAgg[0]?.total || 0,
      totalValue: totalValueAgg[0]?.value || 0,
      totalSales: totalSalesAgg[0]?.total || 0,
      totalProfit: totalProfitAgg[0]?.total || 0,
      recentProducts,
      recentSales: recentSalesAgg,
      page,
      totalPages,
      filter,
    };

    res.render("dashboard/main", dashboard);
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not load dashboard!");
    res.redirect("/products");
  }
};

// 📊 Dynamic Chart Data (Weekly / Monthly)
module.exports.getChartData = async (req, res) => {
  try {
    const period = req.query.period || "weekly";

    // 🕒 Set timezone offset for Philippines (UTC+8)
    const timezoneOffset = 8 * 60 * 60 * 1000;

    let startDate,
      endDate,
      labels = [];

    if (period === "weekly") {
      // 🗓️ Get current week's Monday -> Sunday range in UTC+8
      const today = new Date();
      const local = new Date(today.getTime() + timezoneOffset); // convert to local
      const day = local.getDay() === 0 ? 7 : local.getDay(); // Sunday fix
      startDate = new Date(local.setDate(local.getDate() - (day - 1))); // Monday
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    } else {
      // 📅 Monthly (divide current month into 4 weeks)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      startDate = startOfMonth;
      endDate = endOfMonth;

      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    }

    const aggregation = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $addFields: {
          // Adjust to UTC+8 so grouping uses local date
          localDate: { $add: ["$createdAt", timezoneOffset] },
        },
      },
      {
        $group: {
          _id: period === "weekly" ? { $isoDayOfWeek: "$localDate" } : { $week: "$localDate" },
          totalSales: { $sum: "$total" },
          totalProfit: { $sum: "$profit" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const salesData = [];
    const profitData = [];

    if (period === "weekly") {
      for (let i = 1; i <= 7; i++) {
        const found = aggregation.find((a) => a._id === i);
        salesData.push(found ? found.totalSales : 0);
        profitData.push(found ? found.totalProfit : 0);
      }
    } else {
      for (let i = 1; i <= 4; i++) {
        const found = aggregation.find((a) => a._id === i);
        salesData.push(found ? found.totalSales : 0);
        profitData.push(found ? found.totalProfit : 0);
      }
    }

    // 🗓️ For the title (e.g., "Oct 7–13, 2025")
    const format = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dateRangeLabel = `${format(startDate)} – ${format(endDate)}, ${startDate.getFullYear()}`;

    res.json({ labels, salesData, profitData, dateRangeLabel });
  } catch (err) {
    console.error("Chart data error:", err);
    res.status(500).json({ message: "Error fetching chart data" });
  }
};
