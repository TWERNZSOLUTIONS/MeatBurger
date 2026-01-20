const prisma = require('../prismaClient');

// =========================
// PRODUTOS
// =========================
exports.getProducts = async ({ categoryId, publicOnly = false }) => {
  const where = {};

  if (categoryId) where.categoryId = Number(categoryId);

  // 🔹 Público não vê produto esgotado
  if (publicOnly) where.outOfStock = false;

  return prisma.product.findMany({
    where,
    include: { flavors: true },
    orderBy: { position: 'asc' }
  });
};

exports.getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: { flavors: true }
  });
};

exports.createProduct = async ({
  name,
  description,
  price,
  categoryId,
  position,
  imageUrl,
  outOfStock = false,
  flavors = []
}) => {
  return prisma.product.create({
    data: {
      name,
      description,
      price,
      categoryId,
      position,
      imageUrl,
      outOfStock,
      flavors: {
        create: flavors.map(f => ({
          name: f.name,
          price: f.price !== undefined ? Number(f.price) : 0
        }))
      }
    },
    include: { flavors: true }
  });
};

exports.updateProduct = async (
  id,
  { name, description, price, categoryId, position, imageUrl, outOfStock, flavors }
) => {
  await prisma.product.update({
    where: { id: Number(id) },
    data: { name, description, price, categoryId, position, imageUrl, outOfStock }
  });

  if (flavors !== undefined) {
    const currentFlavors = await prisma.flavor.findMany({ where: { productId: Number(id) } });

    for (const f of flavors) {
      if (f.id) {
        await prisma.flavor.update({
          where: { id: Number(f.id) },
          data: { name: f.name, price: f.price !== undefined ? Number(f.price) : 0 }
        });
      } else {
        await prisma.flavor.create({
          data: { name: f.name, price: f.price !== undefined ? Number(f.price) : 0, productId: Number(id) }
        });
      }
    }

    const flavorIds = flavors.filter(f => f.id).map(f => Number(f.id));

    await prisma.flavor.deleteMany({
      where: { productId: Number(id), id: { notIn: flavorIds } }
    });
  }

  return exports.getProductById(id);
};

// =========================
// ESGOTAR / ATIVAR
// =========================
exports.toggleProductStock = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    select: { outOfStock: true }
  });

  if (!product) throw new Error('Produto não encontrado.');

  return prisma.product.update({
    where: { id: Number(id) },
    data: { outOfStock: !product.outOfStock }
  });
};

// =========================
// DELETE / MOVE
// =========================
exports.deleteProduct = async (id) => {
  await prisma.flavor.deleteMany({ where: { productId: Number(id) } });
  await prisma.product.delete({ where: { id: Number(id) } });
};

exports.moveProduct = async (id, direction) => {
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) throw new Error('Produto não encontrado.');

  const products = await prisma.product.findMany({
    where: { categoryId: product.categoryId },
    orderBy: { position: 'asc' }
  });

  const idx = products.findIndex(p => p.id === Number(id));
  if (idx === -1) throw new Error('Produto não encontrado na lista.');

  let swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= products.length) return product;

  const swapProduct = products[swapIdx];

  await prisma.product.update({ where: { id: product.id }, data: { position: swapProduct.position } });
  await prisma.product.update({ where: { id: swapProduct.id }, data: { position: product.position } });

  return exports.getProductById(id);
};

// =========================
// SABORES
// =========================
exports.getFlavors = async (productId) => {
  return prisma.flavor.findMany({ where: { productId: Number(productId) } });
};

exports.getFlavorById = async (id) => {
  return prisma.flavor.findUnique({ where: { id: Number(id) } });
};

exports.createFlavor = async ({ productId, name, price }) => {
  return prisma.flavor.create({
    data: { productId: Number(productId), name, price: price !== undefined ? Number(price) : 0 }
  });
};

exports.updateFlavor = async (id, { name, price }) => {
  return prisma.flavor.update({
    where: { id: Number(id) },
    data: { name, price: price !== undefined ? Number(price) : 0 }
  });
};

exports.deleteFlavor = async (id) => {
  return prisma.flavor.delete({ where: { id: Number(id) } });
};
