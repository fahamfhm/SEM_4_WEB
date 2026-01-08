import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (supports both authenticated users and guests)
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      orderType,
      tableNumber,
      paymentMethod,
      specialNotes,
      guestSessionId,
      guestInfo
    } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one item'
      });
    }

    if (!orderType || !['dine-in', 'takeaway'].includes(orderType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order type'
      });
    }

    if (!paymentMethod || !['card', 'cash'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment method'
      });
    }

    // For guest orders, require guestSessionId and guestInfo
    if (!req.user && (!guestSessionId || !guestInfo?.name || !guestInfo?.phone)) {
      return res.status(400).json({
        success: false,
        error: 'Guest orders require session ID and contact information'
      });
    }

    // Calculate totals
    let subtotal = 0;
    const processedItems = items.map(item => {
      const itemTotal = item.itemTotal || (item.basePrice * item.quantity);
      subtotal += itemTotal;
      return {
        menuItemId: item.menuItemId || item.id,
        name: item.name,
        basePrice: item.basePrice,
        quantity: item.quantity,
        customizations: item.customizations || {},
        itemTotal
      };
    });

    const deliveryFee = orderType === 'takeaway' ? 200 : 0;
    const tax = 0; // Can add tax calculation if needed
    const total = subtotal + deliveryFee + tax;

    // Generate order number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    const orderNumber = `ORD-${year}${month}${day}-${timestamp}`;

    // Create order object
    const orderData = {
      orderNumber,
      items: processedItems,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      paymentMethod,
      specialNotes,
      subtotal,
      deliveryFee,
      tax,
      total,
      status: 'pending',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid'
    };

    // Add user or guest information
    if (req.user) {
      orderData.user = req.user.id;
    } else {
      orderData.guestSessionId = guestSessionId;
      orderData.guestInfo = {
        name: guestInfo.name,
        phone: guestInfo.phone
      };
    }

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
};

// @desc    Get all orders (for authenticated user or guest session)
// @route   GET /api/orders
// @access  Public
export const getOrders = async (req, res) => {
  try {
    const { guestSessionId } = req.query;
    let query = {};

    // If user is authenticated, get their orders
    if (req.user) {
      query.user = req.user.id;
    } 
    // If guest session ID provided, get guest orders
    else if (guestSessionId) {
      query.guestSessionId = guestSessionId;
    } 
    // No authentication and no guest session
    else {
      return res.status(400).json({
        success: false,
        error: 'Authentication or guest session ID required'
      });
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrder = async (req, res) => {
  try {
    const { guestSessionId } = req.query;
    
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Authorization check
    // If user is authenticated, check if order belongs to them
    if (req.user && order.user && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }

    // If guest, check if session matches
    if (!req.user && order.guestSessionId !== guestSessionId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Kitchen only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Update status and timestamps
    order.status = status;
    
    if (status === 'confirmed' && !order.confirmedAt) {
      order.confirmedAt = Date.now();
    } else if (status === 'ready' && !order.preparedAt) {
      order.preparedAt = Date.now();
    } else if (status === 'completed' && !order.completedAt) {
      order.completedAt = Date.now();
    } else if (status === 'cancelled' && !order.cancelledAt) {
      order.cancelledAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      message: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Public (owner only)
export const cancelOrder = async (req, res) => {
  try {
    const { guestSessionId } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Authorization check
    if (req.user && order.user && order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this order'
      });
    }

    if (!req.user && order.guestSessionId !== guestSessionId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        error: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order',
      message: error.message
    });
  }
};

// @desc    Get all orders (Admin/Kitchen view)
// @route   GET /api/orders/all
// @access  Private (Admin/Kitchen)
export const getAllOrders = async (req, res) => {
  try {
    const { status, orderType, limit = 50, page = 1 } = req.query;

    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (orderType) {
      query.orderType = orderType;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('user', 'name email phone');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
};
