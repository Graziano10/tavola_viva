import { PrismaClient } from '@prisma/client';

function sanitizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}


const prisma = new PrismaClient();

async function main() {
  await prisma.restaurantSetting.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      name: 'Tavola Viva',
      reservationSlotMinutes: 30,
      maxSeatsPerSlot: 30,
    },
  });

  const categories = [
    {
      name: 'Antipasti',
      description: 'Selezione iniziale con ingredienti stagionali e preparazioni veloci.',
      items: [
        { name: 'Focaccia Gourmet', priceCents: 900, description: 'Rosmarino, sale Maldon e olio EVO.' },
        { name: 'Tartare Mediterranea', priceCents: 1600, description: 'Manzo, capperi, limone e crema di acciughe.' },
      ],
    },
    {
      name: 'Primi',
      description: 'Pasta fresca e ricette signature del ristorante.',
      items: [
        {
          name: 'Tagliolini al Tartufo',
          priceCents: 2200,
          description: 'Burro nocciola, Parmigiano Reggiano 36 mesi e tartufo nero.',
          variants: [
            { name: 'Extra tartufo', priceDeltaCents: 700 },
            { name: 'Senza lattosio', priceDeltaCents: 200 },
          ],
        },
        {
          name: 'Risotto allo Zafferano',
          priceCents: 1800,
          description: 'Midollo arrosto e riduzione di vitello.',
        },
      ],
    },
    {
      name: 'Dessert',
      description: 'Chiusura dolce con signature dessert e pairing.',
      items: [
        { name: 'Tiramisù Espresso', priceCents: 850, description: 'Savoiardi artigianali e crema al mascarpone.' },
      ],
    },
  ];

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: sanitizeSlug(category.name) },
      update: {
        description: category.description,
      },
      create: {
        name: category.name,
        slug: sanitizeSlug(category.name),
        description: category.description,
      },
    });

    for (const item of category.items) {
      const createdItem = await prisma.menuItem.upsert({
        where: { slug: sanitizeSlug(item.name) },
        update: {
          description: item.description,
          priceCents: item.priceCents,
          categoryId: createdCategory.id,
        },
        create: {
          categoryId: createdCategory.id,
          name: item.name,
          slug: sanitizeSlug(item.name),
          description: item.description,
          priceCents: item.priceCents,
        },
      });

      if ('variants' in item && item.variants) {
        for (const variant of item.variants) {
          await prisma.menuItemVariant.upsert({
            where: {
              id: `${createdItem.id}-${sanitizeSlug(variant.name)}`,
            },
            update: {
              name: variant.name,
              priceDeltaCents: variant.priceDeltaCents,
            },
            create: {
              id: `${createdItem.id}-${sanitizeSlug(variant.name)}`,
              menuItemId: createdItem.id,
              name: variant.name,
              priceDeltaCents: variant.priceDeltaCents,
            },
          });
        }
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
