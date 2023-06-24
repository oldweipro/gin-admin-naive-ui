<template>
  <div class="layout-header">
    <!--顶部菜单-->
    <div
      class="layout-header-left"
      v-if="navMode === 'horizontal' || (navMode === 'horizontal-mix' && mixMenu)"
    >
      <div class="logo" v-if="navMode === 'horizontal'">
        <img :src="websiteConfig.logo" alt="" />
        <h2 v-show="!collapsed" class="title">{{ websiteConfig.title }}</h2>
      </div>
      <AsideMenu
        v-model:collapsed="collapsed"
        v-model:location="getMenuLocation"
        :inverted="getInverted"
        mode="horizontal"
      />
    </div>
    <!--左侧菜单-->
    <div class="layout-header-left" v-else>
      <!-- 菜单收起 -->
      <div
        class="ml-1 layout-header-trigger layout-header-trigger-min"
        @click="() => $emit('update:collapsed', !collapsed)"
      >
        <n-icon size="18" v-if="collapsed">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon size="18" v-else>
          <MenuFoldOutlined />
        </n-icon>
      </div>
      <!-- 刷新 -->
      <div
        class="mr-1 layout-header-trigger layout-header-trigger-min"
        v-if="headerSetting.isReload"
        @click="reloadPage"
      >
        <n-icon size="18">
          <ReloadOutlined />
        </n-icon>
      </div>
      <!-- 面包屑 -->
      <n-breadcrumb v-if="crumbsSetting.show">
        <template
          v-for="routeItem in breadcrumbList"
          :key="routeItem.name === 'Redirect' ? void 0 : routeItem.name"
        >
          <n-breadcrumb-item v-if="routeItem.meta.title">
            <n-dropdown
              v-if="routeItem.children.length"
              :options="routeItem.children"
              @select="dropdownSelect"
            >
              <span class="link-text">
                <component
                  v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                  :is="routeItem.meta.icon"
                />
                {{ routeItem.meta.title }}
              </span>
            </n-dropdown>
            <span class="link-text" v-else>
              <component
                v-if="crumbsSetting.showIcon && routeItem.meta.icon"
                :is="routeItem.meta.icon"
              />
              {{ routeItem.meta.title }}
            </span>
          </n-breadcrumb-item>
        </template>
      </n-breadcrumb>
    </div>
    <div class="layout-header-right">
      <div
        class="layout-header-trigger layout-header-trigger-min"
        v-for="item in iconList"
        :key="item.icon"
        v-show="false"
      >
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="item.icon" v-on="item.eventObject || {}" />
            </n-icon>
          </template>
          <span>{{ item.tips }}</span>
        </n-tooltip>
      </div>
      <!--切换全屏-->
      <div class="layout-header-trigger layout-header-trigger-min" v-show="false">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="fullscreenIcon" @click="toggleFullScreen" />
            </n-icon>
          </template>
          <span>全屏</span>
        </n-tooltip>
      </div>
      <div class="layout-header-trigger layout-header-trigger-min" v-show="true">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="checkSquareOutlined" @click="checkIn" />
            </n-icon>
          </template>
          <span>签到</span>
        </n-tooltip>
      </div>
      <div class="layout-header-trigger layout-header-trigger-min" v-show="true">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="walletOutlined" @click="showModal = true" />
            </n-icon>
          </template>
          <span>钱包 {{ fishCoin }} 枚</span>
        </n-tooltip>
      </div>
      <!-- 个人中心 -->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-dropdown trigger="hover" @select="avatarSelect" :options="avatarOptions">
          <div class="avatar">
            <n-avatar
              round
              :src="userInfo.headerImg"
              fallback-src="https://cdn.pixabay.com/animation/2023/05/15/09/24/09-24-42-868_512.gif"
            />
          </div>
        </n-dropdown>
      </div>
      <!--设置-->
      <div
        class="layout-header-trigger layout-header-trigger-min"
        @click="openSetting"
        v-show="false"
      >
        <n-tooltip placement="bottom-end">
          <template #trigger>
            <n-icon size="18" style="font-weight: bold">
              <SettingOutlined />
            </n-icon>
          </template>
          <span>项目配置</span>
        </n-tooltip>
      </div>
    </div>
  </div>
  <!--项目配置-->
  <ProjectSetting ref="drawerSetting" />
  <!-- 钱包信息 -->
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    label-placement="center"
    :style="bodyStyle"
    title="钱包"
    size="huge"
    :bordered="false"
    :segmented="segmented"
    aria-modal="true"
    role="dialog"
  >
    <template #header-extra>
      <a>鱼币: {{ fishCoin }} 枚</a>
    </template>
    <n-button secondary strong :render-icon="renderIcon" @click="checkIn">签到 +1 鱼币 </n-button>
    <n-divider />
    <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules" size="medium">
      <n-form-item label="兑换鱼币" path="chatTicket">
        <n-input v-model:value="formValue.chatTicket" placeholder="输入鱼币兑换码" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="recharge">验证</n-button>
      </n-form-item>
    </n-form>
    <template #footer>
      <a></a>
    </template>
  </n-modal>
  <!-- 个人中心 -->
  <n-modal
    v-model:show="showProfileModal"
    class="custom-card"
    preset="card"
    label-placement="center"
    :style="bodyStyle"
    title="个人中心"
    size="huge"
    :bordered="false"
    :segmented="segmented"
    aria-modal="true"
    role="dialog"
  >
    <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules" size="medium">
      <n-form-item label="修改头像" path="chatTicket">
        <n-input v-model:value="formValue.chatTicket" placeholder="输入鱼币兑换码" />
      </n-form-item>
    </n-form>
    <template #footer>
      <a></a>
    </template>
  </n-modal>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, ref, computed, unref, h } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import components from './components';
  import { NDialogProvider, FormInst, useDialog, useMessage, NIcon } from 'naive-ui';
  import { TABS_ROUTES } from '@/store/mutation-types';
  import { UserInfoType, useUserStore } from '@/store/modules/user';
  import { useScreenLockStore } from '@/store/modules/screenLock';
  import ProjectSetting from './ProjectSetting.vue';
  import { AsideMenu } from '@/layout/components/Menu';
  import { useProjectSetting } from '@/hooks/setting/useProjectSetting';
  import { websiteConfig } from '@/config/website.config';
  import { CashOutline as CashIcon } from '@vicons/ionicons5';
  import {
    getCurrentUserWallets,
    handleValidateChatTicket,
    checkInApi,
  } from '@/api/transaction/transaction';

  export default defineComponent({
    name: 'PageHeader',
    components: { ...components, NDialogProvider, ProjectSetting, AsideMenu },
    props: {
      collapsed: {
        type: Boolean,
      },
      inverted: {
        type: Boolean,
      },
    },
    setup(props) {
      const userStore = useUserStore();
      const useLockscreen = useScreenLockStore();
      const message = useMessage();
      const dialog = useDialog();
      const { navMode, navTheme, headerSetting, menuSetting, crumbsSetting, isMobile } =
        useProjectSetting();

      const userInfo = ref<UserInfoType>(userStore.info);
      const formRef = ref<FormInst | null>(null);
      const drawerSetting = ref();
      const fishCoin = ref('0');

      const renderIcon = () => {
        return h(NIcon, null, {
          default: () => h(CashIcon),
        });
      };
      // 签到
      const checkIn = async () => {
        const { code, msg } = await checkInApi();
        if (code === 0) {
          await wallets();
        }
        message.info(msg);
      };

      const wallets = async () => {
        const { code, data } = await getCurrentUserWallets();
        if (code === 0) {
          fishCoin.value = data.balance;
        }
      };
      wallets();
      const showModal = ref(false);
      const showProfileModal = ref(false);
      const formValue = ref({
        chatTicket: '',
      });
      const rules = {
        chatTicket: {
          required: true,
          message: '请输入鱼币兑换码',
          trigger: ['input'],
        },
      };
      const state = reactive({
        fullscreenIcon: 'FullscreenOutlined',
        walletOutlined: 'WalletOutlined',
        checkSquareOutlined: 'CheckSquareOutlined',
        navMode,
        navTheme,
        headerSetting,
        crumbsSetting,
      });

      const getInverted = computed(() => {
        return ['light', 'header-dark'].includes(unref(navTheme))
          ? props.inverted
          : !props.inverted;
      });

      const bodyStyle = {
        width: '400px',
      };

      const segmented = {
        content: 'soft',
        footer: 'soft',
      } as const;

      const mixMenu = computed(() => {
        return unref(menuSetting).mixMenu;
      });

      const getChangeStyle = computed(() => {
        const { collapsed } = props;
        const { minMenuWidth, menuWidth } = unref(menuSetting);
        return {
          left: collapsed ? `${minMenuWidth}px` : `${menuWidth}px`,
          width: `calc(100% - ${collapsed ? `${minMenuWidth}px` : `${menuWidth}px`})`,
        };
      });

      const getMenuLocation = computed(() => {
        return 'header';
      });

      const router = useRouter();
      const route = useRoute();

      const generator: any = (routerMap) => {
        return routerMap.map((item) => {
          const currentMenu = {
            ...item,
            label: item.meta.title,
            key: item.name,
            disabled: item.path === '/',
          };
          // 是否有子菜单，并递归处理
          if (item.children && item.children.length > 0) {
            // Recursion
            currentMenu.children = generator(item.children, currentMenu);
          }
          return currentMenu;
        });
      };

      const breadcrumbList = computed(() => {
        return generator(route.matched);
      });

      const dropdownSelect = (key) => {
        router.push({ name: key });
      };

      // 刷新页面
      const reloadPage = () => {
        router.push({
          path: '/redirect' + unref(route).fullPath,
        });
      };

      // 退出登录
      const doLogout = () => {
        dialog.info({
          title: '提示',
          content: '您确定要退出登录吗',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            userStore.logout().then(() => {
              message.success('成功退出登录');
              // 移除标签页
              localStorage.removeItem(TABS_ROUTES);
              router
                .replace({
                  name: 'Login',
                  query: {
                    redirect: route.fullPath,
                  },
                })
                .finally(() => location.reload());
            });
          },
          onNegativeClick: () => {},
        });
      };

      // 切换全屏图标
      const toggleFullscreenIcon = () =>
        (state.fullscreenIcon =
          document.fullscreenElement !== null ? 'FullscreenExitOutlined' : 'FullscreenOutlined');

      // 监听全屏切换事件
      document.addEventListener('fullscreenchange', toggleFullscreenIcon);

      // 全屏切换
      const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      };
      const recharge = async (e: MouseEvent) => {
        e.preventDefault();
        formRef.value?.validate(async (errors) => {
          if (errors) {
            message.error('请输入鱼币兑换码');
            return;
          }
          // 向后端发起验证
          const { code, msg } = await handleValidateChatTicket({
            ticketValue: formValue.value.chatTicket,
          });
          if (code === 0) {
            const { code, data } = await getCurrentUserWallets();
            if (code === 0) {
              fishCoin.value = data.balance;
              message.info(msg);
            }
          } else {
            message.error(msg);
          }
        });
      };

      // 图标列表
      const iconList = [
        {
          icon: 'SearchOutlined',
          tips: '搜索',
        },
        {
          icon: 'GithubOutlined',
          tips: 'github',
          eventObject: {
            click: () => window.open('https://github.com/jekip/naive-ui-admin'),
          },
        },
        {
          icon: 'LockOutlined',
          tips: '锁屏',
          eventObject: {
            click: () => useLockscreen.setLock(true),
          },
        },
      ];
      const avatarOptions = [
        {
          label: '个人设置',
          key: 1,
        },
        {
          label: '退出登录',
          key: 2,
        },
      ];

      //头像下拉菜单
      const avatarSelect = (key) => {
        switch (key) {
          case 1:
            showProfileModal.value = true;
            break;
          case 2:
            doLogout();
            break;
        }
      };

      function openSetting() {
        const { openDrawer } = drawerSetting.value;
        openDrawer();
      }

      return {
        ...toRefs(state),
        isMobile,
        iconList,
        toggleFullScreen,
        recharge,
        doLogout,
        route,
        dropdownSelect,
        avatarOptions,
        getChangeStyle,
        avatarSelect,
        breadcrumbList,
        reloadPage,
        drawerSetting,
        openSetting,
        getInverted,
        getMenuLocation,
        mixMenu,
        websiteConfig,
        showModal,
        showProfileModal,
        bodyStyle,
        segmented,
        formRef,
        formValue,
        rules,
        fishCoin,
        userInfo,
        checkIn,
        renderIcon,
      };
    },
  });
