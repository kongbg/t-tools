<template>
  <div class="options">
    <div class="top-tools">
      <a-button type="primary" @click="openRulesBox">新增</a-button>
    </div>
    <a-table class="configs" :columns="columns" :data-source="dataSource">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-switch v-model:checked="record.status" />
          <a-button type="link" @click="openConfigBox">新增</a-button>
          <a-button type="link" @click="editRlue(record)">编辑</a-button>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <div class="inner-item" v-for="item in record.configs" :key="item.id">
          <div class="col"><span class="label">动作类型：</span>{{ getActionName(item.action) }}</div>
          <div class="col" v-if="item.from"><span class="label">参数来源：</span>{{ item.from }}</div>
          <div class="col" v-if="item.paramName"><span class="label">参数名称：</span>{{ item.paramName }}</div>
          <div class="col" v-if="item.domKey"><span class="label">id/类名：</span>{{ item.domKey }}</div>
          <div class="col" >
            <a-button type="link">编辑</a-button>
            <a-button type="link">删除</a-button>
            <a-button type="link">共享</a-button>
          </div>
        </div>
      </template>
    </a-table>

    <a-modal v-model:visible="rulesVisible" title="Basic Modal" @ok="rulesformHandleOk" @cancel="resetRulesForm">
      {{ rulesEditMode }}
      {{ rulesformData }}
      <a-form :model="rulesformData" :rules="rulesformRules" ref="rulesformRef" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="规则名称" name="name">
          <a-input v-model:value="rulesformData.name" />
        </a-form-item>
        <a-form-item label="匹配域名" name="hostname">
          <a-input v-model:value="rulesformData.hostname" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:visible="configVisible" title="Basic Modal111" @ok="configformHandleOk" @cancel="resetConfigForm">
      <a-form :model="configformData" :rules="configformRules" ref="configformRef" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="规则名称" name="name">
          <a-input v-model:value="configformData.name" />
        </a-form-item>
        <a-form-item label="匹配域名" name="hostname">
          <a-input v-model:value="configformData.hostname" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { computed, ref, reactive } from 'vue'
import { message } from 'ant-design-vue';
export default {
  setup() {
    let dataSource = reactive([
      {
        id: 1,
        name: '掘金自动跳转外链',
        hostname: "juejin.cn",
        status: true,
        configs: [
          {
            action: "redirect",
            from: "url",
            paramName: "target",
          },
          {
            action: "redirect",
            from: "url",
            paramName: "target",
          },
          {
            action: "redirect",
            from: "url",
            paramName: "target",
          },
        ],
      },
      {
        id: 2,
        name: '知乎自动关闭登录弹窗',
        hostname: "zhihu.com",
        status: true,
        configs: [
          {
            action: "clickDom",
            domKey: ".Modal-closeButton",
          },
          {
            action: "redirect",
            from: "url",
            paramName: "target",
          },
        ],
      },
      {
        id: 3,
        name: '简书自动跳转外链',
        hostname: "jianshu.com",
        status: false,
        configs: [
          {
            action: "redirect",
            from: "url",
            paramName: "url",
          },
          {
            action: "redirect",
            from: "url",
            paramName: "target",
          },
        ],
      }
    ]);
    let columns = [
      {
        title: "规则名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "匹配域名",
        dataIndex: "hostname",
        key: "hostname",
      },
      {
        title: "操作",
        key: "action",
      }
    ];

    let getActionName = computed((key)=>{
      let actionMap = {
        redirect: '重定向',
        clickDom: '点击dom',
        hideDom: '隐藏dom',
      }
      return (key)=>{
        return actionMap[key] || '未知';
      }
    })

    // 规则弹窗相关
    const rulesformRef = ref();
    let rulesEditMode = ref('add');
    const rulesVisible = ref(false);
    let rulesformData = reactive({
      name: '',
      hostname: ''
    });
    const rulesformRules = {
      name: [
        { required: true, message: '请填写规则名称', trigger: 'blur' },
        { min: 1, max: 15, message: '请输入1-15个字符', trigger: 'blur' },
      ],
      hostname: [
        { required: true, message: '请填写匹配域名', trigger: 'blur' },
        { min: 1, max: 30, message: '请输入1-30个字符', trigger: 'blur' },
      ],
    }
    const openRulesBox = () => {
      rulesVisible.value = true;
    }
    const editRlue = (data) => {
      rulesEditMode.value = 'edit';
      openRulesBox();
    }
    const rulesformHandleOk = () => {
      rulesformRef.value.validate().then(() => {
        const obj = {
          id: parseInt(Math.round() * 10000),
          ...rulesformData,
          status: false,
          configs: []
        }
        if (rulesEditMode.value == 'add') {
          dataSource.push(obj)
        } else {

        }

        resetRulesForm();
        rulesVisible.value = false;
      }).catch(() => {
        message.warning('请检查参数')
      })
    }
    const resetRulesForm = () => {
      rulesEditMode.value = 'add';
      rulesformRef.value.resetFields();
    };


    // 配置弹窗相关
    const configformRef = ref();
    const configVisible = ref(false);
    let configformData = reactive({
      name: '',
      hostname: ''
    });
    const configformRules = {
      name: [
        { required: true, message: '请填写规则名称', trigger: 'blur' },
        { min: 1, max: 15, message: '请输入1-15个字符', trigger: 'blur' },
      ],
      hostname: [
        { required: true, message: '请填写匹配域名', trigger: 'blur' },
        { min: 1, max: 30, message: '请输入1-30个字符', trigger: 'blur' },
      ],
    }
    const openConfigBox = () => {
      configVisible.value = true;
    }
    const configformHandleOk = () => {
      configformRef.value.validate().then(() => {
        const obj = {
          id: parseInt(Math.random() * 10000),
          ...rulesformData,
          status: false,
          configs: []
        }
        dataSource.push(obj)
        resetRulesForm();
        rulesVisible.value = false;
      }).catch(() => {
        message.warning('请检查参数')
      })
    }
    const resetConfigForm = () => {
      configformRef.value.resetFields();
    };


    return {
      dataSource,
      columns,

      getActionName,

      // 规则弹窗相关
      rulesVisible,
      rulesEditMode,
      rulesformRef,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      rulesformData,
      rulesformRules,
      openRulesBox,
      editRlue,
      rulesformHandleOk,
      resetRulesForm,

      // 配置弹窗相关
      configVisible,
      configformRef,
      configformData,
      configformRules,
      openConfigBox,
      configformHandleOk,
      resetConfigForm,
    };
  },
};
</script>
<style lang="scss" scoped>
.options {
  padding: 20px;
  .top-tools {
    text-align: right;
    margin-bottom: 20px;
  }
  .configs {
    .inner-item {
      display: flex;
      margin-left: 64px;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      .col {
        width: 280px;
        .label {
          width: 100px;
          display: inline-block;
        }
      }
    }
  }
}
</style>
