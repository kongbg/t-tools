
<template>
  <div class="popup">
    <!-- <div class="header">header</div>
    <div class="main">main</div> -->
    <div class="footer">
      <div class="btns">
        <a-button type="primary" shape="circle" size="small" @click="goGitHub">
          <template #icon><github-outlined /></template>
        </a-button>
        <a-button type="primary" shape="circle" size="small" class="set" @click="goConfigPage">
          <template #icon><setting-outlined /></template>
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { GithubOutlined, SettingOutlined } from '@ant-design/icons-vue';
export default {
  components: {
    GithubOutlined,
    SettingOutlined
  },
  setup() {
    const goGitHub = () => {
      window.open('https://github.com/kongbg/t-tools')
    }
    const goConfigPage = () => {
      chrome.runtime.openOptionsPage()
    }
    return { goGitHub, goConfigPage };
  },
};
</script>
<style lang="scss" scoped>
  .popup{
    padding: 10px 20px;
    .footer {
      .btns {
        display: flex;
        .ant-btn {
          margin-right: 10px;
          &.set {
            margin-right: 0px;
          }
        }
      }
    }
  }
</style>