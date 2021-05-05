import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      is_admin: user.is_admin,
      iat: Math.floor(Date.now() / 1000) - 60 * 30,
    },
    process.env.JWT_SECRET || "shhhhh",
    {
      expiresIn: "2d",
    }
  );
};
// <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
export const payOrderEmailTemplate = (order, address) => {
  const fullName = order.user.firstName + " " + order.user.lastName;
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  console.log(orderDate);
  return `<h1>Thanks for shopping with us</h1>
  <p>
  Hi ${order.user.firstName},</p>
  <p>We have finished processing your order.</p>
  <h2>[Order ${order._id}] (${orderDate})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Product</strong></td>
  <td><strong>Quantity</strong></td>
  <td><strong align="right">Price</strong></td>
  </thead>
  <tbody>
  ${order.products
    .map(
      (item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.count}</td>
    <td align="right"> $${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join("\n")}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Items Price:</td>
  <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Tax Price:</td>
  <td align="right"> $${order.taxPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Shipping Price:</td>
  <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2"><strong>Total Price:</strong></td>
  <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
  </tr>
  <tr>
  <td colspan="2">Payment Method:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </table>
  <h2>Shipping address</h2>
  <p>
  ${fullName},<br/>
  ${address.address},<br/>
  ${address.ward},<br/>
  ${address.district},<br/>
  ${address.city},<br/>
  ${address.code}<br/>
  </p>
  <hr/>
  <p>
  Thanks for shopping with us.
  </p>
  `;
};
