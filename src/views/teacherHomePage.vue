<template>
  <div style="height: 100vh;">
    <el-container class="layout-container-demo" style="height: 100%;">
      <el-header style="position: relative; text-align:right; background-color: #0064B1; font-size: 15px; height: 8%">
        <!--右侧按钮-->
        <div style="height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 0">
          <div class="left-div" style="flex-grow: 1; display: flex; align-items: center;  ">
            <img src="../assets/images/logo.png" style="height: 5.5vh;"/>
            <el-text style="font-size: calc(1vw + 6px); color: white; margin-left: 10px;">自动化专业智能教学平台</el-text>
          </div>

          <div style="flex-grow: 2; text-align: center;">
            <el-text style="font-size: calc(1.5vw + 6px); color: white;">2024春季学期</el-text>
          </div>

          <div class="right-div" style="flex-grow: 1; display: flex; align-items: center; justify-content: flex-end;">
            <el-dropdown>
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>查看详情</el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-text style="font-size: calc(1vw + 3px); color: white; margin-left: 10px;">{{loginInfo.username}}</el-text>
          </div>
        </div>


      </el-header>

      <el-container>
        <el-aside width="200px">

          <div
              style="width: 100%; height: auto; padding: 10px 0; background-color: #c8c9cc; display: flex; align-items: center;">
            <!--头像-->
            <div style="width: 76px; height: 105px; margin-left: 10px; overflow: hidden;object-fit: cover;">
              <el-upload style="width: 100%; height: 100%; display: flex;" class="avatar-uploader"
                         action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :show-file-list="false"
                         :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <!-- action属性指定了文件上传的目标服务器地址 -->
                <!-- show-file-list属性设置为false，表示不显示已选择的文件列表 -->
                <!-- on-success属性是一个事件回调函数，当文件上传成功时，该函数将被调用 -->
                <!-- before-upload属性是一个事件回调函数，当文件准备上传时，该函数将被调用 -->
                <!-- 如果imageUrl有值，则显示这个图片，否则不显示 -->
                <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 100%; height: 120%; object-fit: cover;"/>
                <!-- 如果imageUrl没有值，则显示提示文本-->
                <el-text v-else size="small" style="width:72px; color:white">点击上传头像</el-text>
              </el-upload>
            </div>
            <div style="width: 88px; margin: 0 15px 0 15px">
              <el-row :gutter="0">
                <p style="font-size:14px;margin-left:1px;line-height:0.3;">{{loginInfo.username}}</p>
              </el-row>
              <el-row :gutter="0">
                <p style="font-size:14px;margin-left: 2px;color:cornflowerblue;line-height:0.2;">{{loginInfo.rolename}}</p>
              </el-row>
              <el-row :gutter="0" style="height:20px;margin-top: 20px">
                <el-col :span="5">
                  <el-icon style="float:left;margin-top:2px;margin-left:1px;color:blue">
                    <Platform/>
                  </el-icon>
                </el-col>
                <el-col :span="7" style="">
                  <p style="font-size:10px;line-height:0">在线</p>
                </el-col>
                <el-col :span="5">
                  <el-icon style="float:left;margin-top:2px;margin-left:3px">
                    <Right/>
                  </el-icon>
                </el-col>
                <el-col :span="7" style="">
                  <p style="font-size:10px;line-height:0">注销</p>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 使用 el-scrollbar 包裹 el-menu，设置高度为 70% -->

          <!--页面左侧导航栏-->
          <el-scrollbar style="height: 70%">
            <el-menu :default-active="defaultActive">
              <template v-for="menu in filteredMenus">
                <el-sub-menu v-if="hasChildren(menu)" :index="menu.id" :key="menu.id">
                  <template #name>
                    <span>{{ menu.name }}</span>
                  </template>
                  <el-menu-item v-for="child in getChildrenMenus(menu.id)" :index="child.url" :key="child.id"
                                @click="navigateTo(child.url)">
                    <span>{{ child.name }}</span>
                  </el-menu-item>
                </el-sub-menu>
                <el-menu-item v-else :index="menu.url" :key="menu.id" @click="navigateTo(menu.url)">
                  <span>{{ menu.name }}</span>
                </el-menu-item>
              </template>
            </el-menu>
          </el-scrollbar>
        </el-aside>

        <el-main>
          <!-- 在 el-main 区域显示路由组件 -->
          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive,computed, onMounted,toRaw } from 'vue'
