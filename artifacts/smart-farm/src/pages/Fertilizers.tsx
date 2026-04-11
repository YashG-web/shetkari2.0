import { AppLayout } from '@/components/layout/AppLayout';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/store/use-app-store';
import { ShoppingCart, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data since there isn't a dedicated endpoint for listing all products
const MOCK_FERTILIZERS = [
  {
    id: 1,
    name: "GroPlus Premium Mix",
    npkRatio: "19-19-19",
    usageInfo: "Foliar spray - 5g per liter of water. Best for vegetative growth stage.",
    platform: "Amazon",
    price: "₹450"
  },
  {
    id: 2,
    name: "BloomBoost P-K",
    npkRatio: "0-52-34",
    usageInfo: "Soil application - 3kg per acre. Ideal for pre-flowering stage.",
    platform: "Blinkit",
    price: "₹850"
  },
  {
    id: 3,
    name: "Urea Fast N",
    npkRatio: "46-0-0",
    usageInfo: "Broadcast application - Use during early growth. Avoid direct contact with leaves.",
    platform: "Amazon",
    price: "₹300"
  },
  {
    id: 4,
    name: "RootBuilder K-Mag",
    npkRatio: "0-0-50",
    usageInfo: "Drip irrigation - 2kg per acre/week. Enhances disease resistance.",
    platform: "AgriStore",
    price: "₹1200"
  }
];

export default function Fertilizers() {
  const tr = useTranslation();
  const { language } = useAppStore();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {tr('nav.fertilizers', language)}
          </h1>
          <p className="text-muted-foreground mt-2">{tr('fert.subtitle', language)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_FERTILIZERS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-3xl overflow-hidden border border-border hover:shadow-xl hover:border-primary/30 transition-all group flex flex-col"
            >
              <div className="h-48 bg-muted/30 flex items-center justify-center p-6 group-hover:bg-primary/5 transition-colors">
                <Sprout className="w-20 h-20 text-primary/40 group-hover:text-primary/60 transition-colors" />
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {tr(item.name, language)}
                  </h3>
                  <div className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
                    NPK: {item.npkRatio}
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mt-2 flex-1">
                  {tr(item.usageInfo, language)}
                </p>
                
                <div className="mt-6 pt-6 border-t flex items-center justify-between">
                  <span className="text-xl font-bold text-foreground">{item.price}</span>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl font-semibold hover:bg-primary transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                    {tr('action.buy', language)}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
