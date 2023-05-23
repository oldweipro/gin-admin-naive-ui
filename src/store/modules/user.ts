import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { getUserInfo as getUserInfoApi, login } from '@/api/system/user';
import { storage } from '@/utils/Storage';

export type UserInfoType = {
  // TODO: add your own data
  userName: string;
  email: string;
};

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoType;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): UserInfoType {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoType) {
      this.info = info;
    },
    // 登录
    async login(params: any) {
      const response = await login(params);
      const { data, code } = response;
      if (code === ResultEnum.SUCCESS) {
        const ex = 7 * 24 * 60 * 60;
        storage.set(ACCESS_TOKEN, data.token, ex);
        storage.set(CURRENT_USER, data.user, ex);
        storage.set(IS_SCREENLOCKED, false);
        this.setToken(data.token);
        this.setUserInfo(data.user);
      }
      return response;
    },

    // 获取用户信息
    async getInfo() {
      const { code, data } = await getUserInfoApi();
      if (code === 0) {
        if (data.userInfo.user.authorities && data.userInfo.user.authorities.length) {
          // 用于v-if hasPermission权限校验用
          const permissionsList = data.userInfo.permissions;
          this.setPermissions(permissionsList);
          this.setUserInfo(data.userInfo.user);
        } else {
          throw new Error('getInfo: permissionsList must be a non-null array !');
        }
        this.setAvatar(data.userInfo.user.headerImg);
      }
      return data.userInfo;
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo({ userName: '', email: '' });
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
