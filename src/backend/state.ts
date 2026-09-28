import type { MenuItem, StationType, Order, StationLoad, ScoredRecommendation } from '../api/types.ts';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-espresso-1',
    name: 'Artisan Vanilla Bean Latte',
    category: 'coffee',
    stationType: 'ESPRESSO',
    basePrepTimeSeconds: 150,
    price: 6.25,
    marginWeight: 0.85,
    basePopularity: 92,
    description: 'Double shot of house espresso, Madagascar vanilla syrup, micro-textured silky whole milk.',
    imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80',
    tags: ['Espresso', 'Popular', 'Sweet'],
    options: {
      sizes: ['Small (12oz)', 'Medium (16oz)', 'Large (20oz)'],
      milks: ['Whole Milk', 'Oat Milk (+0.75)', 'Almond Milk (+0.75)'],
      sweetness: ['100% Sweet', '50% Sweet', 'Unsweetened']
    }
  },
  {
    id: 'item-espresso-2',
    name: 'Cortado Double Shot',
    category: 'coffee',
    stationType: 'ESPRESSO',
    basePrepTimeSeconds: 120,
    price: 4.75,
    marginWeight: 0.88,
    basePopularity: 84,
    description: 'Equal parts single-origin espresso and warm steamed milk to reduce acidity.',
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80',
    tags: ['Espresso', 'Classic', 'Intense'],
    options: {
      milks: ['Whole Milk', 'Oat Milk (+0.75)']
    }
  },
  {
    id: 'item-espresso-3',
    name: 'Brown Sugar Oat Shaken Espresso',
    category: 'coffee',
    stationType: 'ESPRESSO',
    basePrepTimeSeconds: 180,
    price: 6.75,
    marginWeight: 0.82,
    basePopularity: 96,
    description: 'Blonde espresso hand-shaken with caramelized brown sugar and cinnamon, topped with cold oat milk.',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    tags: ['Espresso', 'Trending', 'Iced'],
    options: {
      sizes: ['Medium (16oz)', 'Large (20oz)'],
      sweetness: ['Standard', 'Light Sweet']
    }
  },
  {
    id: 'item-brew-1',
    name: 'Single-Origin Batch Filter Brew',
    category: 'coffee',
    stationType: 'BATCH_BREW',
    basePrepTimeSeconds: 25,
    price: 4.25,
    marginWeight: 0.94,
    basePopularity: 78,
    description: 'Direct-trade Ethiopian Yirgacheffe batch brewed fresh every 30 minutes. Notes of jasmine, peach, and bergamot.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    tags: ['Batch Brew', 'Fast Pickup', 'High Caffeine'],
    options: {
      sizes: ['Small (12oz)', 'Medium (16oz)', 'Large (20oz)']
    }
  },
  {
    id: 'item-brew-2',
    name: 'Nitro Cascade Cold Brew',
    category: 'cold_brew',
    stationType: 'BATCH_BREW',
    basePrepTimeSeconds: 30,
    price: 5.75,
    marginWeight: 0.91,
    basePopularity: 88,
    description: 'Keg-conditioned slow steep infused with food-grade nitrogen for a velvety head and naturally sweet creaminess.',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
    tags: ['Cold Brew', 'Nitro', 'Instant Pour'],
    options: {
      sizes: ['Medium (16oz)', 'Large (20oz)']
    }
  },
  {
    id: 'item-brew-3',
    name: 'Hibiscus Berry Iced Tea',
    category: 'tea',
    stationType: 'BATCH_BREW',
    basePrepTimeSeconds: 20,
    price: 4.50,
    marginWeight: 0.92,
    basePopularity: 72,
    description: 'Refreshing organic caffeine-free infusion of tart hibiscus petals, elderberries, and orange peel.',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
    tags: ['Tea', 'Caffeine Free', 'Instant Pour']
  },
  {
    id: 'item-bakery-1',
    name: 'Warm Almond Frangipane Croissant',
    category: 'bakery',
    stationType: 'BAKERY',
    basePrepTimeSeconds: 45,
    price: 5.25,
    marginWeight: 0.78,
    basePopularity: 86,
    description: 'Twice-baked flaky French pastry stuffed with rich almond cream and toasted sliced almonds.',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    tags: ['Bakery', 'Warm', 'Fresh Baked'],
    options: {
      sweetness: ['Warmed', 'Room Temperature']
    }
  },
  {
    id: 'item-bakery-2',
    name: 'Cardamom Cinnamon Morning Bun',
    category: 'bakery',
    stationType: 'BAKERY',
    basePrepTimeSeconds: 40,
    price: 4.95,
    marginWeight: 0.79,
    basePopularity: 81,
    description: 'Caramelized laminated dough rolled in crushed Swedish cardamom pods and Saigon cinnamon.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    tags: ['Bakery', 'Signature', 'Spiced']
  },
  {
    id: 'item-bakery-3',
    name: 'Smoked Salmon Everything Bagel',
    category: 'food',
    stationType: 'BAKERY',
    basePrepTimeSeconds: 90,
    price: 9.50,
    marginWeight: 0.72,
    basePopularity: 83,
    description: 'Toasted kettle-boiled bagel with scallion whipped cream cheese, wild lox, capers, and pickled shallots.',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    tags: ['Savory', 'Breakfast', 'Toasted']
  }
];

