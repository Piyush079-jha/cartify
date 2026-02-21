const orderModel = require("../../models/orderModel");

// Create order (mock payment - no gateway)
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;
    const userId = req.userId;

    if (!items || !totalAmount || !deliveryAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || "card",
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      orderStatus: "processing",
    });

    await newOrder.save();

    res.json({
      success: true,
      message: "Order placed successfully!",
      orderId: newOrder._id,
      order: newOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order)
      return res.json({ success: false, message: "Order not found" });
    if (order.userId.toString() !== req.userId.toString())
      return res.json({ success: false, message: "Unauthorized" });
    if (["delivered", "shipped", "cancelled"].includes(order.orderStatus))
      return res.json({
        success: false,
        message: `Cannot cancel a ${order.orderStatus} order`,
      });
    order.orderStatus = "cancelled";
    await order.save();
    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

module.exports = { createOrder, getUserOrders, cancelOrder };