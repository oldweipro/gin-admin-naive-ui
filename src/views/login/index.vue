<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <h5 style="font-size: 4em">ChatGPT</h5>
        </div>
        <div class="view-account-top-desc">{{ websiteConfig.loginDesc }}</div>
      </div>
      <div class="view-account-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules"
        >
          <n-form-item path="username">
            <n-input v-model:value="formInline.username" placeholder="请输入用户名/手机号" @keydown.enter="password.focus()">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input
              v-model:value="formInline.password"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码"
              maxlength="36"
              ref="password"
              @keydown.enter="captcha.focus()"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="captcha" v-if="isLogin">
            <n-input ref="captcha" v-model:value="formInline.captcha" placeholder="请输入图形验证码"  @keydown.enter="handleSubmit"/>
            <n-image
              :width="98"
              preview-disabled
              :src="formInline.captchaPic"
              @click="getCaptchaFunc"
            />
          </n-form-item>
          <n-form-item path="smsCode" v-else-if="isRegister || isForgot">
            <n-input
              v-model:value="formInline.smsCode"
              placeholder="请输入短信验证码"
              type="number"
              maxlength="6"
            />
            <n-button type="primary" :disabled="time !== 60" @click="sendCodeFunc">
              {{ time === 60 ? '获取验证码' : `${time}s后重新获取` }}
            </n-button>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial" v-show="false">
                <n-checkbox v-model:checked="autoLogin">自动登录</n-checkbox>
              </div>
              <div class="flex-initial order-last">
                <a
                  href="javascript:"
                  @click="
                    isLogin = false;
                    isRegister = false;
                    isForgot = true;
                    formInline.captcha = '';
                    formInline.smsCode = '';
                  "
                  >忘记密码</a
                >&nbsp;&nbsp;&nbsp;&nbsp;
                <a
                  href="javascript:"
                  @click="
                    isLogin = false;
                    isRegister = true;
                    isForgot = false;
                    formInline.captcha = '';
                    formInline.smsCode = '';
                  "
                  >注册账号</a
                >
              </div>
            </div>
          </n-form-item>
          <n-form-item>
            <n-button
              v-if="isLogin"
              type="primary"
              @click="handleSubmit"
              size="large"
              :loading="loading"
              block
            >
              登录
            </n-button>
            <n-button
              v-else-if="isRegister"
              type="primary"
              @click="handleSubmit"
              size="large"
              :loading="loading"
              block
            >
              注册
            </n-button>
            <n-button
              v-else-if="isForgot"
              type="primary"
              @click="handleSubmit"
              size="large"
              :loading="loading"
              block
            >
              重置密码
            </n-button>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex view-account-other">
              <div class="flex-initial" v-show="false">
                <span>其它登录方式</span>
              </div>
              <div class="flex-initial mx-2" v-show="false">
                <a href="javascript:">
                  <n-icon size="24" color="#2d8cf0">
                    <LogoGithub />
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial mx-2" v-show="false">
                <a href="javascript:">
                  <n-icon size="24" color="#2d8cf0">
                    <LogoFacebook />
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial" style="margin-left: auto">
                <a
                  v-if="!isLogin"
                  href="javascript:"
                  @click="
                    isLogin = true;
                    isRegister = false;
                    isForgot = false;
                    getCaptchaFunc();
                  "
                  >已有账号，去登陆</a
                >
              </div>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from 'naive-ui';
  import { ResultEnum } from '@/enums/httpEnum';
  import { PersonOutline, LockClosedOutline, LogoGithub, LogoFacebook } from '@vicons/ionicons5';
  import { PageEnum } from '@/enums/pageEnum';
  import { websiteConfig } from '@/config/website.config';
  import {
    forgotPasswordWithSmsCode,
    sendSmsCode,
    getCaptcha,
    registerWithSmsCode,
  } from '@/api/system/user';
  interface FormState {
    username: string;
    password: string;
    openCaptcha: boolean;
    captcha: string;
    captchaId: string;
  }
  interface RegisterState {
    username: string;
    password: string;
    smsCode: string;
  }
  interface ForgotPasswordState {
    phone: string;
    password: string;
    smsCode: string;
  }
  const password=ref();
  const captcha=ref();
  const formRef = ref();
  const message = useMessage();
  const loading = ref(false);
  const autoLogin = ref(true);
  // 显示注册模块的标志
  const isRegister = ref(false);
  // 显示登录模块的标志
  const isLogin = ref(true);
  // 显示找回密码模块的标志
  const isForgot = ref(false);
  const time = ref(60);
  const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;

  const formInline = reactive({
    username: '',
    password: '',
    openCaptcha: true,
    smsCode: '',
    captcha: '',
    captchaId: '',
    captchaPic: '',
  });

  const rules = {
    username: { required: true, message: '请输入用户名/手机号', trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' },
  };

  const userStore = useUserStore();

  const router = useRouter();
  const route = useRoute();

  const getCaptchaFunc = async () => {
    const { code, data } = await getCaptcha({});
    if (code === ResultEnum.SUCCESS) {
      formInline.captchaPic = data.picPath;
      formInline.captchaId = data.captchaId;
      formInline.openCaptcha = data.openCaptcha;
    }
  };
  getCaptchaFunc();
  const sendCodeFunc = async () => {
    if (!formInline.username) {
      message.warning('请输入手机号');
      return;
    }
    // 倒计时
    const setIntervalFunc = setInterval(() => {
      time.value--;
      if (time.value === ResultEnum.SUCCESS) {
        time.value = 60;
        clearInterval(setIntervalFunc);
      }
    }, 1000);
    const { code, msg } = await sendSmsCode({ mobile: formInline.username });
    if (code === 0) {
      message.success(msg);
    } else {
      message.warning(msg);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formRef.value.validate(async (errors) => {
      if (!errors) {
        loading.value = true;
        const { username, password, openCaptcha, captcha, captchaId, smsCode } = formInline;
        if (isRegister.value) {
          message.loading('注册中...');
          const params: RegisterState = {
            username,
            password,
            smsCode,
          };
          try {
            const { code, msg } = await registerWithSmsCode(params);
            message.destroyAll();
            if (code === ResultEnum.SUCCESS) {
              message.success(msg || '注册成功');
              isLogin.value = true;
              isRegister.value = false;
              isForgot.value = false;
              await getCaptchaFunc();
            } else {
              message.info(msg || '注册失败');
            }
          } finally {
            loading.value = false;
          }
        } else if (isForgot.value) {
          const params: ForgotPasswordState = {
            phone: username,
            password,
            smsCode,
          };
          try {
            const { code, msg } = await forgotPasswordWithSmsCode(params);
            message.destroyAll();
            if (code === ResultEnum.SUCCESS) {
              message.success(msg || '重置成功');
              isLogin.value = true;
              isRegister.value = false;
              isForgot.value = false;
              await getCaptchaFunc();
            } else {
              message.info(msg || '重置失败');
            }
          } finally {
            loading.value = false;
          }
        } else if (isLogin.value) {
          message.loading('登录中...');
          const params: FormState = {
            username,
            password,
            openCaptcha,
            captcha,
            captchaId,
          };

          try {
            const { code, msg } = await userStore.login(params);
            message.destroyAll();
            if (code == ResultEnum.SUCCESS) {
              const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
              message.success('登录成功，即将进入系统');
              if (route.name === LOGIN_NAME) {
                await router.replace('/');
              } else await router.replace(toPath);
            } else {
              message.info(msg || '登录失败');
              await getCaptchaFunc();
            }
          } finally {
            loading.value = false;
          }
        }
      } else {
        message.error('请填写完整信息，并且进行验证码校验');
      }
    });
  };
</script>

<style lang="less" scoped>
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;

    &-container {
      flex: 1;
      padding: 32px 12px;
      max-width: 384px;
      min-width: 320px;
      margin: 0 auto;
    }

    &-top {
      padding: 32px 0;
      text-align: center;

      &-desc {
        font-size: 14px;
        color: #808695;
      }
    }

    &-other {
      width: 100%;
    }

    .default-color {
      color: #515a6e;

      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
  }

  @media (min-width: 768px) {
    .view-account {
      background-image: url('../../assets/images/login.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 100%;
    }

    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }
</style>