import {useRoute, useRouter} from 'vue-router';
import request from "../utils/request.js";
import {ElMessage,} from 'element-plus'
import {Menu as IconMenu, Message, Setting, Plus, Platform, Right} from '@element-plus/icons-vue'
import type {UploadProps} from 'element-plus'
import {useProfileStore} from "../stores/profileStore.js";


//获取Stroe
const profileStore = useProfileStore();

const defaultActive = ref('');
const route = useRoute();
const router = useRouter(); // 获取路由实例

const imageUrl = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')
// const imageUrl = ref('')

// 定义处理上传成功的函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response, // 上传成功后的响应数据
    uploadFile // 上传的文件对象
) => {
  // 使用 FileReader API 创建一个临时的 URL，以便可以在网页上查看图片
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
// 定义上传前的检查函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 检查文件类型是否为 JPEG 或 PNG 格式
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    // 如果不是 JPEG 或 PNG 格式，则弹出错误消息
    ElMessage.error('Avatar picture must be JPG or PNG format!')
    // 并返回 false 阻止上传操作
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    // 检查文件大小是否不超过 2MB
    ElMessage.error('Avatar picture size can not exceed 5MB!')
    return false
  }
  // 如果文件格式和大小都符合要求，则返回 true 允许上传
  return true
}

// 清除登录信息的方法
function clearLoginInfo() {
  // 清除其他可能存储的信息
  sessionStorage.removeItem('users');
  sessionStorage.removeItem('isLoggedIn');
}

//登出的方法
const handleLogout = () => {
  clearLoginInfo();
  router.push({name: 'Login'}); // 假设您的登录路由的名字是 'Login'
};

// 默认显示菜单
// const defaultActive = ref('');

const menus = ref([
]);

const loginInfo = reactive ({
  username:profileStore.profilename,
  rolename: profileStore.profilerolename,
  catelog: profileStore.profilecatelog,
  currentterm: profileStore.currentterm
});

//0310将homeurl修改为响应式计算属性，这样下面的profileStore中的值变了这边也会自动变，解决拼接地址存在问题情况

const homeurl = computed(() => profileStore.profilehomeurl);
const excludedPids = ['0', '102'];

//过滤器
  const filteredMenus = computed(() => {
    return menus.value
        .filter(menu => !excludedPids.includes(menu.pid))
        //0311加入菜单按顺序排列
        .sort((a,b) =>a.orderno - b.orderno);
  });

//过滤节点是否有孩子节点
  const hasChildren = (menu) => {
    return menus.value.some(child => child.pid === menu.id);
  };
//获取节点的孩子节点
  const getChildrenMenus = (parentId) => {
    return menus.value.filter(menu => menu.pid === parentId);
  };
//路由导航
const navigateTo = (url) => {
  //前面拼一个/表示绝对路径
  console.log(homeurl.value + url)
  router.push(homeurl.value + url);

};

//钩子函数用来刷新后重新获取数据
onMounted(() => {
  const defaultActive = ref('');
  const storedUserInfo = sessionStorage.getItem('users');
  if (storedUserInfo) {
    const userInfo = JSON.parse(storedUserInfo);
    // 更新用户信息到Pinia
    profileStore.setProfileInfo(userInfo.username, userInfo.rolename, userInfo.catelog, userInfo.homeurl, userInfo.token, userInfo.currentterm);
    loginInfo.username = profileStore.profilename;
    loginInfo.rolename = profileStore.profilerolename;
    loginInfo.catelog = profileStore.profilecatelog;
  } else {
    // 如果没有存储的用户信息，可以重定向到登录页面或显示提示信息
    sessionStorage.removeItem('users');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');

    router.push({ name: 'Login' });
    // 或
    // ElMessage.error('请重新登录');
  }
  //获取完pinia中的数据后重新重定向到父页面
  router.push(homeurl.value);

// request.admin.post(`${homeurl}`,loginInfo)
  console.log(1111)
//获取菜单栏的数据
  request.admin.post(`/homes/teacherhome`)
      .then(res => {
        console.log(res)
        // 登录成功
        if (res.code === 200 && res.data.length > 0)  {
          menus.value = res.data;
        }
      }).catch(error => {
    // 获取失败
    ElMessage({
      type: 'error',
      message: '获取导航失败'
    });
  });
});




</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader img,
.avatar-uploader .avatar-uploader-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 确保图片覆盖整个区域 */
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
