<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域  -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position='top'
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave='beforeTableave'
          @tab-click='tabClicked'
        >
          <!-- ---------------------------------------------------- -->
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品名称"
              prop="goods_name"
            >
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
            >
              <el-input
                v-model="addForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              prop="goods_weight"
            >
              <el-input
                v-model="addForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              prop="goods_number"
            >
              <el-input
                v-model="addForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品分类"
              prop="goods_cat"
            >
              <el-cascader
                :options="addlist"
                :props="addProps"
                v-model="addForm.goods_cat"
                expand-trigger="hover"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- -------------------------------------------------------- -->
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="(item) in  manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  v-for="item1 in  item.attr_vals"
                  :key="item1.attr_id"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <el-form-item
              :label="item2.attr_name"
              v-for="(item2) in onlyTableData"
              :key="item2.attr_id"
            >
              <el-input v-model="item2.attr_vals">

              </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name="3"
          >

            <!-- 上传图片 -->
            <!-- action图片要上传的后台API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers='headerObj'
              :on-success='handelSuccess'
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <!-- 富文本编辑器组件-->
            <quill-editor v-model="addForm.goods_introduce">

            </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button
              type="primary"
              class="btn"
              @click="add"
            >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <img
        :src="previewPath"
        alt=""
        class="previewimg"
      >
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      // 添加商品的表单对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情
        goods_introduce: '',
        attrs: []
      },
      // 动态参数列表数据
      manyTableData: {},
      // 静态属性列表区域
      onlyTableData: {},
      // 商品分类列表
      addlist: [],
      addProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 上传图片的url地址
      uploadURL: 'http://vue-shop-api.itheima.net/api/private/v1/upload',
      // 图片预览
      previewPath: '',
      // 图片预览
      dialogVisible: false,
      // 图片上传组件的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },

      // 添加表单的验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输商品名称', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输商品名称', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输商品名称', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输商品名称', trigger: 'blur' }]

      }

    }
  },
  created () {
    this.getAddList()
  },
  methods: {
    // 获取所有商品分类数据
    async   getAddList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
      this.addlist = res.data
      console.log(this.addlist)
    },
    // 级联选择器选中选变化，触发这个函数
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTableave (activeName, oldActiveName) {
      // console.log('即将离开' + oldActiveName)
      // console.log('即将进入' + activeName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 点击获取索引，发起请求
    // 证明访问的是动态参数面板
    async tabClicked () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.addId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? []
            : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.addId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
        this.onlyTableData = res.data
        console.log(res.data)
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url
      console.log(file)
      this.dialogVisible = true
    },
    // 处理图片的移出事件
    handleRemove (file) {
      console.log(file)
      // 获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pic数组中找到这个图片的对应的索引值
      const i = this.addForm.pics.findIndex(x =>
        x.pic === filePath
      )
      // 调用splice方法把图片对象从pics数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 监听图片上传成功的事件
    handelSuccess (response) {
      console.log(response)
      // 拼接一个图片对象
      const picInfo = { pic: response.data.tmp_path }
      // 将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加商品
    add () {
      this.$refs.addFormRef.validate(async val => {
        if (!val) return this.$message.error('请填写必要的表单项')
        // 执行添加的业务逻辑
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        console.log(form)
        // 发起请求添加商品
        // 商品的名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    addId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin: 0 105px 0 0 !important;
}
.previewimg {
  width: 100%;
}
</style>
