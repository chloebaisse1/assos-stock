"use server";

import prisma from "@/lib/prisma";
import { FormDataType, Product } from "@/type";
import { Category } from "@prisma/client";

export async function checkAndAddAssociation(email: string, name: string) {
  if (!email) return;

  try {
    const existingAssociation = await prisma.association.findUnique({
      where: {
        email,
      },
    });
    if (!existingAssociation && name) {
      await prisma.association.create({
        data: {
          email,
          name,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getAssociation(email: string) {
  if (!email) return;
  try {
    const existingAssociation = await prisma.association.findUnique({
      where: {
        email,
      },
    });
    return existingAssociation;
  } catch (error) {
    console.error(error);
  }
}

export async function createCategory(
  name: string,
  email: string,
  description?: string
) {
  if (!name) return;
  try {
    const association = await getAssociation(email);
    if (!association) {
      throw new Error(" Aucune association trouvée avec cet email.");
    }
    await prisma.category.create({
      data: {
        name,
        description: description || "",
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function updateCategory(
  id: string,
  email: string,
  name: string,
  description?: string
) {
  if (!id || !email || !name) {
    throw new Error(
      "Vous devez fournir un id, un email et un nom pour la mise à jour."
    );
  }
  try {
    const association = await getAssociation(email);
    if (!association) {
      throw new Error(" Aucune association trouvée avec cet email.");
    }
    await prisma.category.update({
      where: {
        id: id,
        associationId: association.id,
      },
      data: {
        name,
        description: description || "",
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteCategory(id: string, email: string) {
  if (!id || !email) {
    throw new Error(
      "Vous devez fournir un id et un email pour la suppression."
    );
  }
  try {
    const association = await getAssociation(email);
    if (!association) {
      throw new Error(" Aucune association trouvée avec cet email.");
    }
    await prisma.category.delete({
      where: {
        id: id,
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function readCategories(
  email: string
): Promise<Category[] | undefined> {
  if (!email) {
    throw new Error("Vous devez fournir un email.");
  }
  try {
    const association = await getAssociation(email);
    if (!association) {
      throw new Error(" Aucune association trouvée avec cet email.");
    }
    const categories = await prisma.category.findMany({
      where: {
        associationId: association.id,
      },
    });
    return categories;
  } catch (error) {
    console.error(error);
  }
}

export async function createProduct(formData: FormDataType, email: string) {
  try {
    const { name, description, price, categoryId, unit, imageUrl } = formData;

    if (!email || !price || !categoryId || !name) {
      throw new Error(
        "Le nom, le prix, la catégorie et l'email sont obligatoires."
      );
    }

    const safeImageUrl = imageUrl || "";
    const safeUnit = unit || "";

    const association = await getAssociation(email);
    if (!association) {
      throw new Error(" Aucune association trouvée avec cet email.");
    }

    await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        imageUrl: safeImageUrl,
        categoryId,
        unit: safeUnit,
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function updateProduct(formData: FormDataType, email: string) {
  try {
    const { id, name, description, price, imageUrl } = formData;

    if (!email || !price || !id || !name) {
      throw new Error(
        "l'Id, le nom, le prix, et l'email sont obligatoires pour la mise à jour du produit."
      );
    }

    const association = await getAssociation(email);
    if (!association) {
      throw new Error(" Aucune association trouvée avec cet email.");
    }

    await prisma.product.update({
      where: {
        id: id,
        associationId: association.id,
      },
      data: {
        name,
        description,
        price: Number(price),
        imageUrl: imageUrl,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProduct(id: string, email: string) {
  try {
    if (!id) {
      throw new Error("L'Id est requis pour la suppréssion du porduit.");
    }

    const association = await getAssociation(email);
    if (!association) {
      throw new Error(" Aucune association trouvée avec cet email.");
    }

    await prisma.product.delete({
      where: {
        id: id,
        associationId: association.id,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function readProducts(
  email: string
): Promise<Product[] | undefined> {
  try {
    if (!email) {
      throw new Error("L'email est requis.");
    }

    const association = await getAssociation(email);
    if (!association) {
      throw new Error(" Aucune association trouvée avec cet email.");
    }

    const products = await prisma.product.findMany({
      where: {
        associationId: association.id,
      },
      include: {
        category: true,
      },
    });

    return products.map((product) => ({
      ...product,
      categoryName: product.category?.name,
    }));
  } catch (error) {
    console.error(error);
  }
}

export async function readProductById(
  productId: string,
  email: string
): Promise<Product | undefined> {
  try {
    if (!email) {
      throw new Error("L'email est requis.");
    }

    const association = await getAssociation(email);
    if (!association) {
      throw new Error(" Aucune association trouvée avec cet email.");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        associationId: association.id,
      },
      include: {
        category: true,
      },
    });
    if (!product) {
      return undefined;
    }
    return {
      ...product,
      categoryName: product.category?.name,
    };
  } catch (error) {
    console.error(error);
  }
}
