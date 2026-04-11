import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/store/use-app-store";
import { useTranslation } from "@/lib/translations";
import { motion } from "framer-motion";
import { Phone, ShieldAlert, Wrench, HelpCircle, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CONTACTS = [
  {
    id: 'expert',
    titleKey: 'support.expert',
    number: '1800-180-1551',
    descKey: 'support.expert_desc',
    icon: HelpCircle,
    color: 'bg-emerald-500',
    purpose: 'For crop advice'
  },
  {
    id: 'hardware',
    titleKey: 'support.hardware',
    number: '+91 98765 43210',
    descKey: 'support.hardware_desc',
    icon: Wrench,
    color: 'bg-blue-500',
    purpose: 'For device problems'
  },
  {
    id: 'emergency',
    titleKey: 'support.emergency',
    number: '112',
    descKey: 'support.emergency_desc',
    icon: ShieldAlert,
    color: 'bg-red-500',
    purpose: 'For emergencies'
  }
];

export default function Support() {
  const { language } = useAppStore();
  const tr = useTranslation();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <section className="text-center space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-foreground"
          >
            {tr('support.title', language)}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {tr('support.subtitle', language)}
          </motion.p>
        </section>

        {/* Contact Cards */}
        <div className="grid gap-6 max-w-3xl mx-auto">
          {CONTACTS.map((contact, index) => {
            const Icon = contact.icon;
            const iconColorClass = contact.id === 'emergency' ? 'text-red-600 bg-red-50' : 
                                 contact.id === 'expert' ? 'text-emerald-600 bg-emerald-50' : 
                                 'text-blue-600 bg-blue-50';
            
            return (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Card className="group overflow-hidden border-border/60 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center p-6 sm:p-8 gap-6">
                      
                      {/* Left side: Icon and Badge */}
                      <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${iconColorClass}`}>
                          <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>
                        <Badge variant="secondary" className="sm:w-full justify-center text-[10px] font-bold uppercase tracking-tight py-0.5 px-2 bg-muted/50 text-muted-foreground border-none">
                          {contact.purpose.split(' ')[1]}
                        </Badge>
                      </div>

                      {/* Middle: Title, Description, Number */}
                      <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                            {tr(contact.titleKey, language)}
                          </h3>
                          <p className="text-muted-foreground text-sm sm:text-base leading-snug max-w-md">
                            {tr(contact.descKey, language)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-primary">
                          <Phone className="w-4 h-4 opacity-70" />
                          <span className="text-lg sm:text-xl font-display font-semibold tracking-tight">
                            {contact.number}
                          </span>
                        </div>
                      </div>

                      {/* Right side: Action */}
                      <div className="pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:pl-8 border-border/40 w-full sm:w-auto">
                        <Button 
                          asChild
                          className={`w-full h-14 px-10 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 ${
                            contact.id === 'emergency' 
                              ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-200' 
                              : 'bg-primary hover:bg-primary/90 hover:shadow-primary/20'
                          } shadow-lg`}
                        >
                          <a href={`tel:${contact.number.replace(/\s/g, '')}`}>
                            <Phone className="w-5 h-5" />
                            {tr('support.call_now', language)}
                          </a>
                        </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ / Info */}
        <section className="bg-muted/30 rounded-3xl p-8 border border-border/50 text-center max-w-3xl mx-auto">
          <MessageCircle className="w-12 h-12 text-primary/40 mx-auto mb-4" />
          <h4 className="text-lg font-bold mb-2">{tr('support.why_call', language)}</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {tr('support.why_call_desc', language)}
          </p>
        </section>
      </div>
    </AppLayout>
  );
}
