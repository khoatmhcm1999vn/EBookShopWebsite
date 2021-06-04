import jwt from "jsonwebtoken";
import redis_client from "../../../redis_connect.js";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      user_name: user.user_name,
      is_admin: user.is_admin,
      role: user.role,
      // iat: (Math.floor(Date.now() / 1000) - 60 * 30),
      // iat: new Date(parseInt(Math.floor(Date.now() / 1000) - 60 * 30) * 1000),
    },
    process.env.JWT_ACCESS_SECRET ||
      "9e2fbe2f30f3bee85171dd00f4ff10d6745b120387a6bbcc16e5b5dd3524b8cdcae69586bf183b01b3c88215a4eb339e99ae9d98aab83b44872e972bae355ec4",
    // {
    //   expiresIn: 60 * 30,
    // }
    { expiresIn: process.env.JWT_ACCESS_TIME }
  );
};
export function generateRefreshToken(user) {
  const refresh_token = jwt.sign(
    {
      _id: user._id,
      user_name: user.user_name,
      is_admin: user.is_admin,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET ||
      "901fa0c0364e907c1a857621f4c884f4cbe2f2ab6c1b770822a2d82a573d74cf1ff9777067b52e471920d098a0bc8e4f53917a89cf42f6bc98364a3df8539d34",
    { expiresIn: process.env.JWT_REFRESH_TIME }
  );

  redis_client.get(user._id.toString(), (err, data) => {
    if (err) throw err;
    redis_client.set(
      user._id.toString(),
      JSON.stringify({ token: refresh_token })
    );
  });
  return refresh_token;
}

// <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
{
  /* 
   <tr>
  <td colspan="2">Items Price:</td>
  <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
  </tr>
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
  <tr></tr> */
}
export const payOrderEmailTemplate = (order, address) => {
  // const fullName = order.user.firstName + " " + order.user.lastName;
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  // console.log(orderDate);
  return `<h1>Thanks for shopping with us</h1>
  <p>
  Hi ${order.name},</p>
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
  ${order.name},<br/>
  ${address},<br/>
  ${order.ward},<br/>
  ${order.district},<br/>
  ${order.city},<br/>
  </p>
  <hr/>
  <p>
  Thanks for shopping with us.
  </p>
  `;
};
// ${address.code}<br/>
export const payOrderEmailTemplateLogin = (order, address) => {
  const fullName = order.user.firstName + " " + order.user.lastName;
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  // console.log(orderDate);
  return `<h1>Thanks for shopping with us</h1>
  <p>
  Hi ${fullName},</p>
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
  </p>
  <hr/>
  <p>
  Thanks for shopping with us.
  </p>
  `;
};