class CafeStateManager {
  private menu: MenuItem[] = [...INITIAL_MENU_ITEMS];
  private orders: Order[] = [];
  private orderCounter = 101;

  constructor() {
    this.seedInitialOrders();
  }

  private seedInitialOrders() {
    const now = Date.now();
    this.orders = [
      {
        id: `CF-${this.orderCounter++}`,
        customerName: 'Marcus Vance',
        channel: 'WALK_IN',
        items: [
          {
            menuItemId: 'item-espresso-1',
            name: 'Artisan Vanilla Bean Latte',
            stationType: 'ESPRESSO',
            prepTimeSeconds: 150,
            price: 6.25,
            quantity: 1,
            selectedOptions: { milks: 'Oat Milk' }
          }
        ],
        status: 'IN_PREP',
        createdAt: now - 140000,
        prepStartedAt: now - 80000,
        totalPrice: 7.00,
        totalEstimatedPrepTime: 150,
        targetStation: 'ESPRESSO'
      },
      {
        id: `CF-${this.orderCounter++}`,
        customerName: 'Elena Rostova',
        channel: 'MOBILE',
        items: [
          {
            menuItemId: 'item-espresso-3',
            name: 'Brown Sugar Oat Shaken Espresso',
            stationType: 'ESPRESSO',
            prepTimeSeconds: 180,
            price: 6.75,
            quantity: 1
          }
        ],
        status: 'QUEUED',
        createdAt: now - 65000,
        totalPrice: 6.75,
        totalEstimatedPrepTime: 180,
        targetStation: 'ESPRESSO'
      },
      {
        id: `CF-${this.orderCounter++}`,
        customerName: 'David Kim',
        channel: 'MOBILE',
        items: [
          {
            menuItemId: 'item-brew-2',
            name: 'Nitro Cascade Cold Brew',
            stationType: 'BATCH_BREW',
            prepTimeSeconds: 30,
            price: 5.75,
            quantity: 1
          }
        ],
        status: 'READY',
        createdAt: now - 210000,
        prepStartedAt: now - 90000,
        readyAt: now - 30000,
        totalPrice: 5.75,
        totalEstimatedPrepTime: 30,
        targetStation: 'BATCH_BREW'
      },
      {
        id: `CF-${this.orderCounter++}`,
        customerName: 'Sarah Jenkins',
        channel: 'WALK_IN',
        items: [
          {
            menuItemId: 'item-bakery-1',
            name: 'Warm Almond Frangipane Croissant',
            stationType: 'BAKERY',
            prepTimeSeconds: 45,
            price: 5.25,
            quantity: 1
          }
        ],
        status: 'QUEUED',
        createdAt: now - 45000,
        totalPrice: 5.25,
        totalEstimatedPrepTime: 45,
        targetStation: 'BAKERY'
      }
    ];
  }

  public getMenu(): MenuItem[] {
    return this.menu;
  }

  public getOrders(): Order[] {
    return [...this.orders].sort((a, b) => b.createdAt - a.createdAt);
  }

