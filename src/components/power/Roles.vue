<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="addRolesVisible=true"
          >添加</el-button>
        </el-col>
      </el-row>
      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRolesVisible"
        width="50%"
        @close='addRolesClosed'
      >
        <!-- 内容主体区域 -->
        <el-form
          :model="addRoles"
          ref="addRolesRef"
          :rules="addRolesRules"
          label-width="100px"
        >
          <el-form-item
            label="角色名称"
            prop="roleName"
          >
            <el-input v-model="addRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            prop="rpleDesc"
          >
            <el-input v-model="addRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addRolesVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addition"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editRolesVisible"
        width="50%"
        @close='editRolesClosed'
      >
        <el-form
          :model="editRoles"
          ref="editRolesRef"
          :rules="editRolesRules"
          label-width="100px"
        >
          <el-form-item label="id">
            <el-input
              v-model="editRoles.roleId"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="角色名称"
            prop="roleName"
          >
            <el-input v-model="editRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            prop="roleDesc"
          >
            <el-input v-model="editRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editRolesVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editRolesInfo"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 角色列表区域 -->
      <el-table
        :data="rolelist"
        border
        stripe
        row-key="id"
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template #default={row}>

            <el-row
              v-for="(item,index) in row.children"
              :key="item.id"
              :class="['bdbottm',index===0?'bdtop':'','vcanter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close='romoveRightById(row,item.id)'
                >{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[,index1===0?'':'bdtop','vcanter']"
                  v-for="(item1,index1) in item.children"
                  :key="item1.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close='romoveRightById(row,item1.id)'
                    >
                      {{item1.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item2) in item1.children"
                      :key="item2.id"
                      type="warning"
                      closable
                      @close='romoveRightById(row,item2.id)'
                    >{{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default={row}>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showRoles(row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showAuthority(row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close='rolesDialo'
    >
      <!-- 树型控件 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key='id'
        default-expand-all
        :default-checked-keys='defkeys'
        ref='treeRef'
      ></el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRoles"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制添加用户对话框的显示与隐藏
      addRolesVisible: false,
      // 添加角色的表单数据
      addRoles: {
        roleName: '',
        roleDesc: ''
      },
      // 控制修改角色框的显示与隐藏
      editRolesVisible: false,
      // 查询到的角色的信息
      editRoles: {},
      // 控制分配权限框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightList: [],
      // 树型控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点id值数组
      defkeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      // 添加用户的表单验证规则
      addRolesRules: {
        roleName: [{ required: true, message: '请输商品名称', trigger: 'blur' }],
        rpleDesc: [{ required: true, message: '请输商品名称', trigger: 'blur' }]
      },
      // 修改用户的表单验证规则
      editRolesRules: {
        roleName: [{ required: true, message: '请输商品名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输商品名称', trigger: 'blur' }]
      }
    }
  },

  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      // 获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolelist = res.data
      console.log(this.rolelist)
    },
    // 监听用户对话框的关闭事件
    addRolesClosed () {
      // this.$refs.addRolesRef.resetFields()
      this.addRoles.roleName = ''
      this.addRoles.roleDesc = ''
    },
    // 点击按钮，添加新用户
    addition () {
      this.$refs.addRolesRef.validate(async val => {
        if (!val) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('roles', this.addRoles)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        if (this.addRoles.roleName === '' || this.addRoles.roleDesc === '') {
          return this.$message.error('输入不能为空')
        }
        this.$message.success('添加角色成功')
        // 隐藏用户对话框
        this.addRolesVisible = false
        // 重新获取用户列表数据
        this.getRolesList()
      })
    },
    // 监听修改用户对话框的关闭事件
    editRolesClosed () {
      this.$refs.editRolesRef.resetFields()
    },
    // 展示编辑用户的对话框
    async showRoles (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败')
      this.editRoles = res.data
      this.editRolesVisible = true
    },
    // 修改用户并提交
    editRolesInfo () {
      this.$refs.editRolesRef.validate(async val => {
        if (!val) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put('roles/' + this.editRoles.roleId, {
          roleName: this.editRoles.roleName,
          roleDesc: this.editRoles.roleDesc
        })
        if (res.meta.status !== 200) return this.$message.error('更新角色信息失败')
        // 关闭对话框
        this.editRolesVisible = false
        // 刷新数据列表
        this.getRolesList()
        // 提示用户成功
        this.$message.success('更新角色成功')
      })
    },
    // 根据id删除对应的用户信息
    async removeById (id) {
    //  弹框询问用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果确认删除则返回值为字符串confirm
      // 如果取消删除则返回值为字符串cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log('确认删除')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户信息失败')
      this.$message.success('删除用户成功')
      this.getRolesList()
    },
    // 根据id删除对应的权限
    async romoveRightById (role, rightId) {
    // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log('确认删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除用户信息失败')
      this.$message.success('删除用户成功')
      role.children = res.data
    },
    // 展示分配权限的对话框
    async   showAuthority (role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$mesage.error('获取权限数据失败')
      }
      // 把获取到的数据保存到data中
      this.rightList = res.data
      console.log(this.rightList)
      // 递归获取三级权限的id
      this.getLeafKeys(role, this.defkeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式获取角色下所有三级权限的id保存到defkeys中
    getLeafKeys (node, arr) {
      // 如果node中不包含children属性则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    rolesDialo () {
      this.defkeys = []
    },
    // 点击为角色分配权限
    async  allotRoles () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')// 给keys中加逗号
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配角色成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eeeeee;
}
.bdbottm {
  border-bottom: 1px solid #eeee;
}
.vcanter {
  display: flex;
  align-items: center;
}
</style>
