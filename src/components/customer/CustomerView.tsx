import React, { useState } from 'react';
import { MenuItem, StationLoad, ScoredRecommendation, OrderItem, Order } from '../../api/types.ts';
import { RecommendedCarousel } from './RecommendedCarousel.tsx';
import { MenuGrid } from './MenuGrid.tsx';
import { ItemModal } from './ItemModal.tsx';
import { DynamicTray } from './DynamicTray.tsx';
import { OrderTrackerModal } from './OrderTrackerModal.tsx';
import { submitOrder } from '../../api/client.ts';
import { Coffee, Filter, Search } from 'lucide-react';

interface CustomerViewProps {
  menu: MenuItem[];
  stationLoads: StationLoad[];
  recommendations: ScoredRecommendation[];
  quickPickup: ScoredRecommendation[];
  onOrderPlaced: (order: Order) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  menu,
  stationLoads,
  recommendations,
  quickPickup,
  onOrderPlaced
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [trayItems, setTrayItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'coffee', label: 'Espresso Bar' },
    { id: 'cold_brew', label: 'Nitro & Cold Tap' },
    { id: 'bakery', label: 'Bakery & Food' }
  ];

  const filteredMenu = menu.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item: MenuItem, quantity: number, options: Record<string, string>) => {
    setTrayItems(prev => [
      ...prev,
      {
        menuItemId: item.id,
        name: item.name,
        stationType: item.stationType,
        prepTimeSeconds: item.basePrepTimeSeconds,
        price: item.price,
        quantity,
        selectedOptions: options
      }
    ]);
  };

  const handleQuickAdd = (item: MenuItem) => {
    const defaults: Record<string, string> = {};
    if (item.options?.sizes?.length) defaults.size = item.options.sizes[0];
    if (item.options?.milks?.length) defaults.milk = item.options.milks[0];
    handleAddToCart(item, 1, defaults);
  };

  const handleRemoveTrayItem = (index: number) => {
    setTrayItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCheckout = async () => {
    if (trayItems.length === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newOrder = await submitOrder({
        customerName: 'Mobile Guest',
        channel: 'MOBILE',
        items: trayItems.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions
        }))
      });

      setTrayItems([]);
      setActiveOrder(newOrder);
      onOrderPlaced(newOrder);
    } catch (err: unknown) {
      alert(`Order placement error: ${(err as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedItemStationLoad = modalItem
    ? stationLoads.find(l => l.stationType === modalItem.stationType)
    : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-36">
      {/* Dynamic Recommendation Carousel (Steers users to low-load stations) */}
      <RecommendedCarousel
        recommendations={quickPickup.length > 0 ? quickPickup : recommendations}
        onSelectItem={item => setModalItem(item)}
      />

      {/* Category Pills & Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pt-4 border-t border-stone-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search drinks & pastries..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Main Menu Grid */}
      <MenuGrid
        menuItems={filteredMenu}
        stationLoads={stationLoads}
        selectedCategory="all"
        onSelectItem={item => setModalItem(item)}
        onQuickAdd={handleQuickAdd}
      />

      {/* Modal Customizer */}
      <ItemModal
        item={modalItem}
        stationLoad={selectedItemStationLoad}
        onClose={() => setModalItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Sticky Bottom Tray & Mobile Checkout */}
      <DynamicTray
        items={trayItems}
        stationLoads={stationLoads}
        onRemoveItem={handleRemoveTrayItem}
        onCheckout={handleCheckout}
        isSubmitting={isSubmitting}
      />

      {/* Order Status Modal */}
      <OrderTrackerModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
      />
    </div>
  );
};
