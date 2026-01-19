"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Crown, PiggyBank, Truck, Utensils, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RewardsPageClient() {
  const t = useTranslations('ClientRewardsPage');
  const router = useRouter();
  const { toast } = useToast();

  const [points, setPoints] = useState(2450);
  const [selectedReward, setSelectedReward] = useState<{name: string, cost: number} | null>(null);

  const rewards = [
    { name: t('reward_credit_title'), desc: t('reward_credit_desc'), cost: 1000, icon: PiggyBank, color: 'bg-yellow-100 text-yellow-600' },
    { name: t('reward_shipping_title'), desc: t('reward_shipping_desc'), cost: 500, icon: Truck, color: 'bg-blue-100 text-blue-600' },
    { name: t('reward_knives_title'), desc: t('reward_knives_desc'), cost: 5000, icon: Utensils, color: 'bg-red-100 text-red-600' },
  ];

  const handleRedeemClick = (reward: {name: string, cost: number}) => {
    if (points >= reward.cost) {
      setSelectedReward(reward);
    } else {
      toast({
        variant: 'destructive',
        title: t('not_enough_points_title'),
        description: t('not_enough_points_desc', { cost: reward.cost }),
      });
    }
  };
  
  const confirmRedemption = () => {
    if (!selectedReward) return;
    setPoints(currentPoints => currentPoints - selectedReward.cost);
    toast({
      title: t('redeem_success_title'),
      description: t('redeem_success_desc'),
    });
    setSelectedReward(null);
  };
  
  return (
    <>
      <AlertDialog open={!!selectedReward} onOpenChange={(isOpen) => !isOpen && setSelectedReward(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('redeem_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('redeem_confirm_desc', { rewardName: selectedReward?.name, rewardCost: selectedReward?.cost })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRedemption}>{t('confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="pb-20 md:pb-4">
        {/* Header con botón atrás */}
        <div className="bg-background p-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
        </div>

        {/* Balance de Puntos */}
        <div className="bg-card p-5 text-center md:rounded-b-2xl md:shadow-sm">
          <div className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex flex-col items-center justify-center text-white shadow-lg border-4 border-card">
            <div className="text-3xl font-extrabold leading-none">{points.toLocaleString()}</div>
            <div className="text-xs font-bold uppercase tracking-wider">{t('points_label')}</div>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-primary text-yellow-400 font-bold px-4 py-1.5 rounded-full mt-4">
            <Crown className="h-4 w-4" /> {t('tier_gold')}
          </div>
          <div className="max-w-xs mx-auto mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Oro</span>
              <span>{t('next_level_progress', { points: 550 })}</span>
            </div>
            <Progress value={70} className="h-2 [&>div]:bg-yellow-400" />
          </div>
          <p className="text-xs text-muted-foreground mt-3">{t('points_rule')}</p>
        </div>

        {/* Catálogo de Premios */}
        <div className="px-4 mt-6">
          <h3 className="text-sm font-bold text-muted-foreground uppercase mb-3 px-1">{t('redeem_rewards_title')}</h3>
          <div className="space-y-3">
            {rewards.map((reward) => {
              const isLocked = points < reward.cost;
              return (
                <div
                  key={reward.name}
                  onClick={() => !isLocked && handleRedeemClick(reward)}
                  className={cn(
                    "bg-card rounded-xl p-3 flex items-center gap-4 shadow-sm border transition-transform active:scale-[0.98]",
                    isLocked ? "opacity-60 filter grayscale cursor-not-allowed" : "cursor-pointer"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center shrink-0", reward.color)}>
                    <reward.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-grow">
                    <h6 className="font-bold text-sm text-foreground">{reward.name}</h6>
                    <p className="text-xs text-muted-foreground">{reward.desc}</p>
                  </div>
                  <div className="text-right bg-muted/50 px-2 py-1 rounded-md shrink-0">
                    <div className="font-bold text-amber-600 text-sm">{reward.cost.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground font-semibold">{t('points_abbr')}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historial de Puntos */}
        <div className="px-4 mt-6">
           <h3 className="text-sm font-bold text-muted-foreground uppercase mb-3 px-1">{t('recent_activity_title')}</h3>
           <div className="bg-card rounded-xl shadow-sm p-3 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                        <p className="font-semibold text-sm">{t('activity_order_label', {orderId: 8852})}</p>
                        <p className="text-xs text-muted-foreground">15 Ene, 2026</p>
                    </div>
                    <p className="font-bold text-green-600">{t('points_earned', {points: 245})}</p>
                </div>
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-sm">{t('activity_redeem_label')}</p>
                        <p className="text-xs text-muted-foreground">10 Ene, 2026</p>
                    </div>
                    <p className="font-bold text-red-600">{t('points_spent', {points: 1000})}</p>
                </div>
           </div>
        </div>

      </div>
    </>
  );
}