</script>

<style lang="less" scoped>
  .layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    height: 52px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    transition: all 0.2s ease-in-out;
    width: 100%;
    z-index: 11;

    &-left {
      display: flex;
      align-items: center;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64px;
        line-height: 64px;
        overflow: hidden;
        white-space: nowrap;
        padding-left: 10px;

        img {
          width: auto;
          height: 32px;
          margin-right: 10px;
        }

        .title {
          margin-bottom: 0;
        }
      }

      ::v-deep(.ant-breadcrumb span:last-child .link-text) {
        color: #515a6e;
      }

      .n-breadcrumb {
        display: inline-block;
      }

      &-menu {
        color: var(--text-color);
      }
    }

    &-right {
      display: flex;
      align-items: center;
      margin-right: 20px;

      .avatar {
        display: flex;
        align-items: center;
        height: 64px;
      }

      > * {
        cursor: pointer;
      }
    }

    &-trigger {
      display: inline-block;
      width: 64px;
      height: 64px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      .n-icon {
        display: flex;
        align-items: center;
        height: 64px;
        line-height: 64px;
      }

      &:hover {
        background: hsla(0, 0%, 100%, 0.08);
      }

      .anticon {
        font-size: 16px;
        color: #515a6e;
      }
    }

    &-trigger-min {
      width: auto;
      padding: 0 12px;
    }
  }

  .layout-header-light {
    background: #fff;
    color: #515a6e;

    .n-icon {
      color: #515a6e;
    }

    .layout-header-left {
      ::v-deep(.n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link) {
        color: #515a6e;
      }
    }

    .layout-header-trigger {
      &:hover {
        background: #f8f8f9;
      }
    }
  }

  .layout-header-fix {
    position: fixed;
    top: 0;
    right: 0;
    left: 200px;
    z-index: 11;
  }

  //::v-deep(.menu-router-link) {
  //  color: #515a6e;
  //
  //  &:hover {
  //    color: #1890ff;
  //  }
  //}
</style>