  public getStationLoads(): StationLoad[] {
    const stations: StationType[] = ['ESPRESSO', 'BATCH_BREW', 'BAKERY'];
    const activeOrders = this.orders.filter(o => o.status === 'QUEUED' || o.status === 'IN_PREP');

    return stations.map(station => {
      // Find all active orders that have at least one item targeting this station
      const relevantOrders = activeOrders.filter(o =>
        o.items.some(i => i.stationType === station)
      );
      const activeCount = relevantOrders.length;

      // Calculate total remaining backlog seconds across all items destined for this station
      let backlogSeconds = 0;
      activeOrders.forEach(o => {
        const itemPrep = o.items
          .filter(i => i.stationType === station)
          .reduce((acc, i) => acc + (i.prepTimeSeconds * i.quantity), 0);
        backlogSeconds += itemPrep;
      });

      // Staff allocations (2 baristas on Espresso by default, 1 on Batch, 1 on Bakery)
      const workerCount = station === 'ESPRESSO' ? 2 : 1;
      const effectiveBacklogSeconds = Math.max(0, Math.round(backlogSeconds / workerCount));
      const waitMins = Number((effectiveBacklogSeconds / 60).toFixed(1));

      let status: StationLoad['status'] = 'OPTIMAL';
      if (effectiveBacklogSeconds > 240 || activeCount >= 4) {
        status = 'CONGESTED';
      } else if (effectiveBacklogSeconds > 100 || activeCount >= 2) {
        status = 'MODERATE';
      }

      const displayNames: Record<StationType, string> = {
        ESPRESSO: 'Espresso Bar (La Marzocco)',
        BATCH_BREW: 'Batch & Cold Nitro Tap',
        BAKERY: 'Bakery & Toast Oven'
      };

      return {
        stationType: station,
        displayName: displayNames[station],
        activeOrdersCount: activeCount,
        totalBacklogSeconds: effectiveBacklogSeconds,
        estimatedWaitMinutes: waitMins,
        status,
        workerCount
      };
    });
  }

  public addOrder(orderParams: {
    customerName: string;
    channel: 'MOBILE' | 'WALK_IN';
    items: Array<{
      menuItemId: string;
      quantity: number;
      selectedOptions?: Record<string, string>;
    }>;
  }): Order {
    const resolvedItems = orderParams.items.map(reqItem => {
      const itemDef = this.menu.find(m => m.id === reqItem.menuItemId);
      if (!itemDef) {
        throw new Error(`Menu item not found: ${reqItem.menuItemId}`);
      }
      return {
        menuItemId: itemDef.id,
        name: itemDef.name,
        stationType: itemDef.stationType,
        prepTimeSeconds: itemDef.basePrepTimeSeconds,
        price: itemDef.price,
        quantity: reqItem.quantity,
        selectedOptions: reqItem.selectedOptions
      };
    });

    const primaryStation = resolvedItems[0]?.stationType || 'ESPRESSO';
    const totalEstTime = resolvedItems.reduce((acc, i) => acc + (i.prepTimeSeconds * i.quantity), 0);
    const totalPrice = resolvedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

    const newOrder: Order = {
      id: `CF-${this.orderCounter++}`,
      customerName: orderParams.customerName || 'Guest Customer',
      channel: orderParams.channel,
      items: resolvedItems,
      status: 'QUEUED',
      createdAt: Date.now(),
      totalPrice: Number(totalPrice.toFixed(2)),
      totalEstimatedPrepTime: totalEstTime,
      targetStation: primaryStation
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, nextStatus: Order['status']): Order {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    order.status = nextStatus;
    if (nextStatus === 'IN_PREP' && !order.prepStartedAt) {
      order.prepStartedAt = Date.now();
    } else if (nextStatus === 'READY' && !order.readyAt) {
      order.readyAt = Date.now();
    }

    return order;
  }

  public clearQueue(): void {
    this.orders = this.orders.filter(o => o.status === 'READY' || o.status === 'FULFILLED');
  }

  public simulateRush(): void {
    const rushNames = ['Sophia Lin', 'Alex Rivera', 'Liam Patel', 'Emma Zhao', 'Noah Miller'];
    const espressoItems = this.menu.filter(m => m.stationType === 'ESPRESSO');

    rushNames.forEach((name, idx) => {
      const item = espressoItems[idx % espressoItems.length];
      this.addOrder({
        customerName: name,
        channel: idx % 2 === 0 ? 'MOBILE' : 'WALK_IN',
        items: [{ menuItemId: item.id, quantity: 1 }]
      });
    });
  }
}

export const cafeState = new CafeStateManager();
