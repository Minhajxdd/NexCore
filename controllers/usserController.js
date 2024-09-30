// Importing Services
import {
  getProducts,
  getProductDetails,
  checkOffers,
} from "../services/user/homeServices.js";

export async function homeGet(req, res) {
  const products = await getProducts();
  res.render("pages/user/home", {
    products,
  });
}

export async function productGet(req, res) {
  if (!req.query.id) return res.redirect("/not-found");
  const product = await getProductDetails(req.query.id);
  if (!product) return res.redirect("/not-found");
  const products = await getProducts();
  const offer = await checkOffers(product._id, product.category);

  res.render("pages/user/product", {
    product,
    products,
    offer
  });
}
