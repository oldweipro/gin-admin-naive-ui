import { defineStore } from 'pinia';
import { store } from '@/store';
import { getCurrentUserWallets } from '@/api/transaction/transaction';

export interface WalletState {
  showModal: boolean;
  fishCoin: string;
}

export const useWalletStore = defineStore({
  id: 'app-wallet',
  state: (): WalletState => ({
    showModal: false,
    fishCoin: '0',
  }),
  getters: {
    getShowModal(): boolean {
      return this.showModal;
    },
  },
  actions: {
    setShowModal(showModal: boolean) {
      this.showModal = showModal;
    },
    async syncFishCoin(): Promise<string> {
      const { code, data } = await getCurrentUserWallets();
      if (code === 0) {
        this.fishCoin = data.balance;
      }
      return this.fishCoin;
    },
  },
});

// Need to be used outside the setup
export function useWallet() {
  return useWalletStore(store);
}
