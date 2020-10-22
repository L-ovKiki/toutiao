<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 输入框 -->
          <el-input
            placeholder="请输入内容"
            :v-model="orderlist"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table
        :data="orderlist"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
        ></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="是否付款"
          prop="pay_status"
          width="70px"
        >
          <template #default={row}>
            <el-tag
              type="success"
              v-if="row.pay_status==='1'"
            >已付款</el-tag>
            <el-tag
              type="danger"
              v-else
            >未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="140px"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          prop="create_time"
          width="140px"
        >
          <template #default={row}>
            {{row.create_time | fongst('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
        >
          <template #default={row}>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox(row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showOrderBox(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size=" queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogOrderVisible"
      width="50%"
      @close='addOrderClosed'
    >
      <el-form
        :model="addOrderForm"
        :rules="addOrderFormRules"
        ref="addOrderFormRef"
        label-width="100px"
      >
        <el-form-item
          label="省市区/县"
          prop="addOrder1"
        >
          <el-cascader
            :options="cityData"
            v-model="addOrderForm.addOrder1"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="addOrder2"
        >
          <el-input v-model="addOrderForm.addOrder2"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogOrderVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogOrderVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
    >
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10

      },
      // 获取到的数据列表
      orderlist: [],
      total: 0,
      // 控制修改地址的显示与隐藏
      dialogOrderVisible: false,
      // 级联选择器的双向绑定的值
      addOrderForm: {
        addOrder1: [],
        addOrder2: ''
      },
      // 选择地址
      cityData: cityData,
      // 控制显示物流对话框的显示与隐藏
      progressVisible: false,
      // 获取到的物流信息
      progressInfo: [],
      // 修改地址的表单验证规则
      addOrderFormRules: {
        addOrder1: [{ required: true, message: '请输入省市区/县', trigger: 'blur' }],
        addOrder2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 获取订单数据列表
    async   getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取订单数据列表失败')
      console.log(res)
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox (id) {
      this.dialogOrderVisible = true
    },
    // 监听修改地址对话框的关闭事件
    addOrderClosed () {
      this.$refs.addOrderFormRef.resetFields()
    },
    // 点击显示物流跟踪对话框
    async  showOrderBox (id) {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.progressInfo = res.data
      this.progressVisible = true
      console.log(this.progressInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
